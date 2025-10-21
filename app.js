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
        
        // Bind UI elements
        this.initUI();
        
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
        
        // Event listeners
        this.connectBtn.addEventListener('click', () => this.connect());
        this.disconnectBtn.addEventListener('click', () => this.disconnect());
        this.clearChartBtn.addEventListener('click', () => this.clearChart());
        this.clearLogBtn.addEventListener('click', () => this.clearLog());
        
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
        } catch (error) {
            this.log('Sıcaklık güncelleme hatası: ' + error.message, 'error');
            console.error('Temperature update error:', error);
        }
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
