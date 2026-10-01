(function () {
  'use strict';

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Scroll reveal
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Share button (native share sheet on mobile, copy link on desktop)
  var btn = document.getElementById('shareBtn');
  var toast = document.getElementById('toast');
  function say(msg) {
    toast.textContent = msg;
    setTimeout(function () { toast.textContent = ''; }, 2500);
  }
  if (btn) btn.addEventListener('click', function () {
    var data = { title: document.title, url: location.href };
    if (navigator.share) {
      navigator.share(data).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(data.url).then(function () { say('Link copied!'); });
    } else {
      say('Copy the link from your address bar.');
    }
  });
})();
