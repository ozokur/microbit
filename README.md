# 🌡️ Micro:bit Sıcaklık İzleme Sistemi

Micro:bit'in dahili sıcaklık sensöründen gerçek zamanlı veri okuyup, Bluetooth üzerinden bilgisayara ileten ve web tarayıcısında görselleştiren kapsamlı bir izleme sistemi.

## ✨ Özellikler

- 📊 **Gerçek Zamanlı Grafik**: Canvas tabanlı, otomatik ölçeklendirilmiş sıcaklık trendi
- 🔌 **İki Bağlantı Seçeneği**: 
  - **USB Serial**: Hızlı, stabil, kablolu bağlantı (Web Serial API)
  - **Bluetooth**: Kablosuz bağlantı (Web Bluetooth API)
- 📈 **İstatistikler**: Minimum, maksimum ve ortalama değer takibi
- 🐛 **Debug Modu**: Detaylı log sistemi ve hata ayıklama özellikleri
- 📱 **Responsive Tasarım**: Mobil ve masaüstü uyumlu modern arayüz
- 🔄 **Otomatik Veri Toplama**: Her 2 saniyede bir sıcaklık ölçümü
- 💾 **Changelog**: Versiyon geçmişi ve değişiklik takibi

## 🎯 Gereksinimler

### Donanım
- BBC Micro:bit (v1 veya v2)
- USB kablosu (Micro:bit'i bilgisayara bağlamak için)
- Bluetooth özellikli bilgisayar

### Yazılım
- Modern web tarayıcısı (Chrome 56+, Edge 79+, Opera 43+)
- Python 3.x (Micro:bit programını yüklemek için)
- `uflash` veya `microfs` (MicroPython dosyalarını yüklemek için)

## 📦 Kurulum

### 1. Depoyu Klonlayın

```bash
git clone <repo-url>
cd microbit
```

### 2. Python Araçlarını Kurun

```bash
pip install uflash microfs
```

### 3. Micro:bit'e Program Yükleyin

#### Yöntem 1: uflash ile (Önerilen)

```bash
uflash microbit_main.py
```

#### Yöntem 2: Manuel Kopyalama

1. Micro:bit'i bilgisayarınıza USB ile bağlayın
2. `microbit_main.py` dosyasını kopyalayın
3. Micro:bit sürücüsüne `main.py` olarak yapıştırın
4. Micro:bit otomatik olarak yeniden başlayacaktır

### 4. Micro:bit'i Bluetooth Moduna Alın

Micro:bit ekranında kalp ikonu görmelisiniz. Bu, programın çalıştığını gösterir.

**Bluetooth eşleştirme için:**
- Micro:bit'te A+B butonlarına birlikte basılı tutun
- Reset butonuna basın
- Eşleştirme moduna girecektir

## 🚀 Kullanım

### Web Uygulamasını Başlatın

#### 🖱️ Çift Tıklama ile (Kolay Yöntem)

**macOS:**
- `START_SERVER.command` dosyasına çift tıklayın 🚀
- Sunucu otomatik başlar ve tarayıcı açılır!
- Durdurmak için: `STOP_SERVER.command` çift tıklayın 🛑

**Windows:**
- `START_SERVER.bat` dosyasına çift tıklayın 🚀
- Sunucu otomatik başlar ve tarayıcı açılır!
- Durdurmak için: `STOP_SERVER.bat` çift tıklayın 🛑

#### 💻 Terminal ile (Alternatif)

```bash
# Başlatma
./start.sh

# Durdurma
./stop.sh

# veya Python ile manuel
python3 -m http.server 8000
```

Tarayıcınızda açın: `http://localhost:8000`

### Micro:bit'e Bağlanın

1. Web uygulamasında **"Micro:bit'e Bağlan"** butonuna tıklayın
2. Açılan pencereden Micro:bit cihazınızı seçin (BBC micro:bit XXXXX şeklinde görünür)
3. **"Eşleştir"** butonuna tıklayın
4. Bağlantı kurulduktan sonra sıcaklık verileri otomatik olarak gelmeye başlayacaktır

### Arayüz Kullanımı

- **Bağlan/Bağlantıyı Kes**: Micro:bit ile bağlantıyı yönetin
- **Grafiği Temizle**: Mevcut grafik verilerini sıfırlayın
- **Debug Log**: Sistem olaylarını ve hataları görüntüleyin
- **Changelog**: Versiyon geçmişini inceleyin

### Micro:bit Butonları

- **Buton A**: Manuel sıcaklık ölçümü ve ekranda gösterme
- **Buton B**: Bluetooth pairing yardımı (ekranda "BT" + talimatlar)

## 🔧 Teknik Detaylar

### Micro:bit Programı

- **Dil**: MicroPython
- **Özellikler**:
  - Dahili sıcaklık sensörü okuma
  - Bluetooth UART servisi üzerinden veri yayını
  - USB UART üzerinden debug logları
  - LED göstergeleri (kalp = çalışıyor, küçük kalp = veri gönderiyor)
  - 2 saniyede bir otomatik ölçüm

### Web Uygulaması

- **Teknolojiler**: Vanilla JavaScript, HTML5, CSS3
- **API**: Web Bluetooth API
- **Grafik**: Canvas 2D API
- **Tasarım**: CSS Grid, Flexbox, Responsive

### Veri Formatı

Micro:bit'ten gelen veri formatı:
```
TEMP:<sıcaklık>:<timestamp>
Örnek: TEMP:22.5:123456
```

### Bluetooth Servisleri

- **UART Service UUID**: `6e400001-b5a3-f393-e0a9-e50e24dcca9e`
- **TX Characteristic**: `6e400003-b5a3-f393-e0a9-e50e24dcca9e` (Micro:bit → Web)
- **RX Characteristic**: `6e400002-b5a3-f393-e0a9-e50e24dcca9e` (Web → Micro:bit)

## 🐛 Hata Ayıklama

### Bluetooth Bağlantısı Kurulamıyor

1. Tarayıcınızın Web Bluetooth API'yi desteklediğinden emin olun (Chrome/Edge önerilir)
2. HTTPS veya localhost üzerinden eriştiğinizden emin olun
3. Bluetooth'un bilgisayarınızda aktif olduğunu kontrol edin
4. Micro:bit'in eşleştirme modunda olduğundan emin olun

### Veri Gelmiyor

1. Debug log panelini kontrol edin
2. Micro:bit'in ekranında kalp ikonu gözüküyor mu?
3. USB üzerinden seri port loglarını kontrol edin:
   ```bash
   # macOS/Linux
   screen /dev/tty.usbmodem* 115200
   
   # Windows (PowerShell)
   # COM port numarasını Aygıt Yöneticisi'nden bulun
   ```

### Micro:bit Sıfırlama

Micro:bit'in arkasındaki reset butonuna basın ve programın yeniden başlamasını bekleyin.

## 📊 Tarayıcı Desteği

| Tarayıcı | Destek | Notlar |
|----------|--------|--------|
| Chrome   | ✅ 56+ | Tam destek |
| Edge     | ✅ 79+ | Tam destek |
| Opera    | ✅ 43+ | Tam destek |
| Firefox  | ❌     | Web Bluetooth desteklemiyor |
| Safari   | ❌     | Web Bluetooth desteklemiyor |

## 📝 Değişiklik Geçmişi

Detaylı değişiklik geçmişi için [CHANGELOG.md](CHANGELOG.md) dosyasına bakın.

## 🔮 Gelecek Özellikler

- [ ] Veri dışa aktarma (CSV, JSON)
- [ ] Sıcaklık alarm sistemi
- [ ] Grafik üzerinde yakınlaştırma
- [ ] LocalStorage ile veri saklama
- [ ] Çoklu Micro:bit desteği
- [ ] Diğer sensörler (ivmeölçer, pusula)
- [ ] Koyu tema desteği

## 🤝 Katkıda Bulunma

Bu proje eğitim amaçlı geliştirilmiştir. Önerilerinizi ve geri bildirimlerinizi bekliyoruz!

## 📄 Lisans

Bu proje eğitim amaçlı oluşturulmuştur ve özgürce kullanılabilir.

## 🆘 Destek

Sorun yaşıyorsanız:
1. Debug log panelini kontrol edin
2. Tarayıcı konsolunu açın (F12)
3. USB seri port loglarını kontrol edin
4. Micro:bit'i resetleyin ve tekrar deneyin

## 📚 Kaynaklar

- [Micro:bit MicroPython Dokümantasyonu](https://microbit-micropython.readthedocs.io/)
- [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
- [Micro:bit Bluetooth Profile](https://lancaster-university.github.io/microbit-docs/ble/profile/)

---

**Geliştirici Notu**: Bu sistem Micro:bit'in dahili sıcaklık sensörünü kullanır. Bu sensör yongadan gelen ısıyı ölçtüğü için ortam sıcaklığından birkaç derece daha yüksek okuma yapabilir. Hassas ölçümler için harici bir sıcaklık sensörü kullanılması önerilir.
