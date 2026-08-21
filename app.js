/* ============================================================
   数理星图 · 学习激励站 app.js
   入口：全局 toast / 页签路由 / 初始化三视图（纯色背景，无粒子）
   ============================================================ */
(() => {
  'use strict';

  const $ = s => document.querySelector(s);

  /* ---------- 全局 toast ---------- */
  const toastEl = $('#toast');
  let toastTimer = null;
  window.showToast = msg => {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2300);
  };

  /* ---------- 点亮迸发已随粒子背景移除（app-tree 内做了空判断） ---------- */

  /* ============================================================
     初始化三个视图
     ============================================================ */
  createSkillTree($('#view-math'), { tree: MATH_TREE, storeKey: 'math-skill-tree-v2' });
  createSkillTree($('#view-physics'), { tree: PHYSICS_TREE, storeKey: 'physics-skill-tree-v1' });
  const ladder = createLadder($('#view-ladder'));

  /* ============================================================
     页签路由（hash）
     ============================================================ */
  const VIEWS = ['math', 'physics', 'ladder'];
  const tabs = [...document.querySelectorAll('.tab')];

  function apply(v) {
    document.querySelectorAll('.view').forEach(s => s.classList.toggle('active', s.dataset.view === v));
    tabs.forEach(b => b.classList.toggle('active', b.dataset.view === v));
    if (v === 'ladder') requestAnimationFrame(() => ladder.renderAll());
    else if (v === 'math' || v === 'physics') {
      // 切回树视图时重新适配（窗口尺寸可能已变化）
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'));
      });
    }
  }

  function currentView() {
    const h = (location.hash || '').replace(/^#\/?/, '');
    return VIEWS.includes(h) ? h : 'math';
  }

  tabs.forEach(b => b.addEventListener('click', () => { location.hash = '#/' + b.dataset.view; }));
  window.addEventListener('hashchange', () => apply(currentView()));
  apply(currentView());
})();
