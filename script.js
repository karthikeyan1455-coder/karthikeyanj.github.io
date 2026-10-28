/* Portfolio interactions: mobile menu, active nav, scroll reveal, back-to-top, form validation */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // Footer year
  $('#year').textContent = new Date().getFullYear();

  // ----- Mobile menu -----
  const burger = $('#burger'), menu = $('#menu');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // ----- Scroll reveal -----
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: 0.12 });
    reveals.forEach(el => io.observe(el));
  } else reveals.forEach(el => el.classList.add('in'));

  // ----- Active nav highlighting -----
  const links = $$('.menu a');
  const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  function setActive() {
    const y = window.scrollY + 120;
    let current = sections[0];
    sections.forEach(s => { if (s.offsetTop <= y) current = s; });
    links.forEach(a => {
      const on = a.getAttribute('href') === '#' + current.id;
      a.classList.toggle('active', on);
      on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
    });
  }

  // ----- Back to top -----
  const toTop = $('#toTop');
  window.addEventListener('scroll', () => {
    toTop.classList.toggle('show', window.scrollY > 500);
    setActive();
  }, { passive: true });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  setActive();

  // ----- Contact form validation -----
  const form = $('#form'), status = $('#status');
  const rules = {
    name: v => v.trim().length >= 2 || 'Enter your name (at least 2 characters).',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
    subject: v => v.trim().length >= 3 || 'Enter a subject (at least 3 characters).',
    message: v => v.trim().length >= 10 || 'Enter a message (at least 10 characters).'
  };
  function check(field) {
    const input = form.elements[field], res = rules[field](input.value);
    $('#e-' + field).textContent = res === true ? '' : res;
    input.classList.toggle('invalid', res !== true);
    input.setAttribute('aria-invalid', res !== true);
    return res === true;
  }
  Object.keys(rules).forEach(f => form.elements[f].addEventListener('blur', () => check(f)));
  form.addEventListener('submit', e => {
    e.preventDefault();
    status.className = 'status';
    const ok = Object.keys(rules).map(check).every(Boolean);
    if (!ok) { status.textContent = 'Please fix the highlighted fields.'; return; }
    /* Demo delivery: opens the visitor's email app. To send real email, replace this with a
       fetch() POST to a form service (Formspree, Netlify Forms, EmailJS, or your own backend). */
    const f = form.elements;
    const body = `Name: ${f.name.value}\nEmail: ${f.email.value}\n\n${f.message.value}`;
    window.location.href = `mailto:karthikeyanj0355@gmail.com?subject=${encodeURIComponent(f.subject.value)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Opening your email app with the message filled in.';
    status.classList.add('ok');
    form.reset();
  });
})();
