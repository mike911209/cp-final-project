import os
from awscrt import io, mqtt
from awscrt.mqtt import Connection
from awsiot import mqtt_connection_builder
from loguru import logger
import json
from config import Config
import signal
import boto3
import time

# from libcamera import controls
from picamera2 import Picamera2
from ultralytics import YOLO


s3 = boto3.client('s3')

def mqtt_build() -> Connection:
    event_loop_group = io.EventLoopGroup(1)
    host_resolver = io.DefaultHostResolver(event_loop_group)

    # MQTT client setup
    mqtt_connection = mqtt_connection_builder.mtls_from_path(
        endpoint=Config.iot_endpoint,
        cert_filepath=Config.cert_filepath,
        pri_key_filepath=Config.key_filepath,
        client_bootstrap=io.ClientBootstrap(event_loop_group, host_resolver),
        ca_filepath=Config.ca_filepath,
        client_id=Config.iot_client_id,
        clean_session=True,
        keep_alive_secs=30
    )

    # Connect
    logger.info("Connecting...")
    mqtt_connection.connect().result()
    logger.success("Connected!")

    return mqtt_connection

def alarm(topic, payload, **kwargs):
    logger.info(f"Alarm received on topic {topic}: {payload}")
    
    # Parse the payload

    data = json.loads(payload)
    user_id = data.get("user_id")
    event_id = data.get("event_id")
    spray_flag = data.get("spray_flag")
    user_prompt = data.get("user_prompt")
    receivers = data.get("receivers")
    alarm_repeat_times = data.get("alarm_repeat_times", Config.alarm_repeat_times)
    alarm_interval = data.get("alarm_interval", Config.alarm_interval)
    logger.debug(f"User ID: {user_id}, Event ID: {event_id}, Spray Flag: {spray_flag}, alarm_interval: {alarm_interval}, alarm_repeat_times: {alarm_repeat_times}, User Prompt: {user_prompt}, Receivers: {receivers}")

    # play audio
    count = alarm_repeat_times
    while count > 0:
        count -= 1
        logger.info(f"Playing alarm sound {Config.alarm_sound} ({count + 1}/{alarm_repeat_times})")
        
        # Play the sound
        os.system(f"aplay {Config.alarm_sound}")

        time.sleep(alarm_interval * 60)

    logger.info("Alarm sound finished playing.")

    return


def subscribe(mqtt_connection: Connection):
    mqtt_connection.subscribe(
        topic=f"{Config.iot_client_id}/alarm",
        qos=mqtt.QoS.AT_LEAST_ONCE,
        callback=alarm
    )
    
class Detector:
    def __init__(self, model="pi/yolo11s.pt"):
        self.picam2 = Picamera2()
        self.picam2.preview_configuration.main.size = (640, 480)
        self.picam2.preview_configuration.main.format = "RGB888"
        self.picam2.configure("preview")
        self.picam2.start()

        self.model = YOLO(model)
        # 11n: 1.2s
        # 11s: 3.5s
        # 11n_ncnn: 0.5s
        # 11s_ncnn: 1.2s
    
    def __call__(self):
        frame = self.picam2.capture_array()
        
        # filename = f"capture_{int(time.time())}.jpg"
        # self.picam2.capture_file(filename)
        
        results = self.model(frame, classes=(0,))[0]
        return bool(results.boxes)

def loop_detect(time_interval=5):
    detector = Detector()

    while True:
        detected = detector()
        if detected:
            logger.info(f"[{time.strftime('%H:%M:%S')}] Person detected!")
        else:
            logger.info(f"[{time.strftime('%H:%M:%S')}] No person.")

        time.sleep(time_interval) 

if __name__ == "__main__":
    logger.info("Starting streaming...")
    mqtt_connection = mqtt_build()

    subscribe(mqtt_connection)
    loop_detect(1)
    
    signal.pause()