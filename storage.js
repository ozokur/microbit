// LocalStorage Manager for Temperature Data
// Stores up to 1 month of temperature readings

class TemperatureStorage {
    constructor() {
        this.storageKey = 'microbit_temperature_data';
        this.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    }
    
    /**
     * Save a temperature reading
     * @param {number} temp - Temperature value
     * @param {number} timestamp - Unix timestamp
     */
    saveReading(temp, timestamp) {
        try {
            const data = this.getAllReadings();
            
            data.push({
                temp: temp,
                timestamp: timestamp,
                date: new Date(timestamp).toISOString()
            });
            
            // Clean old data (older than 30 days)
            this.cleanOldData(data);
            
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            
            return true;
        } catch (error) {
            console.error('Storage save error:', error);
            // Handle quota exceeded
            if (error.name === 'QuotaExceededError') {
                this.cleanOldData(this.getAllReadings(), true); // More aggressive cleaning
                try {
                    localStorage.setItem(this.storageKey, JSON.stringify([{
                        temp: temp,
                        timestamp: timestamp,
                        date: new Date(timestamp).toISOString()
                    }]));
                } catch (e) {
                    console.error('Failed to save even after cleanup:', e);
                }
            }
            return false;
        }
    }
    
    /**
     * Get all temperature readings
     * @returns {Array} Array of temperature readings
     */
    getAllReadings() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Storage read error:', error);
            return [];
        }
    }
    
    /**
     * Get readings within a date range
     * @param {Date} startDate
     * @param {Date} endDate
     * @returns {Array}
     */
    getReadingsByDateRange(startDate, endDate) {
        const all = this.getAllReadings();
        const startTime = startDate.getTime();
        const endTime = endDate.getTime();
        
        return all.filter(reading => {
            return reading.timestamp >= startTime && reading.timestamp <= endTime;
        });
    }
    
    /**
     * Get readings for last N hours
     * @param {number} hours
     * @returns {Array}
     */
    getLastNHours(hours) {
        const now = Date.now();
        const cutoff = now - (hours * 60 * 60 * 1000);
        
        return this.getAllReadings().filter(reading => {
            return reading.timestamp >= cutoff;
        });
    }
    
    /**
     * Clean data older than maxAge
     * @param {Array} data
     * @param {boolean} aggressive - If true, keep only last 7 days
     */
    cleanOldData(data, aggressive = false) {
        const now = Date.now();
        const cutoff = aggressive 
            ? now - (7 * 24 * 60 * 60 * 1000)  // 7 days
            : now - this.maxAge;                // 30 days
        
        const filtered = data.filter(reading => {
            return reading.timestamp >= cutoff;
        });
        
        // Update storage with filtered data
        if (filtered.length < data.length) {
            localStorage.setItem(this.storageKey, JSON.stringify(filtered));
            console.log(`Cleaned ${data.length - filtered.length} old records`);
        }
    }
    
    /**
     * Clear all data
     */
    clearAll() {
        localStorage.removeItem(this.storageKey);
        console.log('All temperature data cleared');
    }
    
    /**
     * Export data as CSV
     * @returns {string} CSV formatted string
     */
    exportToCSV() {
        const data = this.getAllReadings();
        
        if (data.length === 0) {
            return 'No data to export';
        }
        
        // CSV Header
        let csv = 'Tarih,Saat,Sıcaklık (°C),Timestamp\n';
        
        // CSV Rows
        data.forEach(reading => {
            const date = new Date(reading.timestamp);
            const dateStr = date.toLocaleDateString('tr-TR');
            const timeStr = date.toLocaleTimeString('tr-TR');
            csv += `${dateStr},${timeStr},${reading.temp},${reading.timestamp}\n`;
        });
        
        return csv;
    }
    
    /**
     * Get storage statistics
     * @returns {Object}
     */
    getStats() {
        const data = this.getAllReadings();
        
        if (data.length === 0) {
            return {
                total: 0,
                oldest: null,
                newest: null,
                sizeKB: 0
            };
        }
        
        const oldest = new Date(Math.min(...data.map(r => r.timestamp)));
        const newest = new Date(Math.max(...data.map(r => r.timestamp)));
        
        // Calculate storage size
        const jsonStr = localStorage.getItem(this.storageKey) || '';
        const sizeKB = (new Blob([jsonStr]).size / 1024).toFixed(2);
        
        return {
            total: data.length,
            oldest: oldest,
            newest: newest,
            sizeKB: parseFloat(sizeKB)
        };
    }
}

