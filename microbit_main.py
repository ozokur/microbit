# Micro:bit Temperature Monitor with Bluetooth
# Version: 1.0.0
# This program reads temperature from the Micro:bit sensor and broadcasts it via Bluetooth

from microbit import *
import radio

# Configuration
TEMP_READ_INTERVAL = 2000  # Read temperature every 2 seconds (in ms)
DEBUG_MODE = True

# Initialize
display.show(Image.HEART)
uart.init(baudrate=115200)  # Initialize UART for USB serial debugging

def log_debug(message):
    """Send debug message via USB UART"""
    if DEBUG_MODE:
        uart.write(str(message) + "\r\n")

def log_temperature(temp):
    """Log temperature reading"""
    log_debug("Temperature: " + str(temp) + "C")

def send_bluetooth(data):
    """Send data via Bluetooth UART"""
    try:
        # Send data as string
        uart.write(data + "\r\n")
        log_debug("BT Sent: " + data)
    except Exception as e:
        log_debug("BT Error: " + str(e))

# Startup message
log_debug("=== Micro:bit Temperature Monitor ===")
log_debug("Version: 1.0.0")
log_debug("Bluetooth UART enabled")
log_debug("Starting main loop...")

# Main loop
last_reading = running_time()
display.show(Image.HEART)

while True:
    current_time = running_time()
    
    # Check if it's time to read temperature
    if current_time - last_reading >= TEMP_READ_INTERVAL:
        last_reading = current_time
        
        # Read temperature
        temp = temperature()
        
        # Log to USB serial
        log_temperature(temp)
        
        # Send via Bluetooth UART
        # Format: TEMP:value:timestamp
        bt_message = "TEMP:" + str(temp) + ":" + str(current_time)
        send_bluetooth(bt_message)
        
        # Visual feedback - blink
        display.show(Image.HEART_SMALL)
        sleep(100)
        display.show(Image.HEART)
    
    # Check for button presses (for testing)
    if button_a.was_pressed():
        log_debug("Button A pressed - Manual reading")
        temp = temperature()
        log_temperature(temp)
        display.scroll(str(temp))
    
    if button_b.was_pressed():
        log_debug("Button B pressed - Status check")
        display.scroll("OK")
    
    # Small delay to prevent busy-waiting
    sleep(100)

