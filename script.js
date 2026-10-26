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
  whatsapp: '27792183025', // REQUIRED FOR WHATSAPP: actual number, no +, spaces or brackets
  email: 'info@delcotech.co.za', // REQUIRED FOR EMAIL: actual inbox, e.g. hello@yourdomain.co.za
  about: 'DelcoTech Software & AI Solutions builds practical, thoughtful websites, software and custom AI for people who don’t have an IT department. You get a clear quote, an agreed plan and one person to talk to from the first chat to launch and beyond.',
  pricingIntro: 'Every project is different, so we quote each one around your goals and budget. You’ll get a clear written quote before any work begins, with optional monthly care plans to keep things running afterwards.',
  pricingNote: 'Project prices are quoted individually, and monthly plan prices exclude VAT where applicable. AI features have monthly running costs (usage and monitoring), quoted separately before you commit. The final scope, price and timeline are confirmed in writing before work begins.',
  services: [
    {title:'Custom software',text:'Practical dashboards and tools that cut down repetitive admin and fit your workflow.',kind:'software',type:'Custom software'},
    {title:'Custom AI',text:'AI built around your business: tools that read documents, spot patterns or take repetitive work off your hands.',kind:'ai',type:'AI chatbot or custom AI'},
    {title:'AI chatbots',text:'A smart assistant on your website that answers customer questions around the clock, using your own information.',kind:'chat',type:'AI chatbot or custom AI'},
    {title:'Business websites',text:'Beautiful, easy-to-use websites that help customers find you, trust you and get in touch.',kind:'website',type:'Business website'},
    {title:'API integration',text:'Connect your website or software to the other tools you use, or build a custom API so your systems can talk to each other.',kind:'api',type:'API integration'},
    {title:'Hosting & care',text:'Keep your website online, updated and in good hands with ongoing maintenance.',kind:'shield',type:'Hosting and maintenance'}
  ],
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
const icons = {
  website:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01M7 14h6M7 17h10"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18m-13 5 2 2 5-5"/>',
  software:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m9 9-3 3 3 3m6-6 3 3-3 3m-4 2 2-10"/>',
  shield:'<path d="M12 22c5-2 8-5 8-10V5l-8-3-8 3v7c0 5 3 8 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  api:'<circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M7.5 12h4l5.5-4.5M11.5 12 17 16.5"/>',
  chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"/>',
  ai:'<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4M10 12h4"/>'
};

function jumpToContact(type,packageName){
  const select=$('project-type');
  if(type)select.value=type;
  const detail=$('project-details');
  if(packageName && !detail.value.trim()) detail.value='I’m interested in the '+packageName+' package. Please tell me more.';
  $('contact').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}

function renderServices(){
  CONFIG.services.forEach(s=>{
    const card=element('article','service-card');
    const icon=element('div','service-icon');icon.setAttribute('aria-hidden','true');icon.dataset.kind=s.kind;icon.innerHTML='<svg viewBox="0 0 24 24">'+(icons[s.kind]||icons.website)+'</svg>';
    const title=element('h3','',s.title);const summary=element('p','',s.text);
    const link=element('a','service-link');link.href='#contact';link.textContent='Let’s talk';link.append(element('span','','↗'));
    link.addEventListener('click',()=>{$('project-type').value=s.type;});
    card.append(icon,title,summary,link);$('services-list').append(card);
  });
}
function renderPrices(source,targetId){
  const isPlan=source===CONFIG.plans;
  source.forEach(item=>{
    const card=element('article','pricing-card'+(item.quote?' quote-card featured':(item.featured?' featured':'')));
    const list=element('ul','included');item.items.forEach(line=>list.append(element('li','',line)));
    const link=element('a','price-button',item.quote?'Request your quote ↗':(isPlan?'Enquire about this plan ↗':'Choose this package ↗'));link.href='#contact';
    link.addEventListener('click',()=>{const details=$('project-details');$('project-type').value=item.type;if(!details.value.trim())details.value=item.quote?item.message:'I’m interested in '+item.title+(isPlan?' monthly plan':' package')+'. Please send me a quote.';});
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
  const channels=availableChannels(),whatsappLink=$('whatsapp-link'),phoneLink=$('phone-link'),emailLink=$('email-link'),help=$('form-help'),button=$('submit-enquiry');
  whatsappLink.hidden=!channels.whatsapp;
  phoneLink.hidden=!channels.whatsapp;
  emailLink.hidden=!channels.email;
  if(channels.whatsapp){whatsappLink.href='https://wa.me/'+CONFIG.whatsapp;whatsappLink.target='_blank';whatsappLink.rel='noopener noreferrer';phoneLink.href='tel:+'+CONFIG.whatsapp;phoneLink.textContent=formatPhone(CONFIG.whatsapp);}
  if(channels.email){emailLink.href='mailto:'+CONFIG.email;emailLink.textContent=CONFIG.email;}
  if(channels.whatsapp){button.firstChild.textContent='Send via WhatsApp ';help.textContent='Submitting opens WhatsApp with your message ready to send.';}
  else if(channels.email){button.firstChild.textContent='Send via email ';help.textContent='Submitting opens your email app with your enquiry ready to send.';}
  else{button.firstChild.textContent='Prepare my enquiry ';help.textContent='Preview mode: the site owner needs to add a WhatsApp number or email before enquiries can be sent.';}
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

function updateStatus(message,isError=false){const status=$('form-status');status.textContent=message;status.classList.toggle('error',isError);status.hidden=false;}

function setupEnquiry(){
  const channels=configureContact(),form=$('enquiry'),sendEmailButton=$('send-email');
  let sendViaEmail=false;
  sendEmailButton.hidden=!channels.email;
  sendEmailButton.addEventListener('click',()=>{sendViaEmail=true;form.requestSubmit();});
  form.addEventListener('submit',event=>{
    event.preventDefault();$('form-status').hidden=true;$('copy-fallback').hidden=true;
    const viaEmail=sendViaEmail;sendViaEmail=false;
    let valid=true;
    ['name','contact-info','project-details'].forEach(id=>{const input=$(id);const filled=input.value.trim().length>0;input.classList.toggle('invalid',!filled);if(!filled){valid=false;}});
    if(!valid){updateStatus('Please complete your name, contact details and project description.',true);form.querySelector('.invalid').focus();return;}
    const data=new FormData(form),message=prepareMessage(data);
    if(channels.whatsapp&&!viaEmail){const url='https://wa.me/'+CONFIG.whatsapp+'?text='+encodeURIComponent(message);window.location.href=url;updateStatus('Your WhatsApp message is ready. Please press Send in WhatsApp to finish.');}
    else if(channels.email){const subject='New DelcoTech project enquiry – '+data.get('project');window.location.href='mailto:'+encodeURIComponent(CONFIG.email)+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(message);updateStatus('Your email app should open with a ready-to-send enquiry. Please send it to finish.');}
    else{$('copy-message').value=message;$('copy-fallback').hidden=false;updateStatus('Preview only: the site owner has not added real contact details yet. Your message is ready to copy.');}
  });
  ['name','contact-info','project-details'].forEach(id=>$(id).addEventListener('input',()=>$(id).classList.remove('invalid')));
  $('copy-button').addEventListener('click',async()=>{
    const text=$('copy-message').value;
    try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);updateStatus('Message copied to clipboard.');return;}}catch(err){}
    $('copy-message').focus();$('copy-message').select();updateStatus('Select the message above and use Copy to save it.');
  });
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
/* Scroll reveals, hovers and mouse effects live in motion.js (GSAP). */
function init(){
  document.querySelectorAll('[data-bind]').forEach(node=>{const value=CONFIG[node.dataset.bind];if(typeof value==='string')setBrandText(node,value);});
  renderServices();renderPrices(CONFIG.builds,'build-list');renderPrices(CONFIG.aiBuilds,'ai-list');renderPrices(CONFIG.plans,'plan-list');renderSteps();
  setBrandText($('footer-text'),'© '+new Date().getFullYear()+' '+CONFIG.name+'. All rights reserved.');
  setupMobileNavigation();setupEnquiry();
}
init();
