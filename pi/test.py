import RPi.GPIO as GPIO
import time

RELAY_PIN = 17 

GPIO.setmode(GPIO.BCM)
GPIO.setup(RELAY_PIN, GPIO.OUT)

try:
    print("Relay ON")
    GPIO.output(RELAY_PIN, GPIO.HIGH) 
    time.sleep(5)

    print("Relay OFF")
    GPIO.output(RELAY_PIN, GPIO.LOW)
    time.sleep(5)

finally:
    GPIO.cleanup()
