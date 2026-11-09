/*
 * DelcoTech chat backend (Cloudflare Worker).
 * Keeps the OpenAI API key secret, adds the business knowledge and limits abuse.
 * The website sends { messages: [{role:'user'|'assistant', content:'...'}] } and
 * gets back { reply: '...' }.
 */
import { SYSTEM_PROMPT } from './knowledge.js';

const MODEL = 'gpt-6-luna';
const MAX_MESSAGES = 12;        // only the most recent turns are sent to the model
const MAX_MESSAGE_CHARS = 1000; // per visitor message
const MAX_OUTPUT_TOKENS = 1000; // includes the model's reasoning tokens

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    const originOk = allowed.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': originOk ? origin : allowed[0] || '',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin'
    };
    const json = (body, status = 200) =>
      new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

    if (request.method === 'OPTIONS') return new Response(null, { status: originOk ? 204 : 403, headers: cors });
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
    if (!originOk) return json({ error: 'Forbidden' }, 403);
    if (!env.OPENAI_API_KEY) return json({ error: 'Chat is not configured yet.' }, 500);

    // Rate limit per visitor IP (binding defined in wrangler.toml).
    if (env.CHAT_LIMITER) {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const { success } = await env.CHAT_LIMITER.limit({ key: ip });
      if (!success) return json({ error: 'You are sending messages too quickly. Please wait a minute and try again.' }, 429);
    }

    let body;
    try { body = await request.json(); } catch { return json({ error: 'Invalid request.' }, 400); }

    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const clean = messages
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
      .slice(-MAX_MESSAGES)
      .map(m => ({ role: m.role, content: m.content.trim().slice(0, m.role === 'user' ? MAX_MESSAGE_CHARS : 4000) }));
    if (!clean.length || clean[clean.length - 1].role !== 'user') return json({ error: 'Please type a message.' }, 400);

    try {
      const res = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${env.OPENAI_API_KEY.replace(/\s+/g, '')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL,
          instructions: SYSTEM_PROMPT,
          input: clean,
          max_output_tokens: MAX_OUTPUT_TOKENS,
          reasoning: { effort: 'low' },
          store: false
        })
      });
      const raw = await res.text();
      let data = {};
      try { data = JSON.parse(raw); } catch {}
      if (!res.ok) {
        console.error('OpenAI error', res.status, raw.slice(0, 500));
        return json({ error: 'The assistant is unavailable right now. Please use WhatsApp or email instead.' }, 502);
      }
      const reply = extractText(data);
      if (!reply) return json({ error: 'Sorry, I could not come up with an answer. Please try rephrasing.' }, 502);
      return json({ reply });
    } catch (err) {
      console.error('Request failed', err);
      return json({ error: 'The assistant is unavailable right now. Please use WhatsApp or email instead.' }, 502);
    }
  }
};

// Responses API: collect the text parts of the "message" output items.
function extractText(data) {
  if (typeof data.output_text === 'string' && data.output_text.trim()) return data.output_text.trim();
  return (data.output || [])
    .filter(item => item.type === 'message')
    .flatMap(item => item.content || [])
    .filter(part => part.type === 'output_text' && typeof part.text === 'string')
    .map(part => part.text)
    .join('')
    .trim();
}
