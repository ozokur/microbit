@echo off
REM Micro:bit Server - Stop (Windows)
REM Çift tıklayarak çalıştırın!

cd /d "%~dp0"
cls

echo ================================================
echo   Micro:bit Sunucu Durduruluyor...
echo ================================================
echo.

REM Port 8000'i kullanan işlemi bul ve durdur
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    echo Port 8000 kullanan islem durduruluyor: PID %%a
    taskkill /PID %%a /F >nul 2>&1
    if %errorlevel%==0 (
        echo [BASARILI] Sunucu durduruldu
    ) else (
        echo [BILGI] Islem zaten durdurulmus
    )
)

REM Kontrol et
timeout /t 1 /nobreak >nul
netstat -ano | findstr :8000 | findstr LISTENING >nul
if %errorlevel%==0 (
    echo [UYARI] Port 8000 hala kullanimda
) else (
    echo [BASARILI] Port 8000 bos
)

echo.
echo ================================================
echo            Durduruldu!
echo ================================================
echo.
echo Tekrar baslatmak icin: START_SERVER.bat cift tiklayin
echo.

timeout /t 3

