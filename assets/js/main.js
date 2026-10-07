/* ============================================================
   Orcinus AI · 站点主脚本
   功能：导航吸顶变形 / 折叠菜单 / Hero轮播 / AOS /
         客服弹层 / 回顶部 / 表单提交 / 【新增：昼夜主题切换】
   ============================================================ */
   (function () {
    'use strict';
    var navbar = document.getElementById('navbar');
    var hamburger = document.getElementById('hamburger');
    var menuOverlay = document.getElementById('menuOverlay');
    var topBtn = document.getElementById('topBtn');
    var supportBtn = document.getElementById('supportBtn');
    var supportPop = document.getElementById('supportPop');
  
    // ========== 新增：昼夜主题切换相关变量 ==========
    const themeToggle = document.getElementById('themeToggle');
    const themeSvg = document.getElementById('themeSvg');
    const themeText = themeToggle.querySelector('.nav-text');
    const htmlEl = document.documentElement;
  
    // SVG路径：moon月亮(夜间模式显示) / sun太阳(日间模式显示)
    const svgMoon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
    const svgSun = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
  
    function applyTheme(mode) {
      if(mode === 'light'){
        htmlEl.classList.remove('theme-dark');
        htmlEl.classList.add('theme-light');
        themeSvg.innerHTML = svgMoon;
        themeText.textContent = "夜间";
      }else{
        htmlEl.classList.remove('theme-light');
        htmlEl.classList.add('theme-dark');
        themeSvg.innerHTML = svgSun;
        themeText.textContent = "日间";
      }
      localStorage.setItem('siteTheme', mode);
    }
  
    // 页面初始化读取本地存储主题
    const savedTheme = localStorage.getItem('siteTheme');
    if(savedTheme === 'light'){
      applyTheme('light');
    }else{
      applyTheme('dark');
    }
  
    // 点击切换
    themeToggle.addEventListener('click', function(e){
      e.preventDefault();
      const current = htmlEl.classList.contains('theme-light') ? 'light' : 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  
    /* ---------- 1. 导航：下滑变形 ---------- */
    var scrolled = false;
    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      // 下滑超过 60px：加深背景 + 文字切图标 + 搜索框加宽
      scrolled = y > 60;
      navbar.classList.toggle('scrolled', scrolled);
      // 回顶部按钮：下滑超过 600px 才显示
      topBtn.classList.toggle('show', y > 600);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  
    /* ---------- 2. 折叠大菜单 ---------- */
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
  
    /* ---------- 3. Hero 轮播（Swiper） ---------- */
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
  
    /* ---------- 4. AOS 滚动渐入 ---------- */
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60
    });
  
    /* ---------- 5. 客服弹层 ---------- */
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
    // 键盘 Esc 关闭弹层
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        supportPop.classList.remove('open');
        closeMenu();
      }
    });

    /* ---------- 5. 页脚 ---------- */
    // 动态获取当前版权年份
    (function(){
      const yearEl = document.getElementById('currentYear');
      if(yearEl){
        yearEl.textContent = new Date().getFullYear();
      }
    })();

    /* ---------- 6. 回顶部 ---------- */
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  
    /* ---------- 7. 表单提交（前端演示版） ----------
       正式环境：把 endpoint 换成你的 Cloudflare Worker 地址，
       例如 https://business.你的子域.workers.dev
       并在 Worker 里做 CORS + D1 存储 + Turnstile 校验。
    ------------------------------------------------------- */
    var ENDPOINT = ''; // 填入 Worker URL 后启用
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
