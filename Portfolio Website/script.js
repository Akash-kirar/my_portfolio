 // ===== UTILITIES =====
  const qs = (s,scope=document)=> scope.querySelector(s);
  const qsa = (s,scope=document)=> [...scope.querySelectorAll(s)];

  // ===== YEAR =====
  qs('#year').textContent = new Date().getFullYear();

  // ===== CUSTOM CURSOR (desktop) =====
  const cursor = qs('#cursor');
  const cursorDot = qs('#cursorDot');
  let cx = window.innerWidth/2, cy = window.innerHeight/2;
  let tx = cx, ty = cy;
  document.addEventListener('mousemove',(e)=>{ tx = e.clientX; ty = e.clientY; });
  function loop(){
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px,${cy}px)`;
    cursorDot.style.transform = `translate(${tx}px,${ty}px)`;
    requestAnimationFrame(loop);
  }
  loop();

  // Hover grow on interactives
  qsa('a,button,[data-magnet]').forEach(el=>{
    el.addEventListener('mouseenter',()=>{ cursor.style.width='42px'; cursor.style.height='42px'; cursor.style.background='rgba(255,255,255,.1)'; });
    el.addEventListener('mouseleave',()=>{ cursor.style.width='28px'; cursor.style.height='28px'; cursor.style.background='transparent'; });
  });

  // ===== CLICK RIPPLE =====
  document.addEventListener('click', (e)=>{
    const r = document.createElement('span');
    r.className = 'ripple';
    r.style.left = e.clientX + 'px';
    r.style.top  = e.clientY + 'px';
    document.body.appendChild(r);
    setTimeout(()=> r.remove(), 650);
  });

  // ===== MAGNETIC BUTTONS =====
  qsa('[data-magnet]').forEach(btn=>{
    const strength = 18;
    btn.addEventListener('mousemove', (e)=>{
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width/2;
      const y = e.clientY - rect.top - rect.height/2;
      btn.style.transform = `translate(${x/strength}px, ${y/strength}px)`;
    });
    btn.addEventListener('mouseleave', ()=> btn.style.transform='translate(0,0)');
  });

  // ===== PARALLAX DOTS =====
  const parallaxEls = qsa('.parallax [data-speed]');
  document.addEventListener('mousemove', (e)=>{
    const { innerWidth: w, innerHeight: h } = window;
    const x = (e.clientX - w/2) / (w/2);
    const y = (e.clientY - h/2) / (h/2);
    parallaxEls.forEach(el=>{
      const speed = parseFloat(el.dataset.speed || 1);
      el.style.transform = `translate(${x*10*speed}px, ${y*8*speed}px)`;
    });
  });

  // ===== VANILLA TILT on project cards =====
  VanillaTilt.init(document.querySelectorAll('.project-card'), {
    max: 8, speed: 400, glare: true, "max-glare": .18, scale: 1.02
  });

  // ===== GSAP SCROLL ANIMATIONS =====
  gsap.registerPlugin(ScrollTrigger);

  // Fade & rise sections
  qsa('section.section').forEach((sec,i)=>{
    gsap.fromTo(sec.querySelectorAll('.section-title, .section-sub, .project-card, .timeline, .glass, form'),
      {y: 40, opacity: 0},
      {
        y: 0, opacity: 1, duration: .9, ease: 'power3.out',
        stagger: .08,
        scrollTrigger: { trigger: sec, start: 'top 75%', once: true }
      }
    );
  });

  // Hero text split-like entrance
  gsap.from('.display-hero', { y: 30, opacity: 0, duration: .8, ease: 'power2.out', delay:.1 });
  gsap.from('.hero-cta .btn', { y: 14, opacity: 0, duration: .6, stagger:.06, delay:.2 });

  // Stats count-up
  qsa('.stat h4').forEach(el=>{
    const target = parseInt(el.textContent) || el.textContent;
    if(isNaN(target)) return;
    const obj = {v: 0};
    ScrollTrigger.create({
      trigger: el, start: 'top 80%', once: true,
      onEnter: ()=>{
        gsap.to(obj, {
          v: target, duration: 1.2, ease: 'power1.out',
          onUpdate: ()=> el.textContent = Math.round(obj.v)
        });
      }
    });
  });

  // ===== LOTTIE fallbacks =====
  (function ensureLottie(){
    const lp = qs('#heroLottie');
    let fallbackApplied = false;
    function applyFallback(){
      if(fallbackApplied) return;
      fallbackApplied = true;
      const note = document.createElement('div');
      note.className = 'mt-2';
      note.innerHTML = '<small class="muted">Lottie failed to load. Replace the <code>src</code> with the direct JSON URL from your animation page.</small>';
      lp.after(note);
    }
    // If not loaded within 4s, show hint
    setTimeout(()=>{
      // crude check: player creates a shadowRoot with svg/canvas
      try{
        if(!lp.shadowRoot || lp.shadowRoot.innerHTML.trim().length < 50){
          applyFallback();
        }
      } catch(e){ applyFallback(); }
    }, 4000);
  })();




    document.addEventListener('DOMContentLoaded', () => {
    const timelineItems = document.querySelectorAll('#education-section .timeline-item');
    if (!timelineItems.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-in-view');
      });
    }, { threshold: 0.4 });

    timelineItems.forEach(item => observer.observe(item));
  });