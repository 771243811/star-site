/* ============================================================
   数理星图 · app-ladder.js
   学习名次攀登 · 高山天梯：黑色高耸的山体，纵向拖动浏览
   考试记录管理 + 奖励结算 + 登山可视化
   ============================================================ */
function createLadder(root) {
  'use strict';

  const $ = (s, el = root) => el.querySelector(s);
  const $$ = (s, el = root) => [...el.querySelectorAll(s)];

  const STORE_KEY = 'study-ladder-v1';

  /* ---------- 奖励规则（按"出发名次"计每步奖励，区间累计与设定一致） ---------- */
  const REWARD = [
    { from: 81, to: 100, per: 20,       total: 400,  label: '前100 → 前80' },
    { from: 61, to: 80,  per: 25,       total: 500,  label: '前80 → 前60' },
    { from: 41, to: 60,  per: 35,       total: 700,  label: '前60 → 前40' },
    { from: 31, to: 40,  per: 100,      total: 1000, label: '前40 → 前30' },
    { from: 21, to: 30,  per: 140,      total: 1400, label: '前30 → 前20' },
    { from: 11, to: 20,  per: 200,      total: 2000, label: '前20 → 前10' },
    { from: 2,  to: 10,  per: 3000 / 9, total: 3000, label: '前10 → 第1' },
  ];
  const FIRST_100_BONUS = 300;

  const SUBJECTS = {
    math:    { name: '数学', color: '34,211,238' },
    physics: { name: '物理', color: '167,139,250' },
    other:   { name: '其他', color: '251,191,36' },
  };

  /* ---------- 山体坐标映射 ----------
     山高 4000px：第 1 名在山顶 (y≈160)，第 100 名在山脚 (y≈3820) */
  const MT = { top: 160, span: 3660, total: 4000 };
  const yOf = rank => MT.top + (rank - 1) / 99 * MT.span;

  /* ---------- 数据 ---------- */
  let records = [];
  try { records = JSON.parse(localStorage.getItem(STORE_KEY) || '[]') || []; } catch (e) { records = []; }
  const save = () => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(records)); } catch (e) { /* ignore */ }
  };

  const perStep = r => {
    for (const s of REWARD) if (r >= s.from && r <= s.to) return s.per;
    return 0;
  };

  function compute() {
    const recs = [...records].sort((a, b) => (a.date || '').localeCompare(b.date || '') || a.id - b.id);
    let best = 100;
    let achieved = null;
    let first100 = false;
    let total = 0;
    for (const rec of recs) {
      const info = { steps: 0, reward: 0, first100: false, newBest: false };
      if (rec.rank <= 100 && !first100) {
        first100 = true;
        info.first100 = true;
        total += FIRST_100_BONUS;
      }
      if (rec.rank < best) {
        let amt = 0;
        for (let r = rec.rank + 1; r <= best; r++) amt += perStep(r);
        info.steps = best - rec.rank;
        info.reward = amt;
        info.newBest = true;
        total += amt;
        best = rec.rank;
      }
      if (achieved === null || rec.rank < achieved) achieved = rec.rank;
      rec._info = info;
    }
    for (const s of REWARD) {
      const lo = Math.max(s.from, achieved == null ? 101 : achieved);
      let claimed = 0, amt = 0;
      for (let r = lo; r <= s.to; r++) { claimed++; amt += perStep(r); }
      s.claimed = claimed;
      s.claimedAmt = amt;
      s.totalRanks = s.to - s.from + 1;
    }
    return { best, achieved, first100, total, records: recs };
  }

  /* ============================================================
     UI 构建
     ============================================================ */
  root.innerHTML = `
    <div class="ladder-toolbar">
      <span class="terms-tip">🏔 名次攀登 · 高山天梯</span>
      <span class="alt-meter" data-alt>⛰ 当前海拔 200 m</span>
      <span class="terms-hint">按住上下拖动 / 滚轮 / 触摸滑动浏览山体</span>
    </div>
    <div class="ladder-body">
      <!-- 左侧：高耸山体（纵向滚动） -->
      <div class="mountain-wrap" tabindex="0" aria-label="名次高山，可纵向滚动">
        <div class="mountain">
          <svg class="mountain-svg" viewBox="0 0 600 4000" preserveAspectRatio="none" aria-hidden="true"></svg>
          <svg class="m-climb-svg" viewBox="0 0 100 4000" preserveAspectRatio="none" aria-hidden="true"></svg>
          <div class="m-labels" data-labels></div>
          <div class="m-marks" data-marks></div>
          <div class="m-summit">🏆 第 1 名 · 登顶大奖 ¥3,000</div>
          <div class="m-base">⛺ 100 名以外 · 起点营地</div>
        </div>
      </div>

      <!-- 右侧：固定信息面板 -->
      <div class="ladder-panel">
        <div class="ladder-summary">
          <div class="lsum-item lsum-main">
            <span class="lsum-label">已领取奖励</span>
            <span class="lsum-value" data-total>¥0</span>
            <span class="lsum-sub">含首次突破前100奖 ¥<span data-bonus>0</span></span>
          </div>
          <div class="lsum-item">
            <span class="lsum-label">历史最佳</span>
            <span class="lsum-value" data-best>—</span>
          </div>
          <div class="lsum-item">
            <span class="lsum-label">考试记录</span>
            <span class="lsum-value" data-count>0</span>
          </div>
        </div>

        <div class="lcard">
          <h3 class="lcard-title">➕ 添加考试记录</h3>
          <form class="lform" data-form>
            <div class="lfield"><label>考试名称</label><input name="name" type="text" placeholder="如：八上期中考试" required></div>
            <div class="lfield-row">
              <div class="lfield"><label>日期</label><input name="date" type="date" required></div>
              <div class="lfield"><label>科目</label>
                <select name="subject">
                  <option value="math">数学</option>
                  <option value="physics">物理</option>
                  <option value="other">其他</option>
                </select>
              </div>
            </div>
            <div class="lfield-row">
              <div class="lfield"><label>名次</label><input name="rank" type="number" min="1" max="9999" placeholder="第几名" required></div>
              <div class="lfield"><label>总人数(选)</label><input name="total" type="number" min="1" max="99999" placeholder="可选"></div>
            </div>
            <button class="btn" type="submit">✍️ 记下这次考试</button>
          </form>
        </div>

        <div class="lcard lcard-records">
          <div class="lcard-head">
            <h3 class="lcard-title">📋 考试记录</h3>
            <button class="btn ghost small" data-clear>清空</button>
          </div>
          <div class="lrecords" data-records></div>
        </div>

        <div class="lcard lcard-rules">
          <h3 class="lcard-title">📜 奖励规则</h3>
          <ul class="lrules" data-rules></ul>
        </div>
      </div>
    </div>
  `;

  /* ---------- 山体 SVG（层次丰富的黑色群山） ---------- */
  const svg = $('.mountain-svg');
  const CX = 300;

  function buildSvg() {
    const H = 4000;
    const slope = y => (y / H) * 296;

    // —— 真实山轮廓：尖锐主峰 + 左右不对称的次峰群山脊 ——
    // 左侧峰脊（主峰 → 左山脚）
    const L = [[300, 2], [274, 88], [240, 236], [214, 396], [160, 706], [136, 910], [94, 1390], [73, 1840], [47, 2540], [29, 3180], [13, 3690], [5, 3960]];
    // 右侧峰脊（不对称，更陡）
    const R = [[300, 2], [330, 98], [366, 258], [392, 478], [446, 858], [470, 1198], [512, 1848], [539, 2490], [565, 3190], [587, 3710], [595, 3960]];

    // 峰脊平滑路径（垂直贝塞尔：峰点保留棱角、鞍部圆滑）
    function ridgePath(pts) {
      let d = `M ${pts[0][0]} ${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const x1 = pts[i - 1][0], y1 = pts[i - 1][1], x2 = pts[i][0], y2 = pts[i][1];
        const dy = y2 - y1;
        d += ` C ${x1} ${(y1 + dy * 0.38).toFixed(1)}, ${x2} ${(y2 - dy * 0.38).toFixed(1)}, ${x2} ${y2}`;
      }
      return d;
    }
    const closeFace = d => d + ' L 300 3960 Z';
    const leftD = ridgePath(L);
    const rightD = ridgePath(R);

    let s = `<defs>
      <linearGradient id="litSide" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2e394d"/>
        <stop offset="0.3" stop-color="#1c2434"/>
        <stop offset="0.7" stop-color="#121826"/>
        <stop offset="1" stop-color="#0b0f18"/>
      </linearGradient>
      <linearGradient id="shadowSide" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#10141f"/>
        <stop offset="0.35" stop-color="#0a0d15"/>
        <stop offset="1" stop-color="#05070c"/>
      </linearGradient>
      <linearGradient id="snowGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="rgba(214,222,238,0.75)"/>
        <stop offset="0.55" stop-color="rgba(190,200,220,0.4)"/>
        <stop offset="1" stop-color="rgba(160,172,196,0.12)"/>
      </linearGradient>
      <linearGradient id="edgeGlow" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="rgba(190,220,255,0.4)"/>
        <stop offset="0.5" stop-color="rgba(255,255,255,0.14)"/>
        <stop offset="1" stop-color="rgba(190,220,255,0.4)"/>
      </linearGradient>
      <filter id="soft2" x="-50%" y="-300%" width="200%" height="700%"><feGaussianBlur stdDeviation="5"/></filter>
      <filter id="soft5" x="-50%" y="-300%" width="200%" height="700%"><feGaussianBlur stdDeviation="14"/></filter>
      <filter id="soft9" x="-60%" y="-400%" width="220%" height="900%"><feGaussianBlur stdDeviation="26"/></filter>
    </defs>`;

    // —— 主峰左右明暗面（像真实山的受光面 / 背光面）——
    s += `<path d="${closeFace(leftD)}" fill="url(#litSide)"/>`;
    s += `<path d="${closeFace(rightD)}" fill="url(#shadowSide)"/>`;

    // 山脊轮廓：受光侧亮脊线 / 背光侧暗脊线
    s += `<path d="${leftD}" fill="none" stroke="rgba(205,222,245,0.28)" stroke-width="2.2"/>`;
    s += `<path d="${rightD}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.6"/>`;

    // 外发光 + 山脚底边
    s += `<path d="${leftD}" fill="none" stroke="rgba(160,200,255,0.25)" stroke-width="8" filter="url(#soft5)"/>`;
    s += `<path d="${rightD}" fill="none" stroke="rgba(160,200,255,0.16)" stroke-width="8" filter="url(#soft5)"/>`;
    s += `<path d="${leftD}" fill="none" stroke="url(#edgeGlow)" stroke-width="2"/>`;
    s += `<path d="${rightD}" fill="none" stroke="url(#edgeGlow)" stroke-width="1.6"/>`;
    s += `<line x1="5" y1="3960" x2="595" y2="3960" stroke="rgba(190,220,255,0.2)" stroke-width="1.6"/>`;

    // 山脊褶皱（主峰向各次峰延伸的脊线）
    const creases = [
      'M 300 6 C 282 130, 258 250, 240 368',
      'M 300 6 C 291 210, 283 440, 277 700',
      'M 277 700 C 262 830, 248 960, 238 1150',
      'M 318 6 C 336 170, 348 350, 360 520',
      'M 360 520 C 382 690, 398 870, 408 1110',
      'M 300 6 C 300 280, 300 580, 300 920',
    ];
    creases.forEach(cr => {
      s += `<path d="${cr}" fill="none" stroke="rgba(255,255,255,0.13)" stroke-width="2"/>`;
      s += `<path d="${cr}" fill="none" stroke="rgba(180,210,245,0.2)" stroke-width="1.2" filter="url(#soft2)" transform="translate(0,10)"/>`;
    });

    // 岩层线（灰白弧形，中下部更密）
    const strata = [
      { y: 520, c: 'rgba(255,255,255,0.10)' },
      { y: 660, c: 'rgba(255,255,255,0.09)' },
      { y: 820, c: 'rgba(255,255,255,0.08)' },
      { y: 1000, c: 'rgba(255,255,255,0.075)' },
      { y: 1200, c: 'rgba(255,255,255,0.07)' },
      { y: 1420, c: 'rgba(255,255,255,0.065)' },
      { y: 1660, c: 'rgba(255,255,255,0.06)' },
      { y: 1920, c: 'rgba(255,255,255,0.055)' },
      { y: 2200, c: 'rgba(255,255,255,0.05)' },
      { y: 2500, c: 'rgba(255,255,255,0.05)' },
      { y: 2820, c: 'rgba(255,255,255,0.045)' },
      { y: 3160, c: 'rgba(255,255,255,0.04)' },
      { y: 3500, c: 'rgba(255,255,255,0.035)' },
      { y: 3780, c: 'rgba(255,255,255,0.03)' },
    ];
    strata.forEach((st, i) => {
      const hw = slope(st.y) * 0.96;
      const dip = 9 * Math.sin(i * 1.9);
      s += `<path d="M ${(CX - hw).toFixed(1)} ${st.y} Q ${CX} ${(st.y + dip).toFixed(1)}, ${(CX + hw).toFixed(1)} ${st.y}" fill="none" stroke="${st.c}" stroke-width="1.2"/>`;
    });

    // 雪盖（覆盖主峰与双肩峰顶）
    s += `<path d="M 300 2 C 272 84, 244 170, 228 232 C 218 276, 212 320, 212 362 C 240 402, 272 422, 300 430 C 328 422, 360 402, 388 362 C 388 320, 382 276, 372 232 C 356 170, 328 84, 300 2 Z" fill="url(#snowGrad)" filter="url(#soft2)"/>`;
    s += `<path d="M 300 2 C 282 60, 268 120, 260 180 C 256 220, 262 260, 270 300 C 282 330, 292 344, 300 350 C 308 344, 318 330, 330 300 C 338 260, 344 220, 340 180 C 332 120, 318 60, 300 2 Z" fill="rgba(230,236,248,0.65)" filter="url(#soft2)"/>`;
    // 山谷雪流（沿山谷向下延伸的积雪带）
    const snowRivers = [
      'M 228 232 C 206 430, 188 790, 174 1240',
      'M 372 232 C 392 440, 412 810, 424 1260',
      'M 300 430 C 299 700, 297 980, 295 1300',
    ];
    snowRivers.forEach((rv, i) => {
      s += `<path d="${rv}" fill="none" stroke="rgba(210,220,238,${(0.16 - i * 0.04).toFixed(2)})" stroke-width="${9 - i * 2.5}" stroke-linecap="round" filter="url(#soft2)"/>`;
    });

    svg.innerHTML = s;
  }
  buildSvg();

  /* ---------- 段标签（营地路牌） ---------- */
  const labelsEl = $('[data-labels]');
  const SEGS = [];

  REWARD.forEach((s, i) => {
    const yTop = yOf(s.to);
    const yBot = yOf(s.from);
    const h = yBot - yTop;

    const lab = document.createElement('div');
    lab.className = `m-seg seg-${i + 1}`;
    lab.style.top = (yTop + 10) + 'px';
    lab.style.height = (h - 20) + 'px';
    lab.innerHTML = `
      <div class="m-seg-head">
        <b>${s.label}</b>
        <span>累计 <em>¥${s.total}</em> · 每名 ¥${s.per.toFixed(s.per % 1 ? 2 : 0)}</span>
      </div>
      <div class="m-seg-foot">
        <i class="m-seg-progress"><b data-prog></b></i>
        <em data-claim>已领 0/0 名</em>
      </div>`;
    labelsEl.appendChild(lab);
    SEGS.push({ seg: lab, rw: s, prog: $('[data-prog]', lab), claim: $('[data-claim]', lab), yTop, yBot });
  });

  /* ---------- 奖励规则列表 ---------- */
  const rulesEl = $('[data-rules]');
  REWARD.forEach((s, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<i class="rline ${'seg-' + (i + 1)}"></i>
      <b>${s.label}</b><span>累计 <em>¥${s.total}</em> · 每名 ¥${s.per.toFixed(s.per % 1 ? 2 : 0)}</span>`;
    rulesEl.appendChild(li);
  });

  /* ============================================================
     渲染
     ============================================================ */
  function renderAll() {
    const res = compute();

    $('[data-total]').textContent = '¥' + fmt(res.total);
    $('[data-bonus]').textContent = fmt(res.first100 ? FIRST_100_BONUS : 0);
    $('[data-best]').textContent = res.achieved ? `${res.achieved} 名` : '—';
    $('[data-count]').textContent = records.length;

    SEGS.forEach(s => {
      const pct = s.rw.totalRanks ? s.rw.claimed / s.rw.totalRanks * 100 : 0;
      s.prog.style.width = pct + '%';
      s.claim.textContent = `已领 ${s.rw.claimed}/${s.rw.totalRanks} 名`;
      s.seg.classList.toggle('full', s.rw.claimed >= s.rw.totalRanks);
    });

    renderMountain(res);
    renderRecords(res);
  }

  function renderMountain(res) {
    // 考标记点
    const marksEl = $('[data-marks]');
    marksEl.innerHTML = '';
    const recs = [...res.records].sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.id - a.id);
    const perRank = {};
    recs.forEach(rec => { perRank[rec.rank] = (perRank[rec.rank] || 0) + 1; });
    recs.forEach(rec => {
      const idx = perRank[rec.rank] || 1;
      const m = document.createElement('span');
      m.className = 'm-mark';
      const y = Math.min(MT.total - 90, yOf(Math.min(rec.rank, 100)));
      m.style.top = y + 'px';
      m.style.left = `calc(50% + ${(idx - 1 - (perRank[rec.rank] - 1) / 2) * 34}px)`;
      m.style.setProperty('--a', (SUBJECTS[rec.subject] || SUBJECTS.other).color);
      m.innerHTML = `<i></i><b>${rec.rank}</b>`;
      m.dataset.id = rec.id;
      if (rec.rank > 100) m.classList.add('out');
      marksEl.appendChild(m);
    });

    // 历史最佳徽章
    const old = $('.m-best', marksEl);
    if (old) old.remove();
    if (res.achieved != null && res.achieved <= 100) {
      const star = document.createElement('span');
      star.className = 'm-best';
      star.style.top = Math.max(0, yOf(res.achieved) - 22) + 'px';
      star.innerHTML = '★ 历史最佳 ' + res.achieved + ' 名';
      marksEl.appendChild(star);
    }

    // 爬升轨迹
    const climb = $('.m-climb-svg');
    const ordered = [...res.records].sort((a, b) => (a.date || '').localeCompare(b.date || '') || a.id - b.id);
    if (ordered.length >= 2) {
      const pts = ordered.map(r => {
        const y = Math.min(MT.total - 90, yOf(Math.min(r.rank, 100)));
        return `50,${y.toFixed(1)}`;
      }).join(' ');
      climb.innerHTML = `<polyline points="${pts}" class="m-climb"/>`;
    } else {
      climb.innerHTML = '';
    }
  }

  function renderRecords(res) {
    const wrap2 = $('[data-records]');
    wrap2.innerHTML = '';
    const recs = [...res.records].sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.id - a.id);
    if (!recs.length) {
      wrap2.innerHTML = '<div class="lempty">还没有考试记录 — 添加第一次考试，开始登山 🏔</div>';
      return;
    }
    recs.forEach(rec => {
      const info = rec._info;
      const sub = SUBJECTS[rec.subject] || SUBJECTS.other;
      const card = document.createElement('div');
      card.className = 'lrec';
      card.innerHTML = `
        <i class="ldot" style="--a:${sub.color}"></i>
        <div class="lrec-main">
          <div class="lrec-top">
            <b>${esc(rec.name)}</b>
            <span class="lrec-date">${rec.date || ''}${rec.total ? ' · 共' + rec.total + '人' : ''}</span>
          </div>
          <div class="lrec-meta">
            <span class="lrec-rank">第 <em>${rec.rank}</em> 名</span>
            ${info.first100 ? '<span class="tag tag-first">🎉 首次突破前100</span>' : ''}
            ${info.newBest ? `<span class="tag tag-best">▲ 进步 ${info.steps} 名</span>` : '<span class="tag tag-flat">— 未进步</span>'}
            ${info.reward > 0 ? `<span class="tag tag-reward">+¥${fmt(info.reward)}</span>` : ''}
          </div>
        </div>
        <button class="lrec-del" data-del="${rec.id}" title="删除记录">✕</button>
      `;
      wrap2.appendChild(card);
    });
  }

  /* ---------- 纵向拖拽滚动（鼠标） ---------- */
  const wrap = $('.mountain-wrap');
  const drag = { active: false, moved: false, startY: 0, startScroll: 0 };
  wrap.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') return;
    drag.active = true; drag.moved = false;
    drag.startY = e.clientY;
    drag.startScroll = wrap.scrollTop;
    wrap.classList.add('grabbing');
  });
  window.addEventListener('pointermove', e => {
    if (!drag.active) return;
    const dy = e.clientY - drag.startY;
    if (!drag.moved && Math.abs(dy) > 8) drag.moved = true;
    if (drag.moved) wrap.scrollTop = drag.startScroll - dy;
  });
  window.addEventListener('pointerup', () => {
    if (!drag.active) return;
    drag.active = false;
    wrap.classList.remove('grabbing');
  });
  wrap.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { wrap.scrollBy({ top: 300, behavior: 'smooth' }); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { wrap.scrollBy({ top: -300, behavior: 'smooth' }); e.preventDefault(); }
  });

  /* ---------- 海拔指示 ---------- */
  const altEl = $('[data-alt]');
  function onScroll() {
    const viewH = wrap.clientHeight;
    const mid = wrap.scrollTop + viewH / 2;
    const rank = Math.max(1, Math.min(100, 1 + (mid - MT.top) / MT.span * 99));
    const alt = Math.round(3000 - (rank - 1) / 99 * 2830);
    altEl.textContent = `⛰ 当前海拔 ${alt} m · 第 ${Math.round(rank)} 名附近`;
  }
  wrap.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 事件 ---------- */
  $('[data-form]').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    const name = f.name.value.trim();
    const date = f.date.value;
    const subject = f.subject.value;
    const rank = parseInt(f.rank.value, 10);
    const total = parseInt(f.total.value, 10);
    if (!name || !date || !rank || rank < 1) { window.showToast && window.showToast('请填写考试名称、日期与有效名次'); return; }
    records.push({ id: Date.now() + Math.floor(Math.random() * 1000), name, date, subject, rank, total: total > 0 ? total : null });
    save();
    renderAll();
    f.reset();
    f.date.value = new Date().toISOString().slice(0, 10);
    window.showToast && window.showToast('已记录：' + name + ' · 第' + rank + '名 ✓');
  });

  $('[data-records]').addEventListener('click', e => {
    const btn = e.target.closest('[data-del]');
    if (!btn) return;
    const id = Number(btn.dataset.del);
    records = records.filter(r => r.id !== id);
    save();
    renderAll();
    window.showToast && window.showToast('已删除该记录');
  });

  $('[data-clear]').addEventListener('click', () => {
    if (!records.length) return;
    if (window.confirm('确定清空全部考试记录与奖励结算吗？')) {
      records = [];
      save();
      renderAll();
      window.showToast && window.showToast('已清空全部记录');
    }
  });

  /* 考标记点悬浮提示（复用全局 tooltip） */
  const tip = document.getElementById('tooltip');
  $('[data-marks]').addEventListener('mouseover', e => {
    const m = e.target.closest('.m-mark');
    if (!m) return;
    const rec = records.find(r => String(r.id) === String(m.dataset.id));
    if (!rec) return;
    const sub = SUBJECTS[rec.subject] || SUBJECTS.other;
    tip.querySelector('.tt-name').textContent = `${rec.name} · 第${rec.rank}名`;
    tip.querySelector('.tt-en').textContent = sub.name + (rec.total ? ' · 共' + rec.total + '人' : '');
    const st = tip.querySelector('.tt-status');
    st.style.setProperty('--a', sub.color);
    st.textContent = rec.date + (rec._info && rec._info.reward > 0 ? ` · +¥${fmt(rec._info.reward)}` : '');
    tip.querySelector('.tt-desc').textContent = rec._info && rec._info.newBest
      ? (rec._info.steps > 0 ? `较上次最佳进步 ${rec._info.steps} 名` : '刷新历史最佳')
      : '名次未进步';
    st.classList.remove('lit');
    tip.classList.add('show');
    const r = m.getBoundingClientRect();
    let tx = r.right + 14, ty = r.top;
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    if (tx + tw > window.innerWidth - 10) tx = r.left - tw - 14;
    if (ty + th > window.innerHeight - 10) ty = window.innerHeight - 10 - th;
    if (ty < 10) ty = 10;
    tip.style.left = tx + 'px';
    tip.style.top = ty + 'px';
  });
  $('[data-marks]').addEventListener('mouseout', () => tip.classList.remove('show'));

  /* ---------- 工具 ---------- */
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = n => (Math.round(n * 100) / 100).toLocaleString('zh-CN', { maximumFractionDigits: 2 });

  renderAll();
  return { renderAll };
}
