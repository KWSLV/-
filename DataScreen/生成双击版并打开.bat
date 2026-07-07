@echo off
chcp 65001 >nul
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo 未检测到 Node.js，请先安装 Node.js LTS 版本。
  pause
  exit /b 1
)

if not exist node_modules (
  echo 正在安装依赖，请稍等...
  call npm.cmd install --cache .npm-cache
  if errorlevel 1 (
    echo 依赖安装失败。
    pause
    exit /b 1
  )
)

echo 正在生成可双击打开的单文件页面...
call npm.cmd run build
if errorlevel 1 (
  echo 构建失败。
  pause
  exit /b 1
)

start "" "%~dp0dist\standalone.html"
pause
