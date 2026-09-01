/* ============================================================
   数理星图 · app-cloud.js
   Supabase 云端同步（REST 直连，无 SDK 依赖）
   未配置时 Cloud.ready() 为 false，网站照常本地工作
   ============================================================ */
const Cloud = (() => {
  const getCfg = () => (typeof SUPABASE !== 'undefined' && SUPABASE.url && SUPABASE.anon) ? SUPABASE : null;

  const api = (path, opts = {}) => {
    const cfg = getCfg();
    if (!cfg) return Promise.reject(new Error('cloud not configured'));
    return fetch(cfg.url + path, Object.assign({}, opts, {
      headers: Object.assign({
        'apikey': cfg.anon,
        'Authorization': 'Bearer ' + cfg.anon,
        'Content-Type': 'application/json',
      }, opts.headers || {}),
    }));
  };

  return {
    ready() { return !!getCfg(); },

    /** 读取云端数据；无配置/失败/不存在返回 null */
    async load(key) {
      if (!this.ready()) return null;
      try {
        const r = await api('/rest/v1/app_data?select=value&key=eq.' + encodeURIComponent(key));
        if (!r.ok) return null;
        const rows = await r.json();
        return rows && rows.length ? rows[0].value : null;
      } catch (e) { return null; }
    },

    /** 写入云端（upsert） */
    async save(key, value) {
      if (!this.ready()) return false;
      try {
        const r = await api('/rest/v1/app_data?on_conflict=key', {
          method: 'POST',
          headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
          body: JSON.stringify({ key, value }),
        });
        return r.ok;
      } catch (e) { return false; }
    },
  };
})();
