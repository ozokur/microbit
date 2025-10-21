# Changelog

Micro:bit Sıcaklık İzleme Sistemi için tüm önemli değişiklikler bu dosyada belgelenmiştir.

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

