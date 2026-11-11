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
Promo film ("See it in action" section): assets/video/
  delcotech-ad-web.mp4 + delcotech-ad-poster.jpg                    shown on computers and tablets
  delcotech-ad-vertical-web.mp4 + delcotech-ad-vertical-poster.jpg  shown on phones held upright (script.js picks it)
  To update the film, replace these files with new renders and keep the same names.

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

WHAT WE DO: SERVICE VIDEOS
--------------------------
The "What we do" section shows a short silent loop from the DelcoTech film for
each service: custom websites, custom software and custom AI. Computers get
the 16:9 clips; phones held upright get the 9:16 clips from the vertical film.
A clip only plays while it is on screen, and each has a pause button. With
"reduce motion" switched on, the clips wait on their poster until played.
Files are in assets/video/services/ (name.mp4 + name.jpg poster, and
name-vertical.mp4 + name-vertical.jpg for phones). They were cut from the 2K
masters (times in seconds, horizontal / vertical):
  websites  16.75-20.85 / 16.70-20.85
  software  33.70-41.60 / 33.70-41.60
  ai        43.60-53.95 / 43.60-53.90
with: ffmpeg -ss START -to END -i MASTER.mp4 -an -vf "scale=1920:1080:flags=lanczos"
  -r 60 -c:v libx264 -preset slower -tune animation -crf 19 -x264-params aq-mode=3
  -movflags +faststart OUT.mp4
(scale=1080:1920 for the vertical clips; posters are 1920x1080 / 1080x1920).

3D LOGO (THREE.JS)
------------------
feature3d.js shows the DelcoTech logo in 3D (sky tile, navy D, white dot) in
the circle of the About section. It spins in when scrolled into view, floats,
and turns toward the mouse.

FILES
-----
index.html       Homepage and sections
style.css        Full responsive design
script.js        Editable site content and interactions
motion.js        GSAP animations, hover and mouse effects
assets/video/services/  Service clips and posters for "What we do"
feature3d.js     Three.js 3D DelcoTech logo in the About circle
assets/vendor/three/  Three.js 0.186 (three.module.js and three.core.js)
assets/vendor/   GSAP library files used by motion.js
assets/favicon.png  Site icon (DelcoTech logo)
README.txt       This setup guide
