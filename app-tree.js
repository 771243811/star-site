/* ============================================================
   数理星图 · app-tree.js
   通用横向卷轴技能树渲染器（数学 / 物理共用）
   用法：createSkillTree(rootEl, { tree, storeKey })
   ============================================================ */
function createSkillTree(root, opts) {
  'use strict';

  const { tree, storeKey } = opts;

  const COLORS = {
    cyan:   { rgb: '34,211,238',  hex: '#22d3ee' },
    violet: { rgb: '167,139,250', hex: '#a78bfa' },
    amber:  { rgb: '251,191,36',  hex: '#fbbf24' },
    pink:   { rgb: '244,114,182', hex: '#f472b6' },
  };

  // 四层布局：根 → 学期 → 章节 → 技能（叶子横向按教材顺序排开）
  const LAYER_Y = [44, 178, 312, 446];
  const NODE_W = [236, 172, 150, 140];
  const NODE_H = [72, 58, 52, 46];
  const LEAF_GAP = 14;
  const CHAPTER_GAP = 62;
  const TERM_GAP = 108;
  const PAD_L = 64, PAD_R = 100, PAD_B = 44;

  const $ = (s, el = root) => el.querySelector(s);
  const $$ = (s, el = root) => [...el.querySelectorAll(s)];

  /* ---------- 构建工具条 ---------- */
  root.innerHTML = `
    <div class="tree-toolbar">
      <nav class="terms">
        <span class="terms-tip">按教材顺序横向浏览</span>
        <div class="term-btns"></div>
        <span class="terms-hint">← 按住拖动 / 触控板横滑 / 触摸滑动 →</span>
      </nav>
      <div class="tree-subbar">
        <div class="stats">
          <div class="stat-head">
            <span class="stat-label">技能点亮</span>
            <span class="stat-text"><b data-lit>0</b> / <span data-total>0</span> · <span data-pct>0%</span></span>
          </div>
          <div class="stat-bar"><div class="stat-fill" data-fill></div></div>
        </div>
        <label class="switch" title="开启后，技能需先点亮上级才能点亮">
          <input type="checkbox" data-strict>
          <span class="slider"></span>
          <span class="switch-label">技能树规则</span>
        </label>
        <div class="actions">
          <button class="btn" data-all>全部点亮</button>
          <button class="btn ghost" data-reset>重置</button>
        </div>
      </div>
    </div>
    <div class="tree-viewport" tabindex="0" aria-label="技能树，可横向滚动"></div>
    <div class="hprogress"><i></i></div>
    <div class="hint"><span data-status>尚未点亮任何技能 — 点击第一个节点开始</span></div>
  `;

  /* ---------- 状态 ---------- */
  let state = { lit: new Set(['root']), strict: false };
  try {
    const saved = JSON.parse(localStorage.getItem(storeKey) || 'null');
    if (saved && Array.isArray(saved.lit)) {
      state = { lit: new Set(saved.lit), strict: !!saved.strict };
      state.lit.add('root');
    }
  } catch (e) { /* ignore */ }

  let cloudTimer = null;
  const save = () => {
    try { localStorage.setItem(storeKey, JSON.stringify({ lit: [...state.lit], strict: state.strict })); }
    catch (e) { /* ignore */ }
    // 云端同步（防抖）
    clearTimeout(cloudTimer);
    cloudTimer = setTimeout(() => {
      Cloud.save(storeKey, { lit: [...state.lit], strict: state.strict });
    }, 600);
  };

  /* ---------- 数据展平 ---------- */
  const NODES = {};
  const EDGES = [];
  const ORDER = [];

  function walk(node, depth, parent, moduleColor) {
    const color = node.color ? COLORS[node.color] : moduleColor;
    const n = {
      id: node.id, name: node.name, en: node.en || '', desc: node.desc || '',
      depth, parentId: parent ? parent.id : null, color,
      children: [],
      x: 0, y: 0, w: 0, h: 0,
      leafTotal: 0,
      el: null, pbar: null, badge: null,
    };
    NODES[node.id] = n;
    ORDER.push(n);
    if (node.children) {
      node.children.forEach(c => n.children.push(walk(c, depth + 1, n, color)));
    }
    return n;
  }
  walk(tree, 0, null, COLORS.cyan);

  (function countLeaves(n) {
    n.leafTotal = n.children.length
      ? n.children.reduce((s, c) => s + countLeaves(c), 0)
      : 1;
    return n.leafTotal;
  })(NODES.root);
  const TOTAL_LEAVES = NODES.root.leafTotal;

  const leavesOf = n => {
    const out = [];
    (function go(x) { x.children.length ? x.children.forEach(go) : out.push(x); })(n);
    return out;
  };
  const litLeavesOf = n => leavesOf(n).filter(l => state.lit.has(l.id)).length;
  const isLit = id => state.lit.has(id);

  /* ---------- 布局 ---------- */
  for (const n of ORDER) { n.w = NODE_W[n.depth]; n.h = NODE_H[n.depth]; }

  let cx = PAD_L;
  const terms = NODES.root.children;
  terms.forEach((t, ti) => {
    t.children.forEach((c, ci) => {
      c.children.forEach(leaf => { leaf.x = cx; cx += leaf.w + LEAF_GAP; });
      if (ci < t.children.length - 1) cx += CHAPTER_GAP - LEAF_GAP;
    });
    if (ti < terms.length - 1) cx += TERM_GAP - LEAF_GAP;
  });
  const TREE_W = cx + PAD_R;

  for (const n of ORDER) {
    if (n.children.length) {
      const ls = leavesOf(n);
      n.x = (ls[0].x + ls[ls.length - 1].x + ls[ls.length - 1].w) / 2 - n.w / 2;
    }
  }
  NODES.root.x = PAD_L;
  for (const n of ORDER) n.y = LAYER_Y[n.depth];
  const TREE_H = LAYER_Y[3] + NODE_H[3] + PAD_B;

  /* ---------- 渲染树 ---------- */
  const viewport = $('.tree-viewport');
  const stage = document.createElement('div');
  stage.className = 'tree-stage';
  const treeEl = document.createElement('div');
  treeEl.className = 'tree';
  const edgesSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  edgesSvg.setAttribute('class', 'edges');
  const nodesEl = document.createElement('div');
  nodesEl.className = 'tree-nodes';
  treeEl.appendChild(edgesSvg);
  treeEl.appendChild(nodesEl);
  stage.appendChild(treeEl);
  viewport.appendChild(stage);

  treeEl.style.width = TREE_W + 'px';
  treeEl.style.height = TREE_H + 'px';
  edgesSvg.setAttribute('width', TREE_W);
  edgesSvg.setAttribute('height', TREE_H);

  for (const id in NODES) {
    const n = NODES[id];
    n.children.forEach(c => {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const x1 = n.x + n.w / 2, y1 = n.y + n.h;
      const x2 = c.x + c.w / 2, y2 = c.y;
      const dy = Math.max(24, (y2 - y1) * 0.45);
      p.setAttribute('d', `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`);
      p.classList.add('edge');
      p.style.setProperty('--a', c.color.rgb);
      p.dataset.a = c.id;
      p.dataset.b = n.id;
      edgesSvg.appendChild(p);
      EDGES.push({ a: n.id, b: c.id, el: p });
    });
  }

  let stagger = 0;
  for (const n of ORDER) {
    const el = document.createElement('div');
    el.className = `node depth-${n.depth}`;
    el.dataset.id = n.id;
    el.style.left = n.x + 'px';
    el.style.top = n.y + 'px';
    el.style.width = n.w + 'px';
    el.style.height = n.h + 'px';
    el.style.setProperty('--a', n.color.rgb);
    el.style.animationDelay = (stagger++ * 7) + 'ms';
    el.innerHTML = `
      <span class="ripple"></span>
      <span class="stripe"></span>
      <span class="dot"></span>
      ${n.children.length ? `<span class="badge">0/${n.children.length}</span>` : ''}
      <div class="nm">${n.name}</div>
      <div class="en">${n.en}</div>
      ${n.children.length ? '<div class="pbar"><i></i></div>' : ''}`;
    n.el = el;
    n.pbar = n.children.length ? $('.pbar i', el) : null;
    n.badge = n.children.length ? $('.badge', el) : null;
    nodesEl.appendChild(el);
  }

  /* ---------- 学期导航按钮 ---------- */
  const termBtnsWrap = $('.term-btns');
  const termBtns = terms.map(t => {
    const b = document.createElement('button');
    b.className = 'term-btn';
    b.dataset.term = t.id;
    b.innerHTML = `<i style="--a:${t.color.rgb}"></i>${t.name.replace('年级上册', '上').replace('年级下册', '下')}<span class="tcount">0/${t.leafTotal}</span>`;
    termBtnsWrap.appendChild(b);
    return b;
  });

  /* ---------- 视口自适应 ---------- */
  const H_TOP = 60, H_TOOLBAR = 98, H_HINT = 30;
  let scale = 1;
  function fit() {
    const availH = window.innerHeight - H_TOP - H_TOOLBAR - H_HINT - 16;
    scale = Math.min(1, Math.max(0.55, availH / TREE_H));
    stage.style.width = (TREE_W * scale) + 'px';
    stage.style.height = (TREE_H * scale) + 'px';
    viewport.style.height = (TREE_H * scale) + 'px';
    treeEl.style.transform = `scale(${scale})`;
  }
  fit();
  window.addEventListener('resize', fit);

  /* ---------- 拖拽滚动 + 点击 ---------- */
  const drag = { active: false, moved: false, startX: 0, startScroll: 0 };
  let suppressClick = false;

  viewport.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') return;
    drag.active = true; drag.moved = false;
    drag.startX = e.clientX;
    drag.startScroll = viewport.scrollLeft;
    viewport.classList.add('grabbing');
  });
  window.addEventListener('pointermove', e => {
    if (!drag.active) return;
    const dx = e.clientX - drag.startX;
    if (!drag.moved && Math.abs(dx) > 8) drag.moved = true;
    if (drag.moved) viewport.scrollLeft = drag.startScroll - dx;
  });
  window.addEventListener('pointerup', () => {
    if (!drag.active) return;
    drag.active = false;
    viewport.classList.remove('grabbing');
    if (drag.moved) suppressClick = true;
  });
  nodesEl.addEventListener('click', e => {
    if (suppressClick) { suppressClick = false; return; }
    const el = e.target.closest('.node');
    if (el) toggle(el.dataset.id);
  });
  viewport.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { viewport.scrollBy({ left: 280, behavior: 'smooth' }); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { viewport.scrollBy({ left: -280, behavior: 'smooth' }); e.preventDefault(); }
  });

  /* ---------- 点亮 ---------- */
  function onLit(n) {
    n.el.classList.add('just-lit');
    setTimeout(() => n.el.classList.remove('just-lit'), 760);
    if (window.burstFx) {
      const r = n.el.getBoundingClientRect();
      window.burstFx(r.left + r.width / 2, r.top + r.height / 2, n.color.rgb);
    }
  }
  function blocked(n) {
    const parent = NODES[n.parentId];
    window.showToast && window.showToast(`技能树规则：请先点亮「${parent.name}」`);
    n.el.classList.add('shake');
    setTimeout(() => n.el.classList.remove('shake'), 480);
  }
  function toggle(id) {
    const n = NODES[id];
    if (!n) return;
    if (n.depth === 0) { window.showToast && window.showToast('点击右上角「全部点亮」或「重置」'); return; }
    if (n.children.length) {
      const leaves = leavesOf(n);
      const anyLit = leaves.some(l => isLit(l.id));
      if (anyLit) {
        leaves.forEach(l => state.lit.delete(l.id));
      } else {
        if (state.strict && !isLit(n.parentId)) { blocked(n); return; }
        leaves.forEach(l => state.lit.add(l.id));
        onLit(n);
      }
    } else {
      if (isLit(n.id)) {
        state.lit.delete(n.id);
      } else {
        if (state.strict && !isLit(n.parentId)) { blocked(n); return; }
        state.lit.add(n.id);
        onLit(n);
      }
    }
    sync();
  }

  /* ---------- 同步 ---------- */
  function sync() {
    for (const n of ORDER) {
      const lit = isLit(n.id);
      n.el.classList.toggle('lit', lit);
      if (n.pbar) n.pbar.style.width = (litLeavesOf(n) / n.leafTotal * 100) + '%';
      if (n.badge) n.badge.textContent = `${n.children.filter(c => isLit(c.id)).length}/${n.children.length}`;
    }
    EDGES.forEach(e => e.el.classList.toggle('on', isLit(e.a) && isLit(e.b)));

    const litLeaves = litLeavesOf(NODES.root);
    const pct = Math.round(litLeaves / TOTAL_LEAVES * 100);
    $('[data-lit]').textContent = litLeaves;
    $('[data-total]').textContent = TOTAL_LEAVES;
    $('[data-pct]').textContent = pct + '%';
    $('[data-fill]').style.width = pct + '%';
    termBtns.forEach(b => {
      const t = NODES[b.dataset.term];
      if (t) $('.tcount', b).textContent = `${litLeavesOf(t)}/${t.leafTotal}`;
    });
    $('[data-status]').textContent = litLeaves === 0
      ? '尚未点亮任何技能 — 点击第一个节点开始'
      : litLeaves === TOTAL_LEAVES
        ? '🎉 全图点亮！该学科技能树已完全解锁'
        : `已点亮 ${litLeaves} / ${TOTAL_LEAVES} 项技能，继续加油`;
    save();
  }

  /* ---------- 学期跳转 & 浏览进度 ---------- */
  const hbar = $('.hprogress i');
  termBtns.forEach(b => {
    b.addEventListener('click', () => {
      const t = NODES[b.dataset.term];
      if (!t) return;
      viewport.scrollTo({ left: Math.max(0, (t.x + t.w / 2) * scale - viewport.clientWidth / 2), behavior: 'smooth' });
    });
  });
  function onScroll() {
    const max = viewport.scrollWidth - viewport.clientWidth;
    hbar.style.width = (max > 0 ? (viewport.scrollLeft / max) * 100 : 0) + '%';
    const visCx = (viewport.scrollLeft + viewport.clientWidth / 2) / scale;
    let activeId = terms[0].id;
    for (const t of terms) {
      const ls = leavesOf(t);
      const minX = ls[0].x, maxX = ls[ls.length - 1].x + ls[ls.length - 1].w;
      if (visCx >= minX - 20 && visCx <= maxX + 20) { activeId = t.id; break; }
    }
    termBtns.forEach(b => b.classList.toggle('active', b.dataset.term === activeId));
  }
  viewport.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 悬浮提示（全局 tooltip） ---------- */
  const tip = document.getElementById('tooltip');
  let tipTimer = null;
  nodesEl.addEventListener('mouseover', e => {
    const el = e.target.closest('.node');
    if (!el) return;
    clearTimeout(tipTimer);
    tipTimer = setTimeout(() => showTip(el), 60);
  });
  nodesEl.addEventListener('mouseout', e => {
    const el = e.target.closest('.node');
    if (!el) return;
    clearTimeout(tipTimer);
    tip.classList.remove('show');
  });
  function showTip(el) {
    const n = NODES[el.dataset.id];
    if (!n) return;
    tip.querySelector('.tt-name').textContent = n.name;
    tip.querySelector('.tt-en').textContent = n.en;
    tip.querySelector('.tt-desc').textContent = n.desc;
    const st = tip.querySelector('.tt-status');
    const lit = n.children.length ? litLeavesOf(n) : (isLit(n.id) ? 1 : 0);
    st.style.setProperty('--a', n.color.rgb);
    st.textContent = n.children.length
      ? `子技能 ${lit} / ${n.leafTotal} 已点亮`
      : (isLit(n.id) ? '已点亮 · 点击熄灭' : '未点亮 · 点击点亮');
    st.classList.toggle('lit', lit > 0);
    tip.classList.add('show');
    const r = el.getBoundingClientRect();
    let tx = r.right + 16, ty = r.top + r.height / 2;
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    if (tx + tw > window.innerWidth - 10) tx = r.left - tw - 16;
    if (ty + th / 2 > window.innerHeight - 10) ty = window.innerHeight - 10 - th / 2;
    if (ty - th / 2 < 10) ty = 10 + th / 2;
    tip.style.left = tx + 'px';
    tip.style.top = (ty - th / 2) + 'px';
  }

  /* ---------- 控制按钮 ---------- */
  $('[data-strict]').addEventListener('change', e => {
    state.strict = e.target.checked;
    save();
    window.showToast && window.showToast(state.strict ? '技能树规则已开启：需先点亮上级技能' : '自由模式：任意节点可直接点亮');
  });
  $('[data-all]').addEventListener('click', () => {
    leavesOf(NODES.root).forEach(l => state.lit.add(l.id));
    sync();
    window.showToast && window.showToast('已点亮全部技能 ⚡');
  });
  $('[data-reset]').addEventListener('click', () => {
    state.lit = new Set(['root']);
    sync();
    window.showToast && window.showToast('已重置 — 所有技能恢复待点亮');
  });

  sync();

  /* ---------- 云端同步：拉取其他设备的数据覆盖本机 ---------- */
  Cloud.load(storeKey).then(cloud => {
    if (cloud && Array.isArray(cloud.lit)) {
      state.lit = new Set(cloud.lit);
      state.lit.add('root');
      if (typeof cloud.strict === 'boolean') state.strict = cloud.strict;
      sync();
    } else {
      save(); // 云端无数据：把本机数据上传（跨设备迁移）
    }
  });

  return { sync, fit };
}
