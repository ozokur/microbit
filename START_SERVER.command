#!/bin/bash

# Micro:bit Server - Start
# Çift tıklayarak çalıştırın!

# Script'in bulunduğu dizine git
cd "$(dirname "$0")"

clear
echo "╔════════════════════════════════════════════╗"
echo "║  🚀 Micro:bit Sunucu Başlatılıyor...       ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Eski sunucuyu durdur
if lsof -ti:8000 >/dev/null 2>&1; then
    echo "⚠️  Port 8000 zaten kullanımda, temizleniyor..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    sleep 1
fi

# PID dosyasını temizle
rm -f .server.pid 2>/dev/null

# Micro:bit kontrolü
echo "1️⃣  USB Kontrolü"
if ls /dev/tty.usbmodem* 1> /dev/null 2>&1; then
    DEVICE=$(ls /dev/tty.usbmodem* | head -n 1)
    echo "   ✅ Micro:bit bulundu: $DEVICE"
else
    echo "   ⚠️  Micro:bit USB'ye bağlı değil"
    echo "   ℹ️  USB olmadan da web uygulaması çalışır"
fi

echo ""
echo "2️⃣  Web Sunucusu Başlatılıyor"
python3 -m http.server 8000 > server.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > .server.pid

sleep 2

if ps -p $SERVER_PID > /dev/null; then
    echo "   ✅ Sunucu başlatıldı (PID: $SERVER_PID)"
else
    echo "   ❌ Sunucu başlatılamadı!"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║           ✅ Hazır!                         ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "📱 Web Uygulaması: http://localhost:8000"
echo ""
echo "🌐 Tarayıcı açılıyor..."
sleep 1

# Tarayıcıyı aç
open "http://localhost:8000"

echo ""
echo "✨ Sunucu çalışıyor!"
echo "🛑 Durdurmak için: STOP_SERVER.command çift tıklayın"
echo ""
echo "Bu pencereyi kapatabilirsiniz."
echo "Sunucu arka planda çalışmaya devam edecek."
echo ""

# 5 saniye bekle sonra kapat
sleep 5

