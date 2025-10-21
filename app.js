// Main Application Logic
// Web Bluetooth API integration for Micro:bit communication

class MicrobitTemperatureMonitor {
    constructor() {
        this.device = null;
        this.server = null;
        this.uartService = null;
        this.rxCharacteristic = null;
        this.txCharacteristic = null;
        this.isConnected = false;
        
        // UART service UUID for Micro:bit
        this.UART_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
        this.UART_RX_CHARACTERISTIC_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
        this.UART_TX_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
        
        // Statistics
        this.temperatures = [];
        this.minTemp = null;
        this.maxTemp = null;
        this.avgTemp = null;
        
        // Initialize chart
        this.chart = new TemperatureChart('tempChart');
        
        // Bind UI elements
        this.initUI();
        
        // Load changelog
        this.loadChangelog();
        
        this.log('Uygulama başlatıldı', 'info');
        this.log('Web Bluetooth API desteği: ' + (navigator.bluetooth ? 'Var' : 'Yok'), 'info');
    }
    
    initUI() {
        // Buttons
        this.connectBtn = document.getElementById('connectBtn');
        this.disconnectBtn = document.getElementById('disconnectBtn');
        this.clearChartBtn = document.getElementById('clearChartBtn');
        this.clearLogBtn = document.getElementById('clearLogBtn');
        
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
    }
    
    async connect() {
        try {
            if (!navigator.bluetooth) {
                throw new Error('Web Bluetooth API desteklenmiyor. Lütfen Chrome veya Edge tarayıcısı kullanın.');
            }
            
            this.log('Micro:bit aranıyor...', 'info');
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
                this.handleData(event.target.value);
            });
            
            this.log('Bildirimler başlatıldı', 'success');
            
            // Get RX characteristic (web -> micro:bit)
            this.rxCharacteristic = await this.uartService.getCharacteristic(this.UART_RX_CHARACTERISTIC_UUID);
            
            this.isConnected = true;
            this.updateStatus('Bağlı', true);
            this.connectBtn.disabled = true;
            this.disconnectBtn.disabled = false;
            
            this.log('Micro:bit bağlantısı başarılı!', 'success');
            
            // Handle disconnection
            this.device.addEventListener('gattserverdisconnected', () => {
                this.onDisconnected();
            });
            
        } catch (error) {
            this.log('Bağlantı hatası: ' + error.message, 'error');
            console.error('Connection error:', error);
            this.updateStatus('Bağlantı Hatası', false);
        }
    }
    
    async disconnect() {
        try {
            if (this.device && this.device.gatt.connected) {
                await this.device.gatt.disconnect();
                this.log('Bağlantı kesildi', 'info');
            }
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
        
        this.updateStatus('Bağlantı Kesildi', false);
        this.connectBtn.disabled = false;
        this.disconnectBtn.disabled = true;
        
        this.log('Micro:bit bağlantısı kesildi', 'warning');
    }
    
    handleData(value) {
        try {
            // Convert DataView to string
            const decoder = new TextDecoder();
            const message = decoder.decode(value).trim();
            
            this.log('Alınan veri: ' + message, 'info');
            
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
    
    updateTemperature(temp, timestamp) {
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
        
        // Update chart
        this.chart.addDataPoint(temp, timestamp);
        
        this.log('Sıcaklık güncellendi: ' + temp.toFixed(1) + '°C', 'success');
    }
    
    clearChart() {
        this.chart.clear();
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

