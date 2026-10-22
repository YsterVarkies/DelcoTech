# Graph Report - DelcoTech  (2026-10-22)

## Corpus Check
- Corpus is ~2,815 words - fits in a single context window. You may not need a graph.

## Summary
- 65 nodes · 110 edges · 8 communities
- Extraction: 80% EXTRACTED · 19% INFERRED · 1% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.9)
- Token cost: 165,449 input · 9,000 output

## Community Hubs (Navigation)
- Services & Pricing Content
- Enquiry Channels & Deployment
- Page Structure & Branding
- Page Rendering Functions
- Config & Contact Validation
- Favicon & Brand Mark
- Accessibility & Metadata
- Enquiry Submission Flow

## God Nodes (most connected - your core abstractions)
1. `Enquiry Form (#enquiry)` - 12 edges
2. `Static Enquiry Flow` - 9 edges
3. `init()` - 8 edges
4. `Site Header & Main Navigation` - 8 edges
5. `Pricing Section (#build-list, #ai-list, #plan-list)` - 8 edges
6. `DelcoTech Website Setup Guide` - 7 edges
7. `Contact Section (#email-link)` - 6 edges
8. `setupEnquiry()` - 5 edges
9. `Pre-launch Checklist` - 5 edges
10. `Accessibility Features (skip link, labelled fields, keyboard menu, focus states, reduced motion)` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Enquiry Form (#enquiry)` --references--> `WhatsApp Enquiry Channel`  [INFERRED]
  index.html → README.txt
- `Enquiry Form (#enquiry)` --references--> `Email App Enquiry Channel`  [INFERRED]
  index.html → README.txt
- `POPIA Privacy Notice for Enquiries` --conceptually_related_to--> `Enquiry Form (#enquiry)`  [INFERRED]
  README.txt → index.html
- `Enquiry Form (#enquiry)` --implements--> `Static Enquiry Flow`  [INFERRED]
  index.html → README.txt
- `Accessibility Features (skip link, labelled fields, keyboard menu, focus states, reduced motion)` --references--> `FAQ Section (native details disclosures)`  [INFERRED]
  README.txt → index.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Enquiry Channel Fallback Chain (WhatsApp, email, copy-only)** — readme_whatsapp_enquiry_channel, readme_email_enquiry_channel, readme_copy_only_fallback, index_enquiry_form [INFERRED 0.95]
- **Script-populated Content Sections** — index_services_section, index_pricing_section, index_process_section, index_about_section, index_noscript_note [INFERRED 0.95]
- **DelcoTech Service Offerings** — index_business_websites, index_api_integration, index_custom_software, index_hosting_care_plans, index_ai_chatbots_custom_ai [EXTRACTED 1.00]

## Communities (8 total, 0 thin omitted)

### Community 0 - "Services & Pricing Content"
Cohesion: 0.26
Nodes (13): AI Chatbots & Custom AI (service), API Integration (service), Business Websites (service), Custom Software (service), Enquiry Form (#enquiry), FAQ Section (native details disclosures), Hosting & Monthly Care Plans (service), Noscript Notice (JS required for cards and enquiries) (+5 more)

### Community 1 - "Enquiry Channels & Deployment"
Cohesion: 0.19
Nodes (10): Copy Fallback Panel (#copy-fallback), Google Fonts Stylesheet (DM Sans, DM Serif Display, Plus Jakarta Sans), Preview / Copy-only Fallback, DelcoTech Website Setup Guide, Email App Enquiry Channel, Google Fonts with Offline System Font Fallback, POPIA Privacy Notice for Enquiries, Pre-launch Checklist (+2 more)

### Community 2 - "Page Structure & Branding"
Cohesion: 0.25
Nodes (9): About / Feature Section, Contact Section (#email-link), Hero Section, Process Section (#steps-list), Site Footer (#footer-text), Site Header & Main Navigation, CONFIG Object (WhatsApp number and email in script.js), DelcoTech Software & AI Solutions (brand / trading name) (+1 more)

### Community 3 - "Page Rendering Functions"
Cohesion: 0.28
Nodes (8): element(), init(), renderPrices(), renderServices(), renderSteps(), setBrandText(), setupMobileNavigation(), setupReveal()

### Community 4 - "Config & Contact Validation"
Cohesion: 0.36
Nodes (6): availableChannels(), CONFIG, configureContact(), icons, validEmail(), validWhatsapp()

### Community 5 - "Favicon & Brand Mark"
Cohesion: 0.67
Nodes (4): DelcoTech Brand Palette (navy #101f29, sky blue #7cc8f6, white), C2PA Content Credentials Manifest (Claude-provided provenance), D Monogram Logo Mark (stroked D with dot accent), DelcoTech Favicon (SVG)

### Community 6 - "Accessibility & Metadata"
Cohesion: 0.50
Nodes (4): Mobile Menu Toggle (#menu-toggle), SEO & Open Graph Metadata, Skip to Content Link, Accessibility Features (skip link, labelled fields, keyboard menu, focus states, reduced motion)

### Community 7 - "Enquiry Submission Flow"
Cohesion: 0.67
Nodes (3): prepareMessage(), setupEnquiry(), updateStatus()

## Ambiguous Edges - Review These
- `DelcoTech Software & AI Solutions (brand / trading name)` → `DELITECH heading name (possible brand inconsistency)`  [AMBIGUOUS]
  README.txt · relation: conceptually_related_to

## Knowledge Gaps
- **8 isolated node(s):** `DELITECH heading name (possible brand inconsistency)`, `Server-side Form Provider / Backend (recommended upgrade)`, `SEO & Open Graph Metadata`, `Google Fonts Stylesheet (DM Sans, DM Serif Display, Plus Jakarta Sans)`, `Skip to Content Link` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 12 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Enquiry Form (#enquiry)` connect `Services & Pricing Content` to `Enquiry Channels & Deployment`, `Page Structure & Branding`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `Enquiry Form (#enquiry)` (e.g. with `Email App Enquiry Channel` and `Static Enquiry Flow`) actually correct?**
  _`Enquiry Form (#enquiry)` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `DELITECH heading name (possible brand inconsistency)`, `Server-side Form Provider / Backend (recommended upgrade)`, `SEO & Open Graph Metadata` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Why does `DelcoTech Website Setup Guide` connect `Enquiry Channels & Deployment` to `Page Structure & Branding`, `Accessibility & Metadata`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `Static Enquiry Flow` connect `Enquiry Channels & Deployment` to `Services & Pricing Content`, `Page Structure & Branding`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `DelcoTech Software & AI Solutions (brand / trading name)` and `DELITECH heading name (possible brand inconsistency)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._