@echo off
title COM@T
cd /d "%~dp0"

where node >/dev/null 2>nul
if errorlevel 1 (
  echo Node.js belum terpasang. Unduh di https://nodejs.org lalu jalankan file ini lagi.
  pause
  exit /b 1
)

rem Pasang dependensi kalau belum ada, atau kalau yang ada hasil install dari WSL/Linux.
if not exist "node_modules\@esbuild\win32-x64" (
  echo Memasang dependensi, sekali saja...
  call npm install
  if errorlevel 1 (
    echo npm install gagal.
    pause
    exit /b 1
  )
)

echo Membuka http://localhost:5173 ... tutup jendela ini untuk berhenti.
call npm run dev -- --open
pause
