/* ============================================================
   Orcinus AI · 站点主脚本
   功能：导航吸顶变形 / 折叠菜单 / Hero轮播 / AOS / 客服弹层 / 回顶部 / 表单提交
   ============================================================ */

(function () {
  'use strict';

  var navbar = document.getElementById('navbar');
  var hamburger = document.getElementById('hamburger');
  var menuOverlay = document.getElementById('menuOverlay');
  var topBtn = document.getElementById('topBtn');
  var supportBtn = document.getElementById('supportBtn');
  var supportPop = document.getElementById('supportPop');

  /* ---------- 1.导航：下滑变形 ---------- */
  var scrolled = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    // 下滑超过60px：加深背景+文字切图标+搜索框加宽
    scrolled = y>60;
    navbar.classList.toggle('scrolled', scrolled);

    // 回顶部按钮：下滑超过 600px 才显示
    topBtn.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2.折叠大菜单 ---------- */
  function openMenu() {
    menuOverlay.classList.add('open');
    hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menuOverlay.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }
  hamburger.addEventListener('click', function () {
    if (menuOverlay.classList.contains('open')) { closeMenu(); } else { openMenu(); }
  });
  menuOverlay.addEventListener('click', function (e) {
    if (e.target === menuOverlay) { closeMenu(); }
  });
  // 菜单内链接点击后关闭
  menuOverlay.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  /* ---------- 3.Hero轮播（Swiper） ---------- */
  var heroSwiper = new Swiper('.hero-swiper', {
    loop: true,
    speed: 900,
    autoplay: { delay: 6000, disableOnInteraction: false },
    pagination: { el: '.hero-swiper .swiper-pagination', clickable: true },
    navigation: {
      nextEl: '.hero-swiper .swiper-button-next',
      prevEl: '.hero-swiper .swiper-button-prev'
    },
    effect: 'fade',
    fadeEffect: { crossFade: true }   // 屏间淡入淡出
  });

  /* ---------- 4.AOS滚动渐入 ---------- */
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60
  });

  /* ---------- 5.客服弹层 ---------- */
  supportBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    supportPop.classList.toggle('open');
  });
  document.addEventListener('click', function (e) {
    var wrap = document.querySelector('.support-wrap');
    if (supportPop.classList.contains('open') && !wrap.contains(e.target)) {
      supportPop.classList.remove('open');
    }
  });
  // 键盘Esc关闭弹层
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      supportPop.classList.remove('open');
      closeMenu();
    }
  });

  /* ---------- 6.回顶部 ---------- */
  topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 7. 表单提交（前端演示版） ----------
     正式环境：把endpoint换成Cloudflare Worker地址，
     例如 https://business.dianacody.workers.dev
     并在Worker里做CORS + D1存储 + Turnstile校验。
  ------------------------------------------------------- */
  var ENDPOINT = ''; // 填入Worker URL后启用

  function handleForm(form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var data = {
        name: fd.get('name') || '',
        phone: fd.get('phone') || '',
        message: fd.get('message') || ''
      };

      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.textContent = '提交中…';
      btn.disabled = true;

      if (ENDPOINT) {
        fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
          .then(function (r) { return r.json(); })
          .then(function (res) {
            btn.textContent = '✓ 提交成功';
            form.reset();
            setTimeout(function () {
              btn.textContent = original;
              btn.disabled = false;
            }, 2500);
          })
          .catch(function () {
            btn.textContent = '提交失败，请稍后再试';
            btn.disabled = false;
            setTimeout(function () { btn.textContent = original; }, 3000);
          });
      } else {
        // 演示模式：未配置 Worker 时，本地弹窗提示
        btn.textContent = '✓ 演示提交（未配置后端）';
        form.reset();
        setTimeout(function () {
          btn.textContent = original;
          btn.disabled = false;
        }, 2500);
        console.log('表单数据（演示）：', data);
      }
    });
  }

  var contactForm = document.getElementById('contactForm');
  var supportForm = document.getElementById('supportForm');
  if (contactForm) handleForm(contactForm);
  if (supportForm) handleForm(supportForm);

})();
