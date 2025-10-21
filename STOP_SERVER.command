#!/bin/bash

# Micro:bit Server - Stop
# Çift tıklayarak çalıştırın!

# Script'in bulunduğu dizine git
cd "$(dirname "$0")"

clear
echo "╔════════════════════════════════════════════╗"
echo "║  🛑 Micro:bit Sunucu Durduruluyor...       ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# PID dosyasından durdur
if [ -f .server.pid ]; then
    SERVER_PID=$(cat .server.pid)
    if ps -p $SERVER_PID > /dev/null 2>&1; then
        echo "🛑 Sunucu durduruluyor (PID: $SERVER_PID)..."
        kill $SERVER_PID 2>/dev/null
        sleep 1
        
        # Hala çalışıyorsa zorla durdur
        if ps -p $SERVER_PID > /dev/null 2>&1; then
            kill -9 $SERVER_PID 2>/dev/null
        fi
        
        echo "   ✅ Sunucu durduruldu"
    else
        echo "   ℹ️  Sunucu zaten durdurulmuş"
    fi
    rm -f .server.pid
else
    echo "   ℹ️  PID dosyası bulunamadı"
fi

# Port 8000'i temizle
echo ""
echo "🔍 Port 8000 kontrol ediliyor..."
if lsof -ti:8000 >/dev/null 2>&1; then
    echo "   ⚠️  Port 8000 hala kullanımda, temizleniyor..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    echo "   ✅ Port temizlendi"
else
    echo "   ✅ Port 8000 boş"
fi

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║           ✅ Durduruldu!                    ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "🚀 Tekrar başlatmak için: START_SERVER.command çift tıklayın"
echo ""

# 3 saniye bekle sonra kapat
sleep 3

