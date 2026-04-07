/* Network canvas — covers full window */
function initCanvas() {
  var canvas = document.getElementById('networkBg');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H, nodes, animId;
  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  }
  function initNodes() {
    nodes = [];
    for (var i = 0; i < 38; i++) {
      nodes.push({ x: Math.random()*W, y: Math.random()*H, vx:(Math.random()-.5)*.18, vy:(Math.random()-.5)*.18, r:Math.random()*1.2+.7, pulse:Math.random()*Math.PI*2, ps:.007+Math.random()*.007 });
    }
  }
  function draw() {
    ctx.clearRect(0,0,W,H);
    for (var i=0;i<nodes.length;i++) {
      var a=nodes[i];
      for (var j=i+1;j<nodes.length;j++) {
        var b=nodes[j], dx=a.x-b.x, dy=a.y-b.y, d=Math.sqrt(dx*dx+dy*dy);
        if (d<160) { ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.strokeStyle='rgba(59,143,224,'+((1-d/160)*.065)+')'; ctx.lineWidth=.6; ctx.stroke(); }
      }
    }
    for (var k=0;k<nodes.length;k++) {
      var n=nodes[k]; n.pulse+=n.ps;
      var g=.5+.5*Math.sin(n.pulse), al=.09+g*.13;
      ctx.beginPath(); ctx.arc(n.x,n.y,n.r*3,0,Math.PI*2); ctx.fillStyle='rgba(59,143,224,'+(al*.13)+')'; ctx.fill();
      ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2); ctx.fillStyle='rgba(59,143,224,'+al+')'; ctx.fill();
      n.x+=n.vx; n.y+=n.vy;
      if(n.x<-20)n.x=W+20; if(n.x>W+20)n.x=-20; if(n.y<-20)n.y=H+20; if(n.y>H+20)n.y=-20;
    }
    animId=requestAnimationFrame(draw);
  }
  resize(); initNodes(); draw();
  window.addEventListener('resize',function(){cancelAnimationFrame(animId);resize();initNodes();draw();});
}
function initFilter() {
  document.querySelectorAll('.filter-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      document.querySelectorAll('.filter-btn').forEach(function(b){b.classList.remove('active');});
      btn.classList.add('active');
      var sector=btn.dataset.filter;
      document.querySelectorAll('.proj-card').forEach(function(card){
        card.classList.toggle('hidden',sector!=='vse'&&card.dataset.sector!==sector);
      });
    });
  });
}
function initScrollReveal() {
  var els=document.querySelectorAll('.reveal');
  if(!els.length)return;
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('revealed');io.unobserve(e.target);}});
  },{threshold:.1});
  els.forEach(function(el){io.observe(el);});
}
function initNav() {
  var path=window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(function(a){
    var href=a.getAttribute('href')||'',seg=href.replace(/^\//,'').split('/')[0];
    if(seg&&path.includes(seg))a.classList.add('active');
  });
}
document.addEventListener('DOMContentLoaded',function(){
  initCanvas(); initFilter(); initScrollReveal(); initNav();
});
