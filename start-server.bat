@echo off
chcp 65001 >nul
cd /d %~dp0
echo ============================================
echo   数理星图 · 学习激励站 本地服务器
echo   访问地址: http://localhost:4175
echo   关闭本窗口即停止服务
echo ============================================
node server.js
pause
