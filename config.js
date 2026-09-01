/* ============================================================
   数理星图 · 云端同步配置（Supabase）
   ============================================================
   配置步骤（完成后所有设备数据互通）：
   1. 打开 https://supabase.com 用邮箱注册，登录后点 New project
   2. 填项目名（如 study-star）、设置数据库密码、Region 选 Singapore (ap-southeast-1)
      → Create new project，等待 1-2 分钟创建完成
   3. 左侧菜单 Settings → API：复制 "Project URL" 和 "anon public" key
   4. 左侧菜单 SQL Editor → New query，粘贴下面的 SQL 并 Run：

      create table if not exists app_data (
        key text primary key,
        value jsonb not null,
        updated_at timestamptz default now()
      );
      alter table app_data enable row level security;
      drop policy if exists "public_select" on app_data;
      create policy "public_select" on app_data for select using (true);
      drop policy if exists "public_insert" on app_data;
      create policy "public_insert" on app_data for insert with check (true);
      drop policy if exists "public_update" on app_data;
      create policy "public_update" on app_data for update using (true);

   5. 把 URL 和 anon key 填到下面两个引号里，保存并重新部署
   ============================================================ */
const SUPABASE = {
  url: '',
  anon: '',
};
