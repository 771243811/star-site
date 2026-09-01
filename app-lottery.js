/* ============================================================
   数理星图 · app-lottery.js
   幸运抽奖：积分系统 / 单抽与十连 / 碎片兑换 / 记录管理
   概率：60% 日卡碎片 · 30% 5元 · 10% 20元
   ============================================================ */
function createLottery(root) {
  'use strict';

  const $ = (s, el = root) => el.querySelector(s);
  const $$ = (s, el = root) => [...el.querySelectorAll(s)];

  const STORE_KEY = 'study-lottery-v1';
  const PASSWORD = 'gun771243811';
  const COST = 10;                 // 每次抽奖消耗积分
  const FRAG_PER_CARD = 10;        // 兑换一张日卡所需碎片
  const DAILY_MAX = 10;            // 每日添加上限

  const POOL = [
    { kind: 'fragment', label: '电子设备使用券日卡碎片', icon: '🧩', weight: 60 },
    { kind: 'cash5',    label: '5 元现金',                icon: '💰', weight: 30 },
    { kind: 'cash20',   label: '20 元现金',               icon: '💵', weight: 10 },
  ];

  /* ---------- 数据 ---------- */
  const defaults = () => ({ coins: 0, dayAdded: '', fragments: 0, dayCards: 0, records: [], coinLog: [] });
  let state = defaults();
  try {
    state = Object.assign(defaults(), JSON.parse(localStorage.getItem(STORE_KEY) || '{}'));
  } catch (e) { /* ignore */ }
  let cloudTimer = null;
  const save = () => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
    // 云端同步（防抖）
    clearTimeout(cloudTimer);
    cloudTimer = setTimeout(() => Cloud.save(STORE_KEY, state), 600);
  };

  const localDate = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const nowTime = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const roll = () => {
    const r = Math.random() * 100;
    if (r < POOL[0].weight) return POOL[0];
    if (r < POOL[0].weight + POOL[1].weight) return POOL[1];
    return POOL[2];
  };

  const toast = msg => window.showToast && window.showToast(msg);

  /* ---------- UI ---------- */
  root.innerHTML = `
    <div class="lottery-toolbar">
      <span class="terms-tip">🎰 幸运抽奖</span>
      <span class="terms-hint">每次抽奖消耗 10 积分 · 概率公开：60% 日卡碎片 / 30% 5元 / 10% 20元 · 10 个碎片兑换 1 张日卡</span>
    </div>
    <div class="lottery-body">
      <div class="lottery-left">
        <!-- 积分卡 -->
        <div class="lcard coin-card">
          <div class="coin-head">
            <span class="coin-label">我的积分</span>
            <span class="coin-value" data-coins>0</span>
          </div>
          <div class="coin-actions">
            <div class="coin-act">
              <span class="coin-act-label">每日添加（每天 1 次，最多 10）</span>
              <div class="coin-row">
                <input type="number" data-daily-amt min="1" max="10" value="10" placeholder="1-10">
                <button class="btn" data-daily>➕ 添加今日积分</button>
              </div>
              <span class="coin-day-state" data-day-state></span>
            </div>
            <div class="coin-act">
              <span class="coin-act-label">额外添加（需验证密码，不限额度）</span>
              <div class="coin-row">
                <input type="number" data-extra-amt min="1" placeholder="额外积分">
                <input type="password" data-extra-pwd placeholder="验证密码">
                <button class="btn ghost" data-extra>🔓 额外添加</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 抽奖舞台 -->
        <div class="lottery-stage">
          <div class="stage-btns">
            <button class="btn big" data-single>🎯 单次抽奖 · 10 积分</button>
            <button class="btn big gold" data-x10>🎰 10 连抽 · 100 积分</button>
          </div>
          <div class="stage-results" data-results></div>
        </div>

        <!-- 奖品统计 -->
        <div class="lcard prize-card">
          <h3 class="lcard-title">🏅 奖品统计</h3>
          <div class="prize-grid">
            <div class="prize"><span>🧩 日卡碎片</span><b data-frag>0</b>/10</div>
            <div class="prize"><span>📺 使用券日卡</span><b data-card>0</b> 张</div>
            <div class="prize"><span>💰 5 元</span><b data-c5>0</b> 次</div>
            <div class="prize"><span>💵 20 元</span><b data-c20>0</b> 次</div>
          </div>
          <div class="frag-bar"><i data-fragbar></i></div>
          <button class="btn gold" data-exchange>🔄 兑换日卡（消耗 10 碎片）</button>
        </div>
      </div>

      <div class="lottery-right">
        <div class="lcard lcard-records">
          <div class="lcard-head">
            <h3 class="lcard-title">🎲 抽奖记录</h3>
            <button class="btn ghost small" data-clear-lot>清空</button>
          </div>
          <div class="lrecords" data-lot-records></div>
        </div>
        <div class="lcard lcard-records">
          <div class="lcard-head">
            <h3 class="lcard-title">💳 积分记录</h3>
            <button class="btn ghost small" data-clear-log>清空</button>
          </div>
          <div class="lrecords" data-coin-records></div>
        </div>
      </div>
    </div>
  `;

  /* ---------- 抽奖 ---------- */
  function doLottery(count) {
    const need = COST * count;
    if (state.coins < need) { toast(`积分不足：抽奖需要 ${need} 积分，当前 ${state.coins} 积分`); return; }
    state.coins -= need;
    logCoin(-need, count === 1 ? '单次抽奖' : '10连抽');
    const results = [];
    for (let i = 0; i < count; i++) {
      const r = roll();
      if (r.kind === 'fragment') state.fragments++;
      results.push(r);
    }
    state.records.unshift({ id: Date.now() + Math.floor(Math.random() * 1000), time: nowTime(), date: localDate(), count, results });
    save();
    render();
    playResults(results);
  }

  /* ---------- 抽奖动画 ---------- */
  function playResults(results) {
    const box = $('[data-results]');
    box.innerHTML = '';
    const frags = results.filter(r => r.kind === 'fragment').length;
    const c5 = results.filter(r => r.kind === 'cash5').length;
    const c20 = results.filter(r => r.kind === 'cash20').length;

    const single = results.length === 1;
    results.forEach((r, i) => {
      setTimeout(() => {
        const card = document.createElement('div');
        card.className = 'rcard' + (single ? ' single' : '');
        card.innerHTML = `<span class="r-icon">${r.icon}</span><span class="r-label">${r.label}</span>`;
        box.appendChild(card);
        if (window.burstFx) window.burstFx(box.getBoundingClientRect().left + Math.random() * 300, box.getBoundingClientRect().top + 40, '251,191,36');
        if (i === results.length - 1) {
          const sum = document.createElement('div');
          sum.className = 'r-summary';
          sum.innerHTML = `本次：🧩碎片 ×${frags} · 💰5元 ×${c5} · 💵20元 ×${c20}`;
          setTimeout(() => box.appendChild(sum), 260);
        }
      }, i * (single ? 0 : 130));
    });
  }

  /* ---------- 积分 ---------- */
  function logCoin(delta, reason) {
    state.coinLog.unshift({ id: Date.now() + Math.floor(Math.random() * 1000), time: nowTime(), date: localDate(), delta, reason, balance: state.coins });
    if (state.coinLog.length > 200) state.coinLog.length = 200;
  }

  /* ---------- 渲染 ---------- */
  function render() {
    $('[data-coins]').textContent = state.coins;
    // 每日状态
    const ds = $('[data-day-state]');
    if (state.dayAdded === localDate()) ds.textContent = '✅ 今日积分已添加，明天再来';
    else ds.textContent = '🕐 今日尚未添加，可以添加 1-10 积分';
    // 奖品统计
    let c5 = 0, c20 = 0;
    state.records.forEach(r => r.results.forEach(x => {
      if (x.kind === 'cash5') c5++;
      if (x.kind === 'cash20') c20++;
    }));
    $('[data-frag]').textContent = state.fragments;
    $('[data-card]').textContent = state.dayCards;
    $('[data-c5]').textContent = c5;
    $('[data-c20]').textContent = c20;
    const pct = Math.min(100, state.fragments / FRAG_PER_CARD * 100);
    $('[data-fragbar]').style.width = pct + '%';
    const exBtn = $('[data-exchange]');
    const canEx = Math.floor(state.fragments / FRAG_PER_CARD);
    exBtn.disabled = canEx < 1;
    exBtn.textContent = canEx >= 1 ? `🔄 兑换日卡（可兑换 ${canEx} 张）` : '🔄 兑换日卡（消耗 10 碎片）';
    renderLotRecords();
    renderCoinRecords();
  }

  function renderLotRecords() {
    const wrap = $('[data-lot-records]');
    wrap.innerHTML = '';
    if (!state.records.length) {
      wrap.innerHTML = '<div class="lempty">还没有抽奖记录 — 攒够积分来试试手气 🍀</div>';
      return;
    }
    state.records.slice(0, 60).forEach(r => {
      const card = document.createElement('div');
      card.className = 'lrec';
      const icons = r.results.map(x => x.icon).join(' ');
      card.innerHTML = `
        <i class="ldot" style="--a:251,191,36"></i>
        <div class="lrec-main">
          <div class="lrec-top"><b>${r.count === 1 ? '单次抽奖' : '🎰 10连抽'}</b><span class="lrec-date">${r.date} ${r.time}</span></div>
          <div class="lrec-meta"><span class="tag tag-reward">-${COST * r.count} 积分</span><span class="lrec-result">${icons}</span></div>
        </div>`;
      wrap.appendChild(card);
    });
  }

  function renderCoinRecords() {
    const wrap = $('[data-coin-records]');
    wrap.innerHTML = '';
    if (!state.coinLog.length) {
      wrap.innerHTML = '<div class="lempty">还没有积分变动记录</div>';
      return;
    }
    state.coinLog.slice(0, 80).forEach(l => {
      const card = document.createElement('div');
      card.className = 'lrec';
      const pos = l.delta > 0;
      card.innerHTML = `
        <i class="ldot" style="--a:${pos ? '52,211,153' : '251,113,133'}"></i>
        <div class="lrec-main">
          <div class="lrec-top"><b>${esc(l.reason)}</b><span class="lrec-date">${l.date} ${l.time}</span></div>
          <div class="lrec-meta">
            <span class="tag ${pos ? 'tag-reward' : 'tag-first'}">${pos ? '+' : ''}${l.delta} 积分</span>
            <span class="lrec-rank">余额 ${l.balance}</span>
          </div>
        </div>`;
      wrap.appendChild(card);
    });
  }

  /* ---------- 事件 ---------- */
  $('[data-single]').addEventListener('click', () => doLottery(1));
  $('[data-x10]').addEventListener('click', () => doLottery(10));

  $('[data-daily]').addEventListener('click', () => {
    if (state.dayAdded === localDate()) { toast('今天已经添加过积分了，明天再来 ⏰'); return; }
    const amt = parseInt($('[data-daily-amt]').value, 10);
    if (!amt || amt < 1 || amt > DAILY_MAX) { toast(`请输入 1-${DAILY_MAX} 之间的积分`); return; }
    state.coins += amt;
    state.dayAdded = localDate();
    logCoin(amt, '每日积分');
    save();
    render();
    toast(`今日积分 +${amt} ✓ 明天再来`);
  });

  $('[data-extra]').addEventListener('click', () => {
    const amt = parseInt($('[data-extra-amt]').value, 10);
    const pwd = $('[data-extra-pwd]').value;
    if (!amt || amt < 1) { toast('请输入要添加的积分数量'); return; }
    if (pwd !== PASSWORD) { toast('验证密码错误 🔒'); $('[data-extra-pwd]').value = ''; return; }
    state.coins += amt;
    logCoin(amt, '额外添加（管理员）');
    save();
    render();
    $('[data-extra-amt]').value = '';
    $('[data-extra-pwd]').value = '';
    toast(`额外积分 +${amt} ✓`);
  });

  $('[data-exchange]').addEventListener('click', () => {
    const canEx = Math.floor(state.fragments / FRAG_PER_CARD);
    if (canEx < 1) { toast('碎片不足 10 个，还不能兑换 😅'); return; }
    state.fragments -= canEx * FRAG_PER_CARD;
    state.dayCards += canEx;
    state.records.unshift({ id: Date.now() + Math.floor(Math.random() * 1000), time: nowTime(), date: localDate(), count: 0, exchange: true, results: [{ kind: 'card', label: '电子设备使用券日卡', icon: '📺' }] });
    save();
    render();
    toast(`已兑换 ${canEx} 张电子设备使用券日卡 🎉`);
  });

  $('[data-clear-lot]').addEventListener('click', () => {
    if (!state.records.length) return;
    if (window.confirm('确定清空抽奖记录吗？')) { state.records = []; save(); render(); toast('抽奖记录已清空'); }
  });
  $('[data-clear-log]').addEventListener('click', () => {
    if (!state.coinLog.length) return;
    if (window.confirm('确定清空积分记录吗？')) { state.coinLog = []; save(); render(); toast('积分记录已清空'); }
  });

  render();

  /* ---------- 云端同步：拉取其他设备的数据覆盖本机 ---------- */
  Cloud.load(STORE_KEY).then(cloud => {
    if (cloud && typeof cloud === 'object') {
      state = Object.assign(defaults(), cloud);
      save();
      render();
    }
  });

  return { render };
}
