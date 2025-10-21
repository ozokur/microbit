# Changelog

Micro:bit Sıcaklık İzleme Sistemi için tüm önemli değişiklikler bu dosyada belgelenmiştir.

## [1.3.0] - 2025-10-21

### 🎯 Yeni Özellikler - Veri Saklama ve Filtreleme
- **LocalStorage ile 1 Aylık Veri Saklama** 💾
  - Tüm sıcaklık okumaları otomatik kaydediliyor
  - 30 gün boyunca veri saklanıyor
  - Otomatik veri temizleme (eski veriler siliniyor)
  
- **Tarih/Saat Filtreleme** 📅
  - Başlangıç ve bitiş tarihi seçimi
  - Özel tarih aralığı filtreleme
  - Anlık filtre uygulama
  
- **Hızlı Filtreler** ⚡
  - Son 1 Saat
  - Son 24 Saat  
  - Son 1 Hafta
  - Son 1 Ay
  
- **CSV Export** 📊
  - Tüm veriler CSV formatında indirilebilir
  - Tarih, saat, sıcaklık bilgileri
  - Excel uyumlu format

### Yeni UI Bileşenleri
- Date/time picker input'ları
- Quick filter butonları
- Veri istatistikleri paneli (Toplam Kayıt, Saklanan, En Eski)
- Export butonu

### Teknik Detaylar
- `storage.js` - LocalStorage yönetimi
- Quota exceeded error handling
- Otomatik veri temizleme (30 günden eski)
- Filtrelenmiş veri chart'a yükleme
- CSV export fonksiyonu

### İyileştirmeler
- Uygulama başlarken saklı veriler yükleniyor
- Filtre aktifken yeni veriler kaydediliyor
- Responsive date filter layout
- Veri istatistikleri real-time güncelleniyor

## [1.2.0] - 2025-10-21

### 🎯 Yeni Özellikler
- **İki Bağlantı Tipi Seçeneği:** Artık USB Serial veya Bluetooth seçebilirsiniz!
  - 🔌 **USB Serial**: Hızlı, stabil, kablolu bağlantı (Web Serial API)
  - 🔵 **Bluetooth**: Kablosuz bağlantı (Web Bluetooth API)
- Modern radio button UI ile kolay seçim
- Her iki bağlantı tipi için ayrı veri işleme

### İyileştirmeler
- Web Serial API desteği eklendi
- USB üzerinden direkt veri okuma
- Bluetooth ve USB arasında anlık geçiş
- Daha iyi hata yönetimi
- API desteği kontrolleri (başlangıçta log)

### Teknik Detaylar
- Web Serial API (Chrome 89+)
- 115200 baud rate ile USB iletişimi
- Satır bazlı veri parsing (her iki mod için)
- Otomatik bağlantı tipi algılama

## [1.1.0] - 2025-10-21

### Değişiklikler
- **B Tuşu Güncellemesi:** Artık Bluetooth pairing mode bilgilerini gösteriyor
  - Ekranda "BT" animasyonu
  - USB debug üzerinden pairing talimatları
  - Kullanıcı dostu görsel geri bildirim
- Versiyon 1.0.0 → 1.1.0
- Başlangıç mesajlarına buton açıklamaları eklendi

### İyileştirmeler
- B tuşuna basınca pairing talimatları gösteriliyor
- Debug log'da adım adım bağlantı rehberi
- Daha iyi kullanıcı deneyimi

## [1.0.0] - 2025-10-21

### Eklenenler
- İlk sürüm yayınlandı
- Micro:bit MicroPython programı
  - Dahili sıcaklık sensöründen okuma
  - Bluetooth UART üzerinden veri yayını
  - USB UART üzerinden debug logları
  - LED göstergeleri (kalp ikonu = çalışıyor, küçük kalp = veri gönderiliyor)
  - Buton A: Manuel sıcaklık okuma ve ekranda gösterme
  - Buton B: Durum kontrolü
- Web GUI uygulaması
  - Modern ve responsive tasarım
  - Web Bluetooth API entegrasyonu
  - Gerçek zamanlı sıcaklık grafiği
  - Canvas tabanlı grafik çizimi
  - Otomatik ölçeklendirme
  - İstatistikler (min, max, ortalama)
  - Debug log paneli
  - Changelog görüntüleme
- Detaylı dokümantasyon
  - Kurulum talimatları
  - Kullanım kılavuzu
  - Troubleshooting bölümü

### Teknik Detaylar
- MicroPython 2.0+ uyumluluğu
- Web Bluetooth API kullanımı
- UART servisi üzerinden iletişim
- Vanilla JavaScript (framework yok)
- CSS Grid ve Flexbox layout
- Responsive tasarım (mobil uyumlu)

### Özellikler
- Gerçek zamanlı veri akışı
- 2 saniyede bir otomatik sıcaklık okuma
- Son 60 veri noktası gösterimi
- Grafik temizleme
- Log temizleme
- Otomatik yeniden bağlanma desteği
- Hata yönetimi ve kullanıcı bildirimleri

### Güvenlik
- HTTPS veya localhost gereksinimi (Web Bluetooth API)
- Kullanıcı onayı ile cihaz eşleştirme

### Tarayıcı Desteği
- Chrome 56+
- Edge 79+
- Opera 43+
- Not: Firefox ve Safari şu anda Web Bluetooth desteklemiyor

## Gelecek Sürümler İçin Planlar

### [1.1.0] - Planlanan
- Veri dışa aktarma (CSV, JSON)
- Sıcaklık alarm sistemi (eşik değerleri)
- Grafik üzerinde yakınlaştırma
- Tarihsel veri kaydetme (LocalStorage)
- Çoklu Micro:bit desteği

### [1.2.0] - Planlanan
- Diğer sensörler (ivmeölçer, pusula)
- Grafik tipleri (çubuk, pasta)
- Tema seçenekleri (açık/koyu mod)
- Dil desteği (İngilizce)
- PWA (Progressive Web App) desteği

## Bilinen Sorunlar

- Safari ve Firefox tarayıcılarında Web Bluetooth API desteklenmemektedir
- Bazı Linux dağıtımlarında Bluetooth izinleri gerekebilir
- Windows'ta Bluetooth adaptörü gereklidir

## Katkıda Bulunanlar

- Geliştirici: AI Assistant
- Test: Kullanıcı geri bildirimleri bekleniyor

## Lisans

Bu proje eğitim amaçlı oluşturulmuştur.

