import os
from dotenv import load_dotenv
from subprocess import Popen

load_dotenv(override=True)

class Config:
    region = os.getenv("AWS_DEFAULT_REGION")

    api_prefix = "http://localhost:5000"
    connect_prefix = "./connect/"

    # Device credentials (downloaded from AWS IoT Core)
    cert_filepath = connect_prefix + "final-project.cert.pem"
    key_filepath = connect_prefix + "final-project.private.key"
    ca_filepath = connect_prefix + "root-CA.crt"

    iot_client_id = "pi"
    iot_endpoint = "a30nuhpd8lu11l-ats.iot.us-east-1.amazonaws.com"

    alarm_interval = 5 # seconds
    alarm_sound = "./sound.wav"
    alarm_repeat_times = 3
