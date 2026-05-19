from fastapi import APIRouter
from pydantic import BaseModel
from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE = os.getenv("TWILIO_PHONE")

class SOSRequest(BaseModel):
    latitude: float
    longitude: float
    contacts: list

@router.post("/sos/send")
def send_sos(data: SOSRequest):
    try:
        client = Client(ACCOUNT_SID, AUTH_TOKEN)
        maps_link = f"https://maps.google.com/?q={data.latitude},{data.longitude}"
        message_body = (
            f"🆘 SOS ALERT!\n"
            f"Your contact needs IMMEDIATE help!\n"
            f"Location: {maps_link}\n"
            f"Coordinates: {data.latitude}, {data.longitude}\n"
            f"Please respond immediately!"
        )

        sent = []
        for contact in data.contacts:
            msg = client.messages.create(
                body=message_body,
                from_=TWILIO_PHONE,
                to=contact["phone"]
            )
            sent.append({"name": contact["name"], "status": "sent", "sid": msg.sid})

        return {"status": "success", "alerts_sent": sent}

    except Exception as e:
        return {"status": "error", "message": str(e)}