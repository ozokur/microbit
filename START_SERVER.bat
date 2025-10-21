@echo off
REM Micro:bit Server - Start (Windows)
REM Çift tıklayarak çalıştırın!

cd /d "%~dp0"
cls

echo ================================================
echo   Micro:bit Sunucu Baslatiyor...
echo ================================================
echo.

REM Port 8000'i kontrol et
netstat -ano | findstr :8000 | findstr LISTENING >nul
if %errorlevel%==0 (
    echo [UYARI] Port 8000 zaten kullaniliyor!
    echo Port 8000'i kullanan islemi sonlandirmak icin:
    echo netstat -ano ^| findstr :8000
    echo komutuyla PID'yi bulup "taskkill /PID [PID] /F" ile sonlandirin
    echo.
    pause
)

echo 1. Web Sunucusu Baslatiliyor...
echo.

REM Python sunucusunu başlat
start /B python -m http.server 8000 > server.log 2>&1

timeout /t 2 /nobreak >nul

REM Sunucunun başladığını kontrol et
netstat -ano | findstr :8000 | findstr LISTENING >nul
if %errorlevel%==0 (
    echo [BASARILI] Sunucu baslatildi!
) else (
    echo [HATA] Sunucu baslatilamadi!
    pause
    exit /b 1
)

echo.
echo ================================================
echo            Hazir!
echo ================================================
echo.
echo Web Uygulamasi: http://localhost:8000
echo.
echo Tarayici aciliyor...
timeout /t 1 /nobreak >nul

REM Tarayıcıyı aç
start http://localhost:8000

echo.
echo Sunucu calisıyor!
echo Durdurmak icin: STOP_SERVER.bat cift tiklayin
echo.
echo Bu pencereyi kapatabilirsiniz.
echo Sunucu arka planda calismaya devam edecek.
echo.

timeout /t 5

