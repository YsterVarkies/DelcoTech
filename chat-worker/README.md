# DelcoTech chat backend (Cloudflare Worker)

Keeps the OpenAI API key secret, adds DelcoTech's business info to every chat,
only accepts requests from delcotech.co.za, and limits each visitor to 10
messages a minute. Model: `gpt-6.1-terra` (OpenAI Responses API).

## Set up (once)

1. Create an OpenAI API key at platform.openai.com, add billing credit, and set a
   monthly spend limit.
2. In this folder, log in to Cloudflare:

       npx wrangler login

3. Add the key as a secret (paste it when asked; it is never stored in the code):

       npx wrangler secret put OPENAI_API_KEY

4. Deploy:

       npx wrangler deploy

   Wrangler prints a URL such as `https://delcotech-chat.<you>.workers.dev`.
5. Put that URL in `CHAT_ENDPOINT` at the top of `../chatbot.js`, then publish the site.

## Changing what the bot knows

Edit `src/knowledge.js` (services, prices, FAQ, contact details), then run
`npx wrangler deploy` again. Keep it in step with `CONFIG` in `../script.js`.

## Other settings

- Allowed sites: `ALLOWED_ORIGINS` in `wrangler.toml`.
- Rate limit: `[[ratelimits]]` in `wrangler.toml`.
- Model, reply length, history length: top of `src/worker.js`.
- Logs: `npx wrangler tail`.
