#!/bin/bash

# Micro:bit Connection Test Script
# This script helps test the Micro:bit connection and data flow

echo "=== Micro:bit Bağlantı Test Scripti ==="
echo ""

# Check if Micro:bit is connected
echo "1. USB bağlantısı kontrolü..."
if ls /dev/tty.usbmodem* 1> /dev/null 2>&1; then
    DEVICE=$(ls /dev/tty.usbmodem* | head -n 1)
    echo "✅ Micro:bit bulundu: $DEVICE"
else
    echo "❌ Micro:bit bulunamadı! USB bağlantısını kontrol edin."
    exit 1
fi

# Check if uflash is installed
echo ""
echo "2. uflash kurulumu kontrolü..."
if command -v uflash &> /dev/null; then
    echo "✅ uflash kurulu"
else
    echo "❌ uflash kurulu değil. Kurulum için: pipx install uflash"
    exit 1
fi

# Flash the program
echo ""
echo "3. Program yükleniyor..."
if [ -f "microbit_main.py" ]; then
    uflash microbit_main.py
    echo "✅ Program Micro:bit'e yüklendi"
    echo "⏳ Micro:bit yeniden başlatılıyor... (5 saniye)"
    sleep 5
else
    echo "❌ microbit_main.py dosyası bulunamadı!"
    exit 1
fi

# Test serial connection
echo ""
echo "4. Seri port bağlantısı test ediliyor..."
echo "   (10 saniye boyunca loglar okunacak - CTRL+C ile durdurun)"
echo ""
timeout 10 cat $DEVICE 2>/dev/null | while IFS= read -r line; do
    echo "[MICRO:BIT] $line"
done

echo ""
echo "=== Test Tamamlandı ==="
echo ""
echo "Sonraki adımlar:"
echo "1. Web uygulamasını açın: http://localhost:8000"
echo "2. 'Micro:bit'e Bağlan' butonuna tıklayın"
echo "3. Açılan pencereden Micro:bit'i seçin"
echo "4. Sıcaklık verilerinin geldiğini gözlemleyin"
echo ""
echo "Debug için seri port'u şu komutla izleyebilirsiniz:"
echo "  screen $DEVICE 115200"
echo ""

