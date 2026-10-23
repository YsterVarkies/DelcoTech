DELITECH SOFTWARE & AI SOLUTIONS — WEBSITE
===============================

QUICK START
-----------
Open index.html in a browser. No npm, build tools, API keys or backend needed.
To put it online, upload the CONTENTS of the mywebsite folder to your hosting's
public_html folder (or deploy the folder to any static-site host).

IMPORTANT — BEFORE THE WEBSITE GOES LIVE
----------------------------------------
1. Open script.js in any text editor.
2. Find the CONFIG object at the top and set:
     whatsapp: '27XXXXXXXXX'  (actual WhatsApp business number, digits only)
     email: 'you@yourdomain.co.za' (an actual monitored inbox)
   Either one is enough, but both is recommended. The original site included
   the dummy WhatsApp number 27820000000 and example email hello@deltech.co.za.
   Neither is assumed genuine. This redesign intentionally leaves them blank.
3. Verify that the monthly plan prices, custom-quote cards, 50% deposit, two revision rounds,
   VAT statement and service commitments reflect your actual business terms.
4. Verify DelcoTech Software & AI Solutions is the correct brand and registered trading name.
5. Test sending a full enquiry on a mobile phone and a desktop browser.
6. Replace or remove any copy that does not reflect the services actually offered.
7. Confirm you have a suitable privacy notice for how customer enquiries are
   handled, as applicable under South African POPIA rules.

CHANGING THE SITE
-----------------
Content, pricing, service descriptions, steps and contact details: script.js
Design, responsive layout, colours and typography: style.css
Page structure, headings, FAQ and metadata: index.html
Tab icon: assets/favicon.png (made from the DelcoTech logo)

HOW ENQUIRIES WORK
------------------
The contact form is designed for a static website without a server:
- With a real WhatsApp number configured, it opens WhatsApp with a prepared
  message. The visitor must press Send in WhatsApp to finish.
- Without WhatsApp, with a valid email configured, it opens the visitor's
  email app with a prepared message. They must send it to finish.
- With neither configured, it shows a preview/copy-only message. It will NOT
  send visitors to the original placeholder contact details or falsely claim
  the enquiry was submitted.

The form does not store entries or transmit data to a server. For reliable
server-side submissions, integrate a trusted form provider or your own backend.

ACCESSIBILITY AND MAINTENANCE
-----------------------------
Includes skip link, labelled form fields, keyboard-operated mobile menu,
accessible focus states, responsive design, native FAQ disclosure controls,
reduced-motion support and basic search/social metadata.

Fonts use Google Fonts when online; system fonts are used offline.

MOTION (GSAP)
-------------
All animation lives in motion.js and uses GSAP 3.15 (gsap, ScrollTrigger and
SplitText), copied into assets/vendor/ so the live site does not need npm.
- Intro: the header, headline (line by line), buttons and the browser mock
  play in when the page opens.
- Mouse: the browser mock tilts toward the pointer, the floating notes, orbits
  and sparks drift at different depths, a soft light follows the cursor, cards
  tilt with a light under the pointer, and buttons pull toward the cursor.
- Scroll: headings rise line by line, cards deal in, prices count up, a line
  fills down the steps, FAQ answers glide open.
With "reduce motion" switched on in the operating system, none of this runs
and the page shows as normal. If the GSAP files fail to load, the page still
works without the animation.

3D TOOLS (THREE.JS)
-------------------
tools3d.js draws a small 3D model on each service card: a laptop (custom
software), a chip (custom AI), a chat bubble (chatbots), a browser window
(websites), connected nodes (API) and a shield (hosting & care). They float and
turn toward the mouse. On hover the laptop opens, the chat bubble pops up like a
new message, and the pieces of the browser window pop out and settle back. Only models on
screen are drawn. Without WebGL the original icons are shown instead.

feature3d.js shows the DelcoTech logo in 3D (sky tile, navy D, white dot) in
the circle of the About section. It spins in when scrolled into view, floats,
and turns toward the mouse.

FILES
-----
index.html       Homepage and sections
style.css        Full responsive design
script.js        Editable site content and interactions
motion.js        GSAP animations, hover and mouse effects
tools3d.js       Three.js 3D models on the six service cards
feature3d.js     Three.js 3D DelcoTech logo in the About circle
assets/vendor/three/  Three.js 0.186 (three.module.js and three.core.js)
assets/vendor/   GSAP library files used by motion.js
assets/favicon.png  Site icon (DelcoTech logo)
README.txt       This setup guide
