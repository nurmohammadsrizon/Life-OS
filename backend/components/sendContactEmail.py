from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel, EmailStr
from .send_mail import send_contact_request_email

router = APIRouter()

class ContactEmailRequest(BaseModel):
    name: str
    email: EmailStr
    message: str

    class Config:
        min_anystr_length = 1
        max_anystr_length = 1200


@router.post("/send-contact-email")
async def send_contact_email(data: ContactEmailRequest, background_tasks: BackgroundTasks):
    try:
        send_contact_request_email(
            name=data.name,
            email=str(data.email),
            message=data.message,
            background_tasks=background_tasks,
        )
        return {
            "status": True,
            "message": "Contact request received. Your message has been queued for delivery.",
        }
    except Exception as exc:
        print(f"Contact email error: {exc}")
        raise HTTPException(status_code=500, detail="Unable to send contact request right now.")
