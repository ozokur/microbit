#!/bin/bash

# Micro:bit Sıcaklık İzleme - Başlatma Scripti
# Tek komutla tüm sistemi başlatır

clear
echo "╔════════════════════════════════════════════╗"
echo "║  🚀 Micro:bit Sıcaklık İzleme Başlatılıyor  ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Proje dizinine git
cd "$(dirname "$0")"

# 1. USB Kontrolü
echo "1️⃣  USB bağlantısı kontrol ediliyor..."
if ls /dev/tty.usbmodem* 1> /dev/null 2>&1; then
    DEVICE=$(ls /dev/tty.usbmodem* | head -n 1)
    echo "   ✅ Micro:bit bulundu: $DEVICE"
else
    echo "   ⚠️  Micro:bit bulunamadı (USB bağlı değil)"
    echo "   ℹ️  USB olmadan da web uygulaması çalışır"
fi

# 2. Web Sunucusunu Başlat
echo ""
echo "2️⃣  Web sunucusu başlatılıyor..."
PORT=8000

# Eski sunucuyu durdur
if lsof -ti:$PORT >/dev/null 2>&1; then
    echo "   ⚠️  Port $PORT zaten kullanımda, temizleniyor..."
    lsof -ti:$PORT | xargs kill -9 2>/dev/null
    sleep 1
fi

# PID dosyasını temizle
rm -f .server.pid 2>/dev/null

# Yeni sunucuyu başlat
echo "   🌐 Sunucu başlatılıyor: http://localhost:$PORT"
python3 -m http.server $PORT > /dev/null 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > .server.pid
sleep 2

# Kontrolü
if ps -p $SERVER_PID > /dev/null; then
    echo "   ✅ Web sunucusu başarıyla başlatıldı (PID: $SERVER_PID)"
else
    echo "   ❌ Web sunucusu başlatılamadı!"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║           ✅ Sistem Hazır!                  ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "📱 Web Uygulaması: http://localhost:$PORT"
echo "🔗 Tarayıcınızda Chrome veya Edge kullanın"
echo ""
echo "🎯 Sonraki Adımlar:"
echo "   1. Tarayıcıda http://localhost:$PORT açın"
echo "   2. 'Micro:bit'e Bağlan' butonuna tıklayın"
echo "   3. Cihazınızı seçip eşleştirin"
echo ""
echo "🛑 Durdurmak için: ./stop.sh"
echo "📊 Logları görmek için: tail -f server.log"
echo ""

# Tarayıcıyı otomatik aç (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🌐 Tarayıcı açılıyor..."
    sleep 1
    open "http://localhost:$PORT"
fi

echo "✨ Hazır! İyi çalışmalar!"
echo ""

