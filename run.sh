#!/bin/bash

# Micro:bit Sıcaklık İzleme - Hızlı Başlatma
# All-in-one: Program yükleme + Sunucu başlatma

clear
echo "╔════════════════════════════════════════════╗"
echo "║   🎯 Micro:bit Tam Kurulum ve Başlatma     ║"
echo "╚════════════════════════════════════════════╝"
echo ""

cd "$(dirname "$0")"

# PATH'e pipx ekle
export PATH="$PATH:$HOME/.local/bin"

# 1. Micro:bit Kontrolü
echo "1️⃣  Micro:bit kontrolü..."
if ls /dev/tty.usbmodem* 1> /dev/null 2>&1; then
    DEVICE=$(ls /dev/tty.usbmodem* | head -n 1)
    echo "   ✅ Micro:bit bulundu: $DEVICE"
    
    # Program yükle
    echo ""
    echo "2️⃣  Program yükleniyor..."
    if command -v uflash &> /dev/null; then
        echo "   📤 microbit_main.py yükleniyor..."
        uflash microbit_main.py
        if [ $? -eq 0 ]; then
            echo "   ✅ Program başarıyla yüklendi!"
            echo "   ⏳ Micro:bit yeniden başlatılıyor... (3 saniye)"
            sleep 3
        else
            echo "   ⚠️  Program yüklenemedi"
            echo "   ℹ️  Manuel yükleme: https://python.microbit.org/"
        fi
    else
        echo "   ⚠️  uflash bulunamadı"
        echo "   💡 Kurulum: pipx install uflash"
        echo "   ℹ️  Manuel yükleme: https://python.microbit.org/"
    fi
    
    # LED kontrolü hatırlatması
    echo ""
    echo "   💡 Micro:bit ekranında ❤️ ikonu görmeli"
    
else
    echo "   ⚠️  Micro:bit bulunamadı"
    echo "   💡 USB bağlantısını kontrol edin"
    echo "   ℹ️  USB olmadan da web uygulaması çalışır"
fi

# 3. Web Sunucusunu Başlat
echo ""
echo "3️⃣  Web uygulaması başlatılıyor..."

# Eski sunucuyu durdur
if lsof -ti:8000 >/dev/null 2>&1; then
    echo "   🧹 Eski sunucu temizleniyor..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    sleep 1
fi

rm -f .server.pid 2>/dev/null

# Yeni sunucuyu başlat
python3 -m http.server 8000 > server.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > .server.pid
sleep 2

if ps -p $SERVER_PID > /dev/null; then
    echo "   ✅ Web sunucusu başlatıldı (PID: $SERVER_PID)"
else
    echo "   ❌ Web sunucusu başlatılamadı!"
    exit 1
fi

# 4. Özet
echo ""
echo "╔════════════════════════════════════════════╗"
echo "║        🎉 Sistem Hazır ve Çalışıyor!       ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "📱 Web Uygulaması:"
echo "   🌐 http://localhost:8000"
echo ""
echo "🎯 Kullanım:"
echo "   1. Micro:bit ekranında ❤️ ikonu kontrol et"
echo "   2. Tarayıcıda http://localhost:8000 aç"
echo "   3. 'Micro:bit'e Bağlan' butonuna tıkla"
echo "   4. Cihazı seç ve eşleştir"
echo ""
echo "🛑 Durdurmak için:"
echo "   ./stop.sh"
echo ""
echo "🐛 Debug:"
echo "   screen $DEVICE 115200"
echo "   tail -f server.log"
echo ""

# Tarayıcıyı aç
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🌐 Tarayıcı açılıyor..."
    sleep 1
    open "http://localhost:8000"
fi

echo "✨ Hazır! İyi çalışmalar!"
echo ""

