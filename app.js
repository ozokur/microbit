// Main Application Logic
// Web Bluetooth API + Web Serial API integration for Micro:bit communication

class MicrobitTemperatureMonitor {
    constructor() {
        // Connection state
        this.connectionType = 'usb'; // 'usb' or 'bluetooth'
        this.isConnected = false;
        
        // Bluetooth variables
        this.device = null;
        this.server = null;
        this.uartService = null;
        this.rxCharacteristic = null;
        this.txCharacteristic = null;
        
        // USB Serial variables
        this.port = null;
        this.reader = null;
        this.readableStreamClosed = null;
        
        // UART service UUID for Micro:bit (Bluetooth)
        this.UART_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
        this.UART_RX_CHARACTERISTIC_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
        this.UART_TX_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
        
        // Statistics
        this.temperatures = [];
        this.minTemp = null;
        this.maxTemp = null;
        this.avgTemp = null;
        
        // Chart will be initialized lazily
        this.chart = null;
        this.chartInitialized = false;
        
        // Storage for persistent data
        this.storage = new TemperatureStorage();
        
        // Date filter state
        this.dateFilter = {
            start: null,
            end: null,
            active: false
        };
        
        // Bind UI elements
        this.initUI();
        
        // Load stored data on startup
        this.loadStoredData();
        
        // Load changelog
        this.loadChangelog();
        
        this.log('Uygulama başlatıldı', 'info');
        this.log('Web Bluetooth API: ' + (navigator.bluetooth ? '✅' : '❌'), 'info');
        this.log('Web Serial API: ' + ('serial' in navigator ? '✅' : '❌'), 'info');
    }
    
    initUI() {
        // Buttons
        this.connectBtn = document.getElementById('connectBtn');
        this.disconnectBtn = document.getElementById('disconnectBtn');
        this.clearChartBtn = document.getElementById('clearChartBtn');
        this.clearLogBtn = document.getElementById('clearLogBtn');
        
        // Connection type radio buttons
        this.connectionTypeRadios = document.querySelectorAll('input[name="connectionType"]');
        
        // Status elements
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusText = document.getElementById('statusText');
        
        // Temperature display
        this.currentTempEl = document.getElementById('currentTemp');
        this.minTempEl = document.getElementById('minTemp');
        this.maxTempEl = document.getElementById('maxTemp');
        this.avgTempEl = document.getElementById('avgTemp');
        
        // Debug log
        this.debugLog = document.getElementById('debugLog');
        
        // Date filter elements
        this.startDateInput = document.getElementById('startDate');
        this.endDateInput = document.getElementById('endDate');
        this.filterBtn = document.getElementById('filterBtn');
        this.resetFilterBtn = document.getElementById('resetFilterBtn');
        this.exportDataBtn = document.getElementById('exportDataBtn');
        
        // Quick filter buttons
        this.quickFilterBtns = document.querySelectorAll('.quick-filter-btn');
        
        // Stats elements
        this.totalRecordsEl = document.getElementById('totalRecords');
        this.storedRecordsEl = document.getElementById('storedRecords');
        this.oldestRecordEl = document.getElementById('oldestRecord');
        
        // Event listeners
        this.connectBtn.addEventListener('click', () => this.connect());
        this.disconnectBtn.addEventListener('click', () => this.disconnect());
        this.clearChartBtn.addEventListener('click', () => this.clearChart());
        this.clearLogBtn.addEventListener('click', () => this.clearLog());
        
        // Date filter listeners
        this.filterBtn.addEventListener('click', () => this.applyDateFilter());
        this.resetFilterBtn.addEventListener('click', () => this.resetDateFilter());
        this.exportDataBtn.addEventListener('click', () => this.exportData());
        
        // Quick filter listeners
        this.quickFilterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hours = parseInt(e.target.dataset.hours);
                this.applyQuickFilter(hours);
                
                // Update active state
                this.quickFilterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
        
        // Initialize chart after DOM is ready
        setTimeout(() => this.initChart(), 100);
        
        // Radio button change
        this.connectionTypeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.connectionType = e.target.value;
                this.log(`Bağlantı tipi değiştirildi: ${this.connectionType === 'usb' ? 'USB Serial 🔌' : 'Bluetooth 🔵'}`, 'info');
            });
        });
    }
    
    initChart() {
        if (this.chartInitialized) return;
        
        try {
            if (typeof TemperatureChart === 'undefined') {
                console.warn('TemperatureChart class not loaded yet, retrying...');
                setTimeout(() => this.initChart(), 200);
                return;
            }
            
            this.chart = new TemperatureChart('tempChart');
            this.chartInitialized = true;
            this.log('Grafik başlatıldı', 'success');
            
            // Load stored data after chart is ready
            const stats = this.storage.getStats();
            if (stats.total > 0) {
                this.log(`Saklı veriler bulundu: ${stats.total} kayıt`, 'info');
                // Automatically load last 1 hour
                this.applyQuickFilter(1);
                // Set active button
                const firstBtn = document.querySelector('.quick-filter-btn[data-hours="1"]');
                if (firstBtn) firstBtn.classList.add('active');
            }
        } catch (error) {
            console.error('Chart initialization error:', error);
            this.log('Grafik hatası: ' + error.message, 'error');
            this.chart = null;
        }
    }
    
    async connect() {
        if (this.connectionType === 'usb') {
            await this.connectUSB();
        } else {
            await this.connectBluetooth();
        }
    }
    
    async connectUSB() {
        try {
            if (!('serial' in navigator)) {
                throw new Error('Web Serial API desteklenmiyor. Lütfen Chrome 89+ veya Edge 89+ kullanın.');
            }
            
            this.log('USB Serial bağlantısı kuruluyor...', 'info');
            this.updateStatus('USB Portu Seçiliyor...', false);
            
            // Request serial port
            this.port = await navigator.serial.requestPort({
                filters: [
                    { usbVendorId: 0x0D28 } // BBC micro:bit USB vendor ID
                ]
            });
            
            this.log('USB port seçildi', 'success');
            
            // Open port
            await this.port.open({ baudRate: 115200 });
            this.log('Port açıldı (115200 baud)', 'success');
            
            this.isConnected = true;
            this.updateStatus('USB ile Bağlı 🔌', true);
            this.connectBtn.disabled = true;
            this.disconnectBtn.disabled = false;
            
            // Start reading data
            this.readUSBData();
            
        } catch (error) {
            this.log('USB bağlantı hatası: ' + error.message, 'error');
            console.error('USB connection error:', error);
            this.updateStatus('Bağlantı Hatası', false);
        }
    }
    
    async readUSBData() {
        try {
            const textDecoder = new TextDecoderStream();
            this.readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
            this.reader = textDecoder.readable.getReader();
            
            let buffer = '';
            
            while (true) {
                const { value, done } = await this.reader.read();
                if (done) {
                    this.reader.releaseLock();
                    break;
                }
                
                buffer += value;
                
                // Process complete lines
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Keep incomplete line in buffer
                
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (trimmed) {
                        this.handleUSBData(trimmed);
                    }
                }
            }
        } catch (error) {
            this.log('USB okuma hatası: ' + error.message, 'error');
            console.error('USB read error:', error);
        }
    }
    
    handleUSBData(message) {
        this.log('USB: ' + message, 'info');
        
        try {
            // Parse temperature data: TEMP:value:timestamp
            if (message.startsWith('TEMP:')) {
                const parts = message.split(':');
                if (parts.length >= 2) {
                    const temperature = parseFloat(parts[1]);
                    const timestamp = parts.length >= 3 ? parseInt(parts[2]) : Date.now();
                    
                    if (!isNaN(temperature)) {
                        this.updateTemperature(temperature, timestamp);
                    }
                }
            }
        } catch (error) {
            this.log('Veri işleme hatası: ' + error.message, 'error');
            console.error('USB data handling error:', error);
        }
    }
    
    async connectBluetooth() {
        try {
            if (!navigator.bluetooth) {
                throw new Error('Web Bluetooth API desteklenmiyor. Lütfen Chrome veya Edge tarayıcısı kullanın.');
            }
            
            this.log('Micro:bit aranıyor (Bluetooth)...', 'info');
            this.updateStatus('Aranıyor...', false);
            
            // Request Bluetooth device
            this.device = await navigator.bluetooth.requestDevice({
                filters: [{ namePrefix: 'BBC micro:bit' }],
                optionalServices: [this.UART_SERVICE_UUID]
            });
            
            this.log('Cihaz bulundu: ' + this.device.name, 'success');
            
            // Connect to GATT server
            this.log('GATT sunucusuna bağlanıyor...', 'info');
            this.server = await this.device.gatt.connect();
            this.log('GATT sunucusuna bağlandı', 'success');
            
            // Get UART service
            this.log('UART servisi alınıyor...', 'info');
            this.uartService = await this.server.getPrimaryService(this.UART_SERVICE_UUID);
            this.log('UART servisi alındı', 'success');
            
            // Get TX characteristic (micro:bit -> web)
            this.log('TX karakteristiği alınıyor...', 'info');
            this.txCharacteristic = await this.uartService.getCharacteristic(this.UART_TX_CHARACTERISTIC_UUID);
            
            // Start notifications
            await this.txCharacteristic.startNotifications();
            this.txCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
                this.handleBluetoothData(event.target.value);
            });
            
            this.log('Bildirimler başlatıldı', 'success');
            
            // Get RX characteristic (web -> micro:bit)
            this.rxCharacteristic = await this.uartService.getCharacteristic(this.UART_RX_CHARACTERISTIC_UUID);
            
            this.isConnected = true;
            this.updateStatus('Bluetooth ile Bağlı 🔵', true);
            this.connectBtn.disabled = true;
            this.disconnectBtn.disabled = false;
            
            this.log('Micro:bit bağlantısı başarılı!', 'success');
            
            // Handle disconnection
            this.device.addEventListener('gattserverdisconnected', () => {
                this.onDisconnected();
            });
            
        } catch (error) {
            this.log('Bluetooth bağlantı hatası: ' + error.message, 'error');
            console.error('Bluetooth connection error:', error);
            this.updateStatus('Bağlantı Hatası', false);
        }
    }
    
    handleBluetoothData(value) {
        try {
            // Convert DataView to string
            const decoder = new TextDecoder();
            const message = decoder.decode(value).trim();
            
            this.log('Bluetooth: ' + message, 'info');
            
            // Parse message format: TEMP:value:timestamp
            if (message.startsWith('TEMP:')) {
                const parts = message.split(':');
                if (parts.length >= 2) {
                    const temperature = parseFloat(parts[1]);
                    const timestamp = parts.length >= 3 ? parseInt(parts[2]) : Date.now();
                    
                    if (!isNaN(temperature)) {
                        this.updateTemperature(temperature, timestamp);
                    }
                }
            }
        } catch (error) {
            this.log('Veri işleme hatası: ' + error.message, 'error');
            console.error('Data handling error:', error);
        }
    }
    
    async disconnect() {
        try {
            if (this.connectionType === 'usb' && this.port) {
                // Close USB port
                if (this.reader) {
                    await this.reader.cancel();
                    await this.readableStreamClosed.catch(() => {});
                }
                await this.port.close();
                this.port = null;
                this.reader = null;
                this.log('USB bağlantısı kesildi', 'info');
            } else if (this.connectionType === 'bluetooth' && this.device && this.device.gatt.connected) {
                await this.device.gatt.disconnect();
                this.log('Bluetooth bağlantısı kesildi', 'info');
            }
            
            this.onDisconnected();
        } catch (error) {
            this.log('Bağlantı kesme hatası: ' + error.message, 'error');
        }
    }
    
    onDisconnected() {
        this.isConnected = false;
        this.device = null;
        this.server = null;
        this.uartService = null;
        this.rxCharacteristic = null;
        this.txCharacteristic = null;
        this.port = null;
        this.reader = null;
        
        this.updateStatus('Bağlantı Kesildi', false);
        this.connectBtn.disabled = false;
        this.disconnectBtn.disabled = true;
        
        this.log('Bağlantı kesildi', 'warning');
    }
    
    updateTemperature(temp, timestamp) {
        try {
            // Update current temperature display
            this.currentTempEl.textContent = temp.toFixed(1);
            
            // Add to statistics
            this.temperatures.push(temp);
            
            // Update min/max/avg
            if (this.minTemp === null || temp < this.minTemp) {
                this.minTemp = temp;
                this.minTempEl.textContent = temp.toFixed(1);
            }
            
            if (this.maxTemp === null || temp > this.maxTemp) {
                this.maxTemp = temp;
                this.maxTempEl.textContent = temp.toFixed(1);
            }
            
            const sum = this.temperatures.reduce((a, b) => a + b, 0);
            this.avgTemp = sum / this.temperatures.length;
            this.avgTempEl.textContent = this.avgTemp.toFixed(1);
            
            // Initialize chart on first data point (lazy initialization)
            if (!this.chartInitialized) {
                this.initChart();
            }
            
            // Update chart (only if initialized)
            if (this.chart && this.chartInitialized) {
                try {
                    this.chart.addDataPoint(temp, timestamp);
                } catch (chartError) {
                    console.warn('Chart update error:', chartError);
                    // Chart'ta hata olsa bile devam et
                }
            }
            
            this.log('Sıcaklık güncellendi: ' + temp.toFixed(1) + '°C', 'success');
            
            // Save to persistent storage
            this.storage.saveReading(temp, timestamp);
            this.updateStats();
            
        } catch (error) {
            this.log('Sıcaklık güncelleme hatası: ' + error.message, 'error');
            console.error('Temperature update error:', error);
        }
    }
    
    loadStoredData() {
        try {
            const stats = this.storage.getStats();
            
            if (stats.total > 0) {
                this.log(`Saklanan veriler: ${stats.total} kayıt`, 'info');
                this.log(`En eski kayıt: ${stats.oldest.toLocaleString('tr-TR')}`, 'info');
            } else {
                this.log('Henüz saklı veri yok', 'info');
            }
            
            this.updateStats();
            
            // Note: Actual data loading happens in initChart() after chart is ready
        } catch (error) {
            console.error('Load stored data error:', error);
        }
    }
    
    updateStats() {
        const stats = this.storage.getStats();
        
        this.totalRecordsEl.textContent = this.temperatures.length;
        this.storedRecordsEl.textContent = stats.total;
        
        if (stats.oldest) {
            this.oldestRecordEl.textContent = stats.oldest.toLocaleDateString('tr-TR');
        } else {
            this.oldestRecordEl.textContent = '--';
        }
    }
    
    applyDateFilter() {
        const start = this.startDateInput.value;
        const end = this.endDateInput.value;
        
        if (!start || !end) {
            alert('Lütfen başlangıç ve bitiş tarihi seçin!');
            return;
        }
        
        const startDate = new Date(start);
        const endDate = new Date(end);
        
        if (startDate > endDate) {
            alert('Başlangıç tarihi bitiş tarihinden önce olmalı!');
            return;
        }
        
        this.dateFilter = {
            start: startDate,
            end: endDate,
            active: true
        };
        
        this.loadFilteredData();
        this.log(`Filtre uygulandı: ${startDate.toLocaleString('tr-TR')} - ${endDate.toLocaleString('tr-TR')}`, 'info');
        
        // Clear active quick filter
        this.quickFilterBtns.forEach(b => b.classList.remove('active'));
    }
    
    resetDateFilter() {
        this.dateFilter = {
            start: null,
            end: null,
            active: false
        };
        
        this.startDateInput.value = '';
        this.endDateInput.value = '';
        
        // Clear active quick filter
        this.quickFilterBtns.forEach(b => b.classList.remove('active'));
        
        // Reload all current session data
        this.log('Filtre sıfırlandı', 'info');
        
        if (this.chart) {
            this.chart.clear();
        }
    }
    
    applyQuickFilter(hours) {
        const data = this.storage.getLastNHours(hours);
        
        if (data.length === 0) {
            const hourText = hours === 1 ? '1 saat' : 
                            hours === 24 ? '24 saat' : 
                            hours === 168 ? '1 hafta' : 
                            hours === 720 ? '1 ay' : `${hours} saat`;
            this.log(`Son ${hourText}te veri bulunamadı`, 'warning');
            return;
        }
        
        const hourText = hours === 1 ? '1 saat' : 
                        hours === 24 ? '24 saat' : 
                        hours === 168 ? '1 hafta' : 
                        hours === 720 ? '1 ay' : `${hours} saat`;
        this.log(`Son ${hourText} yüklendi: ${data.length} kayıt`, 'success');
        
        // Clear current chart
        if (this.chart) {
            this.chart.clear();
        }
        
        // Load filtered data
        this.temperatures = [];
        this.minTemp = null;
        this.maxTemp = null;
        
        data.forEach(reading => {
            this.temperatures.push(reading.temp);
            
            if (this.minTemp === null || reading.temp < this.minTemp) {
                this.minTemp = reading.temp;
            }
            if (this.maxTemp === null || reading.temp > this.maxTemp) {
                this.maxTemp = reading.temp;
            }
            
            if (this.chart) {
                this.chart.addDataPoint(reading.temp, reading.timestamp);
            }
        });
        
        // Update display
        if (this.temperatures.length > 0) {
            const sum = this.temperatures.reduce((a, b) => a + b, 0);
            this.avgTemp = sum / this.temperatures.length;
            
            this.minTempEl.textContent = this.minTemp.toFixed(1);
            this.maxTempEl.textContent = this.maxTemp.toFixed(1);
            this.avgTempEl.textContent = this.avgTemp.toFixed(1);
            this.currentTempEl.textContent = this.temperatures[this.temperatures.length - 1].toFixed(1);
        }
    }
    
    loadFilteredData() {
        if (!this.dateFilter.active) return;
        
        const data = this.storage.getReadingsByDateRange(this.dateFilter.start, this.dateFilter.end);
        
        if (data.length === 0) {
            this.log('Seçilen tarih aralığında veri bulunamadı', 'warning');
            return;
        }
        
        // Clear current chart
        if (this.chart) {
            this.chart.clear();
        }
        
        // Load filtered data
        this.temperatures = [];
        this.minTemp = null;
        this.maxTemp = null;
        
        data.forEach(reading => {
            this.temperatures.push(reading.temp);
            
            if (this.minTemp === null || reading.temp < this.minTemp) {
                this.minTemp = reading.temp;
            }
            if (this.maxTemp === null || reading.temp > this.maxTemp) {
                this.maxTemp = reading.temp;
            }
            
            if (this.chart) {
                this.chart.addDataPoint(reading.temp, reading.timestamp);
            }
        });
        
        // Update display
        if (this.temperatures.length > 0) {
            const sum = this.temperatures.reduce((a, b) => a + b, 0);
            this.avgTemp = sum / this.temperatures.length;
            
            this.minTempEl.textContent = this.minTemp.toFixed(1);
            this.maxTempEl.textContent = this.maxTemp.toFixed(1);
            this.avgTempEl.textContent = this.avgTemp.toFixed(1);
            this.currentTempEl.textContent = this.temperatures[this.temperatures.length - 1].toFixed(1);
        }
        
        this.log(`${data.length} kayıt yüklendi`, 'success');
    }
    
    exportData() {
        const csv = this.storage.exportToCSV();
        
        if (csv === 'No data to export') {
            alert('Dışa aktarılacak veri yok!');
            return;
        }
        
        // Create download link
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        const now = new Date();
        const filename = `microbit_sicaklik_${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}.csv`;
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.log(`Veriler dışa aktarıldı: ${filename}`, 'success');
    }
    
    clearChart() {
        if (this.chart) {
            this.chart.clear();
        }
        this.temperatures = [];
        this.minTemp = null;
        this.maxTemp = null;
        this.avgTemp = null;
        
        this.minTempEl.textContent = '--';
        this.maxTempEl.textContent = '--';
        this.avgTempEl.textContent = '--';
        
        this.log('Grafik temizlendi', 'info');
    }
    
    clearLog() {
        this.debugLog.innerHTML = '';
    }
    
    updateStatus(text, connected) {
        this.statusText.textContent = text;
        const dot = this.statusIndicator.querySelector('.status-dot');
        
        if (connected) {
            dot.classList.remove('disconnected');
            dot.classList.add('connected');
        } else {
            dot.classList.remove('connected');
            dot.classList.add('disconnected');
        }
    }
    
    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString('tr-TR');
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry ' + type;
        logEntry.textContent = `[${timestamp}] ${message}`;
        
        this.debugLog.appendChild(logEntry);
        this.debugLog.scrollTop = this.debugLog.scrollHeight;
        
        // Also log to console
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
    
    async loadChangelog() {
        try {
            const response = await fetch('CHANGELOG.md');
            const text = await response.text();
            
            // Simple markdown to HTML conversion
            const html = text
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/^\- (.*$)/gim, '<li>$1</li>')
                .replace(/\n\n/g, '</ul><p>')
                .replace(/<li>/g, '<ul><li>')
                .replace(/<\/li>\n/g, '</li></ul>\n');
            
            document.getElementById('changelog').innerHTML = html;
        } catch (error) {
            document.getElementById('changelog').innerHTML = '<p>Changelog yüklenemedi.</p>';
            this.log('Changelog yükleme hatası: ' + error.message, 'error');
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MicrobitTemperatureMonitor();
});
