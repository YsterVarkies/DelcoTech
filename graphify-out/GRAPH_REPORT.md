# Graph Report - DelcoTech  (2026-11-09)

## Corpus Check
- Corpus is ~18,291 words - fits in a single context window. You may not need a graph.

## Summary
- 107 nodes · 189 edges · 9 communities
- Extraction: 85% EXTRACTED · 14% INFERRED · 1% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Page Sections & Contact
- Site Script & Config
- 3D Service Tools
- Chat Widget & Orb
- 3D Logo Feature
- Chat Backend Docs
- Setup & Enquiry Docs
- Chat Worker Code
- Showreel & Styling

## God Nodes (most connected - your core abstractions)
1. `Homepage (index.html)` - 26 edges
2. `init()` - 8 edges
3. `DelcoTech Website README` - 8 edges
4. `Contact Section` - 7 edges
5. `DelcoTech Chat Backend (Cloudflare Worker)` - 6 edges
6. `Header and Main Navigation` - 6 edges
7. `Services Section` - 6 edges
8. `Service offerings (websites, API integration, custom software, AI chatbots, hosting)` - 6 edges
9. `render()` - 5 edges
10. `setupEnquiry()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Allowed origins (delcotech.co.za)` --conceptually_related_to--> `sitemap.xml (delcotech.co.za)`  [AMBIGUOUS]
  chat-worker/README.md → robots.txt
- `Bot knowledge base (src/knowledge.js)` --conceptually_related_to--> `Service offerings (websites, API integration, custom software, AI chatbots, hosting)`  [INFERRED]
  chat-worker/README.md → index.html
- `Bot knowledge base (src/knowledge.js)` --conceptually_related_to--> `CONFIG object in script.js`  [INFERRED]
  chat-worker/README.md → README.txt
- `Accessibility and Maintenance` --conceptually_related_to--> `Homepage (index.html)`  [INFERRED]
  README.txt → index.html
- `robots.txt crawl policy` --conceptually_related_to--> `Homepage (index.html)`  [INFERRED]
  robots.txt → index.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Chat flow: chatbot.js to Cloudflare Worker to OpenAI** — chatbot, chat_worker_readme_overview, chat_worker_readme_openai_api [EXTRACTED 0.95]
- **GSAP animation stack (vendor libs, motion.js, hero guard)** — index_gsap_vendor, motion, index_motion_pending_script [INFERRED 0.85]
- **Enquiry flow: form, script.js CONFIG and contact channels** — index_contact_form, script, readme_enquiry_flow, readme_config_object [INFERRED 0.85]

## Communities (9 total, 0 thin omitted)

### Community 0 - "Page Sections & Contact"
Cohesion: 0.18
Nodes (20): About / Feature Section, Contact Section, Contact channels (WhatsApp, phone, email links), DelcoTech Software & AI Solutions brand, FAQ Section, Site Footer, Google Fonts (DM Sans, DM Serif Display, Plus Jakarta Sans), GSAP vendor scripts (gsap, ScrollTrigger, SplitText) (+12 more)

### Community 1 - "Site Script & Config"
Cohesion: 0.18
Nodes (18): availableChannels(), CONFIG, configureContact(), element(), formatPhone(), icons, init(), prepareMessage() (+10 more)

### Community 2 - "3D Service Tools"
Cohesion: 0.22
Nodes (10): animate(), box(), builders, C, createView(), mat(), sphere(), start() (+2 more)

### Community 3 - "Chat Widget & Orb"
Cohesion: 0.29
Nodes (9): bubble(), closeChat(), createOrb(), focusInside(), frame(), openChat(), render(), revealCircle() (+1 more)

### Community 4 - "3D Logo Feature"
Cohesion: 0.33
Nodes (7): buildLogo(), center, letterD(), roundedSquare(), section, start(), webglAvailable()

### Community 5 - "Chat Backend Docs"
Cohesion: 0.22
Nodes (9): Allowed origins (delcotech.co.za), CHAT_ENDPOINT in chatbot.js, Bot knowledge base (src/knowledge.js), OpenAI Responses API (gpt-6.1-terra), DelcoTech Chat Backend (Cloudflare Worker), Rate limit (10 messages/minute), Worker Setup (wrangler login, secret, deploy), CONFIG object in script.js (+1 more)

### Community 6 - "Setup & Enquiry Docs"
Cohesion: 0.22
Nodes (9): Enquiry Form (#enquiry), 3D Tools (Three.js), 3D DelcoTech logo in About circle, Accessibility and Maintenance, How Enquiries Work (WhatsApp / email / copy fallback), Project Files Inventory, Quick Start (static hosting), Six service card 3D models (+1 more)

### Community 7 - "Chat Worker Code"
Cohesion: 0.38
Nodes (5): Worker Settings (origins, rate limit, model, logs), wrangler.toml, SYSTEM_PROMPT, extractText(), fetch()

### Community 8 - "Showreel & Styling"
Cohesion: 0.33
Nodes (6): Showreel Section (See it in action), Showreel video and poster assets, style.css, VideoObject JSON-LD metadata, Changing the Site (file responsibilities), Promo film assets (See it in action)

## Ambiguous Edges - Review These
- `chatbot.js` → `Project Files Inventory`  [AMBIGUOUS]
  README.txt · relation: references
- `Allowed origins (delcotech.co.za)` → `sitemap.xml (delcotech.co.za)`  [AMBIGUOUS]
  chat-worker/README.md · relation: conceptually_related_to

## Knowledge Gaps
- **9 isolated node(s):** `Quick Start (static hosting)`, `OpenAI Responses API (gpt-6.1-terra)`, `Rate limit (10 messages/minute)`, `wrangler.toml`, `Value Strip (commitments)` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 22 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Homepage (index.html)` connect `Page Sections & Contact` to `Site Script & Config`, `3D Service Tools`, `Chat Widget & Orb`, `3D Logo Feature`, `Setup & Enquiry Docs`, `Showreel & Styling`?**
  _High betweenness centrality (0.537) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `Homepage (index.html)` (e.g. with `Accessibility and Maintenance` and `robots.txt crawl policy`) actually correct?**
  _`Homepage (index.html)` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Quick Start (static hosting)`, `OpenAI Responses API (gpt-6.1-terra)`, `Rate limit (10 messages/minute)` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Why does `DelcoTech Chat Backend (Cloudflare Worker)` connect `Chat Backend Docs` to `Chat Worker Code`?**
  _High betweenness centrality (0.169) - this node is a cross-community bridge._
- **Why does `Bot knowledge base (src/knowledge.js)` connect `Chat Backend Docs` to `Page Sections & Contact`, `Site Script & Config`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `chatbot.js` and `Project Files Inventory`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Allowed origins (delcotech.co.za)` and `sitemap.xml (delcotech.co.za)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._