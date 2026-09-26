/* ============================================================
   かいごのスキマ script.js
   1. ハンバーガーメニュー(スマホ)の開閉
   2. サービス紹介ドロップダウン(スマホはタップで開閉)
   3. よくあるご質問(FAQ)のアコーディオン
   4. スクロール時のふわっとしたフェードイン
   ※基本的に編集不要です。文言の変更は index.html で行ってください。
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ------------------------------------------------------------
     1. ハンバーガーメニュー(スマホ)
  ------------------------------------------------------------ */
  var hamburger = document.getElementById('hamburger');
  var globalNav = document.getElementById('globalNav');

  function closeMenu() {
    hamburger.classList.remove('is-open');
    globalNav.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'メニューを開く');
    document.body.style.overflow = '';
  }

  if (hamburger && globalNav) {
    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.toggle('is-open');
      globalNav.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
      // メニューを開いている間は背景のスクロールを止める
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // メニュー内のリンクをタップしたら閉じる(ページ内アンカーに移動)
    globalNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        // ドロップダウンの親リンク(スマホ)は別処理のため除外
        if (window.innerWidth <= 1024 && link.classList.contains('nav__link--dropdown')) {
          return;
        }
        closeMenu();
      });
    });
  }

  /* ------------------------------------------------------------
     2. サービス紹介ドロップダウン
        PC: CSSのホバーで開く / スマホ: タップで開閉
  ------------------------------------------------------------ */
  var dropdownParent = document.querySelector('.nav__item--dropdown');
  var dropdownLink = document.querySelector('.nav__link--dropdown');

  if (dropdownParent && dropdownLink) {
    dropdownLink.addEventListener('click', function (e) {
      // スマホ・タブレット表示のときだけタップで開閉する
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        dropdownParent.classList.toggle('is-open');
      }
    });
  }

  /* ------------------------------------------------------------
     3. FAQアコーディオン
  ------------------------------------------------------------ */
  document.querySelectorAll('.faq-item__q').forEach(function (button) {
    button.addEventListener('click', function () {
      var answer = button.nextElementSibling;
      var isOpen = button.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        button.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
      } else {
        button.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ------------------------------------------------------------
     4. スクロールフェードイン(IntersectionObserver・控えめ)
  ------------------------------------------------------------ */
  var fadeTargets = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    // JSが動く環境であることをCSSに伝える(初期状態の非表示を有効化)
    document.documentElement.classList.add('js-fadein');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // 一度表示したら監視をやめる
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeTargets.forEach(function (target) {
      observer.observe(target);
    });

    // 保険: 万一Observerが動作しない環境では1.2秒後にすべて表示する
    setTimeout(function () {
      if (document.querySelectorAll('.fade-in.is-visible').length === 0) {
        fadeTargets.forEach(function (target) {
          target.classList.add('is-visible');
        });
      }
    }, 1200);
  } else {
    // 古いブラウザではアニメーションなしでそのまま表示
    fadeTargets.forEach(function (target) {
      target.classList.add('is-visible');
    });
  }

});
