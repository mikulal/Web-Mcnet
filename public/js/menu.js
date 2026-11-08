// Mobilní menu – jediný skript webu. Bez animací.
(function () {
  var b = document.querySelector('.menu-btn');
  var n = document.getElementById('nav');
  if (!b || !n) return;
  b.addEventListener('click', function () {
    var open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(open));
    n.classList.toggle('is-open', open);
  });
})();
