// scroll reveal
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold:0.15 });
reveals.forEach(el=>io.observe(el));

// nav dot active state
const sections = ['hero','about','portfolio','pricing'].map(id=>document.getElementById(id));
const dots = document.querySelectorAll('nav.dots a');
const navIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const idx = sections.indexOf(e.target);
      dots.forEach(d=>d.classList.remove('active'));
      if(dots[idx]) dots[idx].classList.add('active');
    }
  });
}, { threshold:0.5 });
sections.forEach(s=>navIO.observe(s));
