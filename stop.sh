#!/bin/bash

# Micro:bit Sıcaklık İzleme - Durdurma Scripti

clear
echo "╔════════════════════════════════════════════╗"
echo "║  🛑 Micro:bit Sıcaklık İzleme Durduruluyor  ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Proje dizinine git
cd "$(dirname "$0")"

# PID dosyasından server'ı durdur
if [ -f .server.pid ]; then
    SERVER_PID=$(cat .server.pid)
    if ps -p $SERVER_PID > /dev/null 2>&1; then
        echo "🛑 Web sunucusu durduruluyor (PID: $SERVER_PID)..."
        kill $SERVER_PID 2>/dev/null
        sleep 1
        
        # Hala çalışıyorsa zorla durdur
        if ps -p $SERVER_PID > /dev/null 2>&1; then
            kill -9 $SERVER_PID 2>/dev/null
        fi
        
        echo "   ✅ Web sunucusu durduruldu"
    else
        echo "   ℹ️  Web sunucusu zaten durdurulmuş"
    fi
    rm -f .server.pid
else
    echo "   ℹ️  PID dosyası bulunamadı"
fi

# Port 8000'i kullanan tüm işlemleri durdur
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
echo "║           ✅ Sistem Durduruldu              ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "🚀 Tekrar başlatmak için: ./start.sh"
echo ""

