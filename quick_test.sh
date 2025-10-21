#!/bin/bash

echo "╔════════════════════════════════════════════╗"
echo "║  Micro:bit Sıcaklık İzleme - Test Raporu  ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# 1. USB Bağlantı Kontrolü
echo "1️⃣  USB Bağlantı Kontrolü"
if ls /dev/tty.usbmodem* 1> /dev/null 2>&1; then
    DEVICE=$(ls /dev/tty.usbmodem* | head -n 1)
    echo "   ✅ Micro:bit bulundu: $DEVICE"
else
    echo "   ❌ Micro:bit bulunamadı!"
    exit 1
fi

# 2. Program Durumu
echo ""
echo "2️⃣  Program Durumu"
if [ -f "microbit_main.py" ]; then
    LINES=$(wc -l < microbit_main.py)
    echo "   ✅ Program dosyası: microbit_main.py ($LINES satır)"
else
    echo "   ❌ Program dosyası bulunamadı!"
fi

# 3. Web Sunucusu
echo ""
echo "3️⃣  Web Sunucusu"
if curl -s http://localhost:8000 > /dev/null 2>&1; then
    echo "   ✅ Web sunucusu çalışıyor: http://localhost:8000"
else
    echo "   ❌ Web sunucusu çalışmıyor!"
fi

# 4. Seri Port Testi
echo ""
echo "4️⃣  Seri Port Testi (3 saniye)"
echo "   📡 Micro:bit'ten gelen veriler:"
timeout 3 cat $DEVICE 2>/dev/null | head -10 | while IFS= read -r line; do
    echo "      → $line"
done || echo "   ⏳ Veri henüz gelmiyor (normal, birkaç saniye sürebilir)"

# 5. Dosya Kontrolü
echo ""
echo "5️⃣  Web Uygulaması Dosyaları"
for file in index.html app.js chart.js styles.css; do
    if [ -f "$file" ]; then
        SIZE=$(ls -lh "$file" | awk '{print $5}')
        echo "   ✅ $file ($SIZE)"
    else
        echo "   ❌ $file eksik!"
    fi
done

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║           Sonraki Adımlar                  ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "1. Micro:bit ekranında ❤️ ikonu görmeli"
echo "2. Tarayıcıda açın: http://localhost:8000"
echo "3. 'Micro:bit'e Bağlan' butonuna tıklayın"
echo "4. Cihaz listesinden Micro:bit'i seçin"
echo "5. Sıcaklık verilerinin geldiğini gözlemleyin"
echo ""
echo "🐛 Debug için:"
echo "   screen $DEVICE 115200"
echo "   (Çıkmak için: CTRL+A, sonra K, sonra Y)"
echo ""

