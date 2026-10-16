/* Reference filter */
function initFilter() {
  document.querySelectorAll('.filter-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      document.querySelectorAll('.filter-btn').forEach(function(b){b.classList.remove('active');});
      btn.classList.add('active');
      var s=btn.dataset.filter;
      document.querySelectorAll('.proj-card').forEach(function(c){c.classList.toggle('hidden',s!=='vse'&&c.dataset.sector!==s);});
    });
  });
}

/* Scroll reveal */
function initScrollReveal() {
  var els=document.querySelectorAll('.reveal');
  if(!els.length) return;
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('revealed');io.unobserve(e.target);}});
  },{threshold:.1});
  els.forEach(function(el){io.observe(el);});
}

/* Active nav */
function initNav() {
  var path=window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(function(a){
    var href=a.getAttribute('href')||'',seg=href.replace(/^\//,'').split('/')[0];
    if(seg&&path.includes(seg)) a.classList.add('active');
  });
}

/* Run immediately — script is at end of body so DOM is ready */
initFilter();
initScrollReveal();
initNav();
