/*
 * DELITECH SITE CONFIGURATION
 * Edit business details and offerings here. The WhatsApp number and email below
 * are shown as the contact links on the page.
 * Set whatsapp to real international digits (example: 27821234567) and/or
 * email to a real, verified inbox before publishing the site.
 */
const CONFIG = {
  name: 'DelcoTech Software & AI Solutions',
  subheadline: 'We create good-looking websites, smarter business systems, custom AI and reliable ongoing support. Built around what you actually need.',
  whatsapp: '27792082578', // REQUIRED FOR WHATSAPP: actual number, no +, spaces or brackets
  email: 'info@delcotech.co.za', // REQUIRED FOR EMAIL: actual inbox, e.g. hello@yourdomain.co.za
  about: 'DelcoTech Software & AI Solutions builds practical, thoughtful websites, software and custom AI for people who don’t have an IT department. You get a clear quote, an agreed plan and one person to talk to from the first chat to launch and beyond.',
  pricingIntro: 'Every project is different, so we quote each one around your goals and budget. You’ll get a clear written quote before any work begins, with optional monthly care plans to keep things running afterwards.',
  pricingNote: 'Project prices are quoted individually, and monthly plan prices exclude VAT where applicable. AI features have monthly running costs (usage and monitoring), quoted separately before you commit. The final scope, price and timeline are confirmed in writing before work begins.',
  // Project prices are not shown publicly: each group is a single "custom quote" card.
  builds: [
    {quote:true,title:'Get a custom quote',text:'Websites, business systems and custom software are all quoted around what you need. Tell us your goals and budget and we’ll recommend the right fit.',items:['Designed and built around your business','Features, pages and integrations to suit you','A clear written quote before any work begins'],type:'Business website',message:'I’d like a custom quote for a website or business system.'}
  ],
  aiBuilds: [
    {quote:true,title:'Get a custom quote',text:'Chatbots, assistants and custom AI are quoted around the problem you want solved. Tell us your goals and budget and we’ll recommend the right fit.',items:['From simple chatbots to custom AI tools','Built on your own business information','Scope and monthly running costs explained upfront'],type:'AI chatbot or custom AI',message:'I’d like a custom quote for an AI chatbot or custom AI.'}
  ],
  plans: [
    {title:'Essential',price:'R399',note:'per month',items:['Hosting and domain renewal','Daily backups','SSL security'],type:'Hosting and maintenance'},
    {title:'Care',price:'R1,800',note:'per month',items:['Everything in Essential','Security updates','Uptime monitoring','3 hours of changes per month'],featured:true,type:'Hosting and maintenance'},
    {title:'Growth',price:'R3,000',note:'per month',items:['Everything in Care','Content updates','Monthly visitor report','Priority support','5 hours of changes per month'],type:'Hosting and maintenance'}
  ],
  steps: [
    {title:'Tell us your idea',text:'We start with a free conversation about your goals and what you need.'},
    {title:'Get a clear plan',text:'You receive a written quote and scope. A 50% deposit starts the project.'},
    {title:'See it come to life',text:'We build a working preview for you to review, with up to two rounds of changes.'},
    {title:'Launch with confidence',text:'Once approved, we go live. Optional care plans keep things looked after.'}
  ]
};

const $ = id => document.getElementById(id);
const element = (tag,className,text) => {const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};

function renderPrices(source,targetId){
  const isPlan=source===CONFIG.plans;
  source.forEach(item=>{
    const card=element('article','pricing-card'+(item.quote?' quote-card featured':(item.featured?' featured':'')));
    const list=element('ul','included');item.items.forEach(line=>list.append(element('li','',line)));
    const link=element('a','price-button',item.quote?'Request your quote ↗':(isPlan?'Enquire about this plan ↗':'Choose this package ↗'));
    link.href='#enquiry';
    link.dataset.project=item.type;
    link.dataset.projectMessage=item.quote?item.message:'I’m interested in '+item.title+(isPlan?' monthly plan':' package')+'. Please send me a quote.';
    if(item.quote){
      const copy=element('div','quote-copy'),actions=element('div','quote-actions');
      copy.append(element('h4','',item.title),element('p','package-summary',item.text));actions.append(list,link);card.append(copy,actions);
    }else{
      if(item.featured)card.append(element('div','popular','MOST POPULAR'));
      card.append(element('h4','',item.title),element('strong','price'+(item.price.length>12?' price-small':''),item.price),element('p','billing',item.note));
      if(item.text)card.append(element('p','package-summary',item.text));
      card.append(list,link);
    }
    $(targetId).append(card);
  });
}
function renderSteps(){CONFIG.steps.forEach((s,i)=>{const row=element('li');const number=element('span','process-number',String(i+1).padStart(2,'0'));const details=element('div','process-details');details.append(element('strong','',s.title),element('p','',s.text));row.append(number,details);$('steps-list').append(row);});}

function validEmail(mail){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail) && !/example\.com|yourdomain/i.test(mail);}
function validWhatsapp(num){return /^\d{10,15}$/.test(num) && !/^(\d)\1+$/.test(num) && !/00000/.test(num);}
function availableChannels(){return {whatsapp:validWhatsapp(CONFIG.whatsapp.trim()),email:validEmail(CONFIG.email.trim())};}
function formatPhone(num){return num.startsWith('27')?'+27 '+num.slice(2,4)+' '+num.slice(4,7)+' '+num.slice(7):'+'+num;}
function configureContact(){
  const channels=availableChannels(),whatsappLink=$('whatsapp-link'),phoneLink=$('phone-link'),emailLink=$('email-link');
  whatsappLink.hidden=!channels.whatsapp;
  phoneLink.hidden=!channels.whatsapp;
  emailLink.hidden=!channels.email;
  if(channels.whatsapp){whatsappLink.href='https://wa.me/'+CONFIG.whatsapp;whatsappLink.target='_blank';whatsappLink.rel='noopener noreferrer';phoneLink.href='tel:+'+CONFIG.whatsapp;phoneLink.textContent=formatPhone(CONFIG.whatsapp);}
  if(channels.email){emailLink.href='mailto:'+CONFIG.email;emailLink.textContent=CONFIG.email;}
  return channels;
}
function prepareMessage(data){return 'Hi DelcoTech!\n\nMy name is '+data.get('name').trim()+'.\nContact: '+data.get('contact').trim()+'\nInterested in: '+data.get('project')+'\n\nProject details:\n'+data.get('message').trim();}
/* Writes text into a page element and keeps every "DelcoTech" as one unit,
   kept as a helper so brand text stays consistent. */
function setBrandText(node,text){
  node.textContent='';
  text.split('DelcoTech').forEach((part,i)=>{
    if(i>0)node.append('DelcoTech');
    node.append(part);
  });
}

function updateStatus(message){const status=$('form-status');status.textContent=message;status.hidden=false;}

function setupEnquiry(){
  const channels = configureContact();
  const form = $('enquiry');
  const steps = [...form.querySelectorAll('.enquiry-step')];
  const project = form.elements.project;
  const details = $('project-details');
  const back = $('enquiry-back');
  const sendEmail = $('send-email');
  const error = $('enquiry-error');
  const lastStep = steps.length - 1;
  const sendLabel = channels.whatsapp ? 'Send via WhatsApp' : channels.email ? 'Send via email' : 'Prepare my enquiry';
  $('form-help').textContent = channels.whatsapp || channels.email
    ? 'Your enquiry opens as a draft for you to send.'
    : 'Your enquiry will be ready to copy.';
  let currentStep = 0;
  let prefilledDetails = '';

  function showStep(index, moveFocus = true){
    currentStep = index;
    const isLast = index === lastStep;
    steps.forEach((step, i) => { step.hidden = i !== index; });
    $('enquiry-step-count').textContent = 'Step ' + (index + 1) + ' of ' + steps.length;
    $('enquiry-progress').value = index + 1;
    back.hidden = index === 0;
    sendEmail.hidden = !isLast || !channels.whatsapp || !channels.email;
    $('enquiry-submit-label').textContent = isLast ? sendLabel : 'Continue';
    $('enquiry-submit-arrow').textContent = isLast && (channels.whatsapp || channels.email) ? '↗' : '→';
    $('form-help').hidden = !isLast;
    error.hidden = true;
    $('form-status').hidden = true;
    $('copy-fallback').hidden = true;
    if (moveFocus) steps[index].querySelector('h4').focus();
  }

  back.addEventListener('click', () => showStep(currentStep - 1));
  document.querySelectorAll('a[data-project]').forEach(link => {
    link.addEventListener('click', () => {
      project.value = link.dataset.project;
      if (!details.value.trim() || details.value === prefilledDetails) {
        prefilledDetails = link.dataset.projectMessage || '';
        details.value = prefilledDetails;
      }
      showStep(0, false);
    });
  });
  form.addEventListener('change', event => {
    if (event.target.name === 'project' && prefilledDetails && details.value === prefilledDetails) {
      details.value = '';
      prefilledDetails = '';
    }
  });
  form.addEventListener('input', event => {
    error.hidden = true;
    event.target.removeAttribute('aria-invalid');
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const invalidStep = steps.slice(0, currentStep + 1).findIndex(step => {
      const input = step.querySelector('input, textarea');
      return input.type === 'radio' ? !project.value : !input.value.trim();
    });
    if (invalidStep !== -1) {
      showStep(invalidStep, false);
      const step = steps[invalidStep];
      const input = step.querySelector('input, textarea');
      if (input.type !== 'radio') input.setAttribute('aria-invalid', 'true');
      error.textContent = step.dataset.error;
      error.hidden = false;
      input.focus();
      return;
    }
    if (currentStep < lastStep) {
      showStep(currentStep + 1);
      return;
    }
    $('form-status').hidden = true;
    $('copy-fallback').hidden = true;
    const viaEmail = event.submitter === sendEmail;
    const data=new FormData(form),message=prepareMessage(data);
    if(channels.whatsapp&&!viaEmail){const url='https://wa.me/'+CONFIG.whatsapp+'?text='+encodeURIComponent(message);window.location.href=url;updateStatus('Your WhatsApp message is ready. Please press Send in WhatsApp to finish.');}
    else if(channels.email){const subject='New DelcoTech project enquiry – '+data.get('project');window.location.href='mailto:'+encodeURIComponent(CONFIG.email)+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(message);updateStatus('Your email app should open with a ready-to-send enquiry. Please send it to finish.');}
    else{$('copy-message').value=message;$('copy-fallback').hidden=false;updateStatus('Preview only: the site owner has not added real contact details yet. Your message is ready to copy.');}
  });
  $('copy-button').addEventListener('click',async()=>{
    const text=$('copy-message').value;
    try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);updateStatus('Message copied to clipboard.');return;}}catch(err){}
    $('copy-message').focus();$('copy-message').select();updateStatus('Select the message above and use Copy to save it.');
  });
  showStep(0, false);
}
function setupMobileNavigation(){
  const toggle=$('menu-toggle'),nav=$('nav-links');
  function close(){nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');}
  toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';nav.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu');});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  document.addEventListener('click',e=>{if(!toggle.contains(e.target)&&!nav.contains(e.target))close();});
  window.addEventListener('resize',()=>{if(window.innerWidth>680)close();});
}
/* Phones held upright get the 9:16 version of a video; everything else keeps the 16:9 one.
   Re-checked whenever the screen changes shape (rotating a phone, resizing a window). */
const phoneQuery=window.matchMedia('(max-width: 680px) and (orientation: portrait)');
function useVerticalOnPhones(video,frame){
  const source=video.querySelector('source');
  if(!source||!video.dataset.phoneSrc)return;
  const wide={src:source.getAttribute('src'),poster:video.getAttribute('poster'),width:video.getAttribute('width'),height:video.getAttribute('height')};
  const apply=()=>{
    const tall=phoneQuery.matches,src=tall?video.dataset.phoneSrc:wide.src;
    frame.classList.toggle('is-vertical',tall);
    video.setAttribute('width',tall?wide.height:wide.width);video.setAttribute('height',tall?wide.width:wide.height);
    video.poster=tall?video.dataset.phonePoster:wide.poster;
    if(source.getAttribute('src')===src)return;
    const wasPlaying=!video.paused;
    source.setAttribute('src',src);
    video.load(); // nothing downloads until it plays (preload="none")
    if(wasPlaying){const p=video.play();if(p&&p.catch)p.catch(()=>{});}
  };
  apply();
  if(phoneQuery.addEventListener)phoneQuery.addEventListener('change',apply);else phoneQuery.addListener(apply);
}
function setupShowreel(){
  const video=$('showreel-video'),play=$('showreel-play');
  if(!video)return;
  const frame=video.closest('.showreel-frame');
  useVerticalOnPhones(video,frame);
  if(!play)return;
  /* Our play button sits on the poster; the browser's own controls take over once it plays. */
  const showPlay=on=>{play.hidden=!on;video.controls=!on;};
  showPlay(true);
  play.addEventListener('click',()=>{showPlay(false);const p=video.play();if(p&&p.catch)p.catch(()=>{});});
  video.addEventListener('play',()=>showPlay(false));
  video.addEventListener('ended',()=>{video.load();showPlay(true);}); // back to the poster
}
/* "What we do": each service plays a silent, looping clip from the film while it is on screen. */
function setupShowcase(){
  const videos=[...document.querySelectorAll('.showcase-video')];
  if(!videos.length)return;
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tryPlay=video=>{const p=video.play();if(p&&p.catch)p.catch(()=>{});};
  videos.forEach(video=>{
    const frame=video.closest('.showcase-frame'),toggle=frame.querySelector('.showcase-toggle');
    useVerticalOnPhones(video,frame);
    /* Reduced motion: stay on the poster until the visitor presses play. */
    video.dataset.paused=reduceMotion?'1':'';
    const sync=()=>{const playing=!video.paused;frame.classList.toggle('is-playing',playing);toggle.setAttribute('aria-label',playing?'Pause video':'Play video');};
    video.addEventListener('play',sync);video.addEventListener('pause',sync);
    toggle.hidden=false;sync();
    toggle.addEventListener('click',()=>{
      if(video.paused){video.dataset.paused='';tryPlay(video);}
      else{video.dataset.paused='1';video.pause();}
    });
  });
  if(!('IntersectionObserver' in window))return;
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
    const video=entry.target;
    if(entry.isIntersecting){if(!video.dataset.paused)tryPlay(video);}
    else if(!video.paused)video.pause();
  }),{threshold:0.35});
  videos.forEach(video=>io.observe(video));
}
/* Scroll reveals, hovers and mouse effects live in motion.js (GSAP). */
function init(){
  document.querySelectorAll('[data-bind]').forEach(node=>{const value=CONFIG[node.dataset.bind];if(typeof value==='string')setBrandText(node,value);});
  renderPrices(CONFIG.builds,'build-list');renderPrices(CONFIG.aiBuilds,'ai-list');renderPrices(CONFIG.plans,'plan-list');renderSteps();
  setBrandText($('footer-text'),'© '+new Date().getFullYear()+' '+CONFIG.name+'. All rights reserved.');
  setupMobileNavigation();setupEnquiry();setupShowreel();setupShowcase();
}
init();
