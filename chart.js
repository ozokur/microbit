// Chart.js - Real-time temperature chart visualization
class TemperatureChart {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.dataPoints = [];
        this.maxDataPoints = 60; // Show last 60 readings
        this.padding = { top: 40, right: 40, bottom: 60, left: 60 };
        
        // Chart colors
        this.colors = {
            line: '#4a90e2',
            fill: 'rgba(74, 144, 226, 0.1)',
            grid: '#e0e6ed',
            text: '#2c3e50',
            axis: '#6c757d'
        };
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.draw();
    }
    
    addDataPoint(temperature, timestamp) {
        this.dataPoints.push({
            temp: temperature,
            time: timestamp,
            displayTime: new Date().toLocaleTimeString('tr-TR')
        });
        
        // Keep only the last N data points
        if (this.dataPoints.length > this.maxDataPoints) {
            this.dataPoints.shift();
        }
        
        this.draw();
    }
    
    clear() {
        this.dataPoints = [];
        this.draw();
    }
    
    draw() {
        const { ctx, canvas, padding, dataPoints } = this;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (dataPoints.length === 0) {
            this.drawEmptyState();
            return;
        }
        
        // Calculate drawing area
        const chartWidth = canvas.width - padding.left - padding.right;
        const chartHeight = canvas.height - padding.top - padding.bottom;
        
        // Find min and max temperature for scaling
        const temps = dataPoints.map(d => d.temp);
        const minTemp = Math.floor(Math.min(...temps) - 1);
        const maxTemp = Math.ceil(Math.max(...temps) + 1);
        const tempRange = maxTemp - minTemp || 1;
        
        // Draw grid and axes
        this.drawGrid(chartWidth, chartHeight, minTemp, maxTemp);
        
        // Draw temperature line
        this.drawLine(chartWidth, chartHeight, minTemp, tempRange);
        
        // Draw data points
        this.drawPoints(chartWidth, chartHeight, minTemp, tempRange);
        
        // Draw axes labels
        this.drawLabels(chartWidth, chartHeight, minTemp, maxTemp);
    }
    
    drawEmptyState() {
        const { ctx, canvas } = this;
        ctx.fillStyle = '#6c757d';
        ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Veri bekleniyor...', canvas.width / 2, canvas.height / 2);
    }
    
    drawGrid(chartWidth, chartHeight, minTemp, maxTemp) {
        const { ctx, padding, colors } = this;
        
        ctx.strokeStyle = colors.grid;
        ctx.lineWidth = 1;
        
        // Horizontal grid lines (temperature)
        const tempSteps = 5;
        for (let i = 0; i <= tempSteps; i++) {
            const y = padding.top + (chartHeight * i / tempSteps);
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(padding.left + chartWidth, y);
            ctx.stroke();
        }
        
        // Vertical grid lines (time)
        const timeSteps = 6;
        for (let i = 0; i <= timeSteps; i++) {
            const x = padding.left + (chartWidth * i / timeSteps);
            ctx.beginPath();
            ctx.moveTo(x, padding.top);
            ctx.lineTo(x, padding.top + chartHeight);
            ctx.stroke();
        }
        
        // Draw axes
        ctx.strokeStyle = colors.axis;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top);
        ctx.lineTo(padding.left, padding.top + chartHeight);
        ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
        ctx.stroke();
    }
    
    drawLine(chartWidth, chartHeight, minTemp, tempRange) {
        const { ctx, padding, colors, dataPoints } = this;
        
        if (dataPoints.length < 2) return;
        
        // Draw gradient fill
        const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
        gradient.addColorStop(0, colors.fill);
        gradient.addColorStop(1, 'rgba(74, 144, 226, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        
        dataPoints.forEach((point, index) => {
            const x = padding.left + (chartWidth * index / (dataPoints.length - 1));
            const y = padding.top + chartHeight - ((point.temp - minTemp) / tempRange * chartHeight);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
        ctx.lineTo(padding.left, padding.top + chartHeight);
        ctx.closePath();
        ctx.fill();
        
        // Draw line
        ctx.strokeStyle = colors.line;
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        dataPoints.forEach((point, index) => {
            const x = padding.left + (chartWidth * index / (dataPoints.length - 1));
            const y = padding.top + chartHeight - ((point.temp - minTemp) / tempRange * chartHeight);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
    }
    
    drawPoints(chartWidth, chartHeight, minTemp, tempRange) {
        const { ctx, padding, colors, dataPoints } = this;
        
        dataPoints.forEach((point, index) => {
            const x = padding.left + (chartWidth * index / (dataPoints.length - 1));
            const y = padding.top + chartHeight - ((point.temp - minTemp) / tempRange * chartHeight);
            
            // Draw point
            ctx.fillStyle = colors.line;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw white border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }
    
    drawLabels(chartWidth, chartHeight, minTemp, maxTemp) {
        const { ctx, padding, colors, dataPoints } = this;
        
        ctx.fillStyle = colors.text;
        ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
        
        // Y-axis labels (temperature)
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const tempSteps = 5;
        for (let i = 0; i <= tempSteps; i++) {
            const temp = maxTemp - ((maxTemp - minTemp) * i / tempSteps);
            const y = padding.top + (chartHeight * i / tempSteps);
            ctx.fillText(temp.toFixed(1) + '°C', padding.left - 10, y);
        }
        
        // X-axis labels (time)
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const labelInterval = Math.max(1, Math.floor(dataPoints.length / 6));
        dataPoints.forEach((point, index) => {
            if (index % labelInterval === 0 || index === dataPoints.length - 1) {
                const x = padding.left + (chartWidth * index / (dataPoints.length - 1));
                ctx.fillText(point.displayTime, x, padding.top + chartHeight + 10);
            }
        });
        
        // Title
        ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText('Sıcaklık (°C) / Zaman', canvas.width / 2, padding.top - 10);
    }
}

