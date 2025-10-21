# 🚀 Hızlı Başlangıç Kılavuzu

Bu kılavuz, Micro:bit Sıcaklık İzleme Sistemi'ni 5 dakikada çalıştırmanızı sağlar.

## ⚡ 3 Adımda Başlayın

### 1️⃣ Micro:bit'e Program Yükleyin

```bash
cd /Users/ozanokur/projeler/microbit
export PATH="$PATH:/Users/ozanokur/.local/bin"
uflash microbit_main.py
```

⏳ Yükleme 10-15 saniye sürer. Micro:bit otomatik olarak yeniden başlayacaktır.

✅ Başarılı olduğunda Micro:bit ekranında **kalp ikonu** görünecek.

### 2️⃣ Web Uygulamasını Başlatın

```bash
python3 -m http.server 8000
```

🌐 Tarayıcınızda açın: **http://localhost:8000**

⚠️ **Önemli:** Chrome veya Edge tarayıcısı kullanın (Firefox/Safari desteklemiyor)

### 3️⃣ Bağlanın ve İzleyin

1. **"Micro:bit'e Bağlan"** butonuna tıklayın
2. Açılan pencereden **"BBC micro:bit XXXXX"** cihazınızı seçin
3. **"Eşleştir"** butonuna tıklayın
4. 🎉 Sıcaklık verileri gelmeye başlayacak!

## 🧪 Test Edin

### Buton A - Manuel Okuma
Micro:bit'te **A butonuna** basın → Ekranda sıcaklık değeri gösterilecek

### Buton B - Bluetooth Pairing Yardımı 🔵
Micro:bit'te **B butonuna** basın → Pairing talimatları gösterilecek
- Ekranda "BT" animasyonu
- Debug log'da bağlantı adımları
- Bluetooth'a hazır olduğunu gösterir

## 📊 Özellikler

- 📈 **Gerçek zamanlı grafik**: Son 60 ölçüm
- 📉 **İstatistikler**: Min, Max, Ortalama
- 🐛 **Debug log**: Tüm olayları takip edin
- 🔄 **Otomatik güncelleme**: Her 2 saniyede bir

## 🔧 Sorun mu Yaşıyorsunuz?

### Micro:bit Görünmüyor
```bash
# USB bağlantısını kontrol edin
ls /dev/tty.usbmodem*

# Çıktı olmalı: /dev/tty.usbmodem102 (veya benzeri)
```

### Bluetooth Bağlanamıyor
- ✅ Chrome veya Edge kullanın
- ✅ localhost kullanın (http://localhost:8000)
- ✅ Bluetooth açık olsun
- ✅ Micro:bit'te kalp ikonu görünsün

### Veri Gelmiyor
```bash
# Seri port loglarını kontrol edin
screen /dev/tty.usbmodem102 115200
# Çıkmak için: CTRL+A, sonra K, sonra Y

# Görmeli: "Temperature: XX°C" mesajları
```

## 📱 Demo Modu

Micro:bit olmadan test etmek isterseniz, simülatör ekleyebiliriz:

```javascript
// app.js içine ekleyin (geliştirme için)
// Demo mode: Rastgele sıcaklık değerleri üret
setInterval(() => {
    const temp = 20 + Math.random() * 10;
    this.updateTemperature(temp, Date.now());
}, 2000);
```

## 🎯 Kullanım İpuçları

1. **Grafik Dolu Oldu mu?**
   - "Grafiği Temizle" butonuna basın

2. **Debug Log Çok Uzun mu?**
   - "Temizle" butonuna basın

3. **Bağlantı Koptu mu?**
   - Micro:bit'i resetleyin (arka taraftaki buton)
   - Sayfayı yenileyin (F5)
   - Tekrar bağlanın

4. **Hassas Ölçüm İstiyor musunuz?**
   - Micro:bit'i doğrudan güneş ışığından uzak tutun
   - Birkaç dakika bekleyin (ısı dengelenmesi için)
   - Not: Dahili sensör yongadan gelen ısıyı ölçer

## 🚀 İleri Seviye

### Otomatik Başlatma

```bash
# Alias ekleyin (~/.zshrc veya ~/.bashrc)
alias microbit-start="cd /Users/ozanokur/projeler/microbit && python3 -m http.server 8000"

# Kullanım
microbit-start
```

### Ağ Üzerinden Erişim

```bash
# Bilgisayarınızın IP'sini bulun
ifconfig | grep "inet " | grep -v 127.0.0.1

# Sunucuyu tüm ağlara açın
python3 -m http.server 8000 --bind 0.0.0.0

# Diğer cihazlardan erişin
# http://BILGISAYAR_IP:8000
```

### Veri Dışa Aktarma (Gelecek Özellik)

Şu anda manuel olarak yapabilirsiniz:
```javascript
// Tarayıcı konsolunda
console.log(window.app.temperatures);
// Veya JSON olarak
JSON.stringify(window.app.temperatures);
```

## 📚 Daha Fazla Bilgi

- 📖 [README.md](README.md) - Detaylı dokümantasyon
- 🔧 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Sorun giderme
- 📝 [CHANGELOG.md](CHANGELOG.md) - Versiyon geçmişi

## 💡 İpucu

Web uygulaması açık kaldığı sürece veriler toplanır. Uzun süreli izleme için:
- Bilgisayarı uyku moduna almayın
- Tarayıcı sekmesini aktif tutun
- Grafik çok dolduğunda temizleyin

---

**Başarılar! 🎉**

Sorularınız için debug log ve tarayıcı konsolunu kontrol edin.

