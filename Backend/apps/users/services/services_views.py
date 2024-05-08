from django.core.exceptions import ObjectDoesNotExist

from apps.users.models import Patient, DoctorCard, Doctor
from apps.users.serializers import PatientCreateSerializer, DoctorCardSerializer, AppointmentSerializer
from rest_framework import status
import os
import requests
import random
from rest_framework.response import Response


class RegistrationService:
    @staticmethod
    def register_patient(data):
        email = data.get('email')

        if Patient.objects.filter(email=email).exists():
            return False, 'A user with this email already exists'

        serializer = PatientCreateSerializer(data=data)

        #  Обработка ошибок при неправильных введенных данных
        if serializer.is_valid():
            serializer.save()
            return True, 'User was successfully created'
        else:
            return False, serializer.errors


class DoctorCardService:
    @staticmethod
    def create_doctor_card(data):
        doctor_id = data.get('doctor_id')

        if DoctorCard.objects.filter(doctor_id=doctor_id).exists():
            return False, 'This doctor already has his card'

        serializer = DoctorCardSerializer(data=data)

        #  Обработка ошибок при неправильных введенных данных
        if serializer.is_valid():
            serializer.save()
            return True, 'Card was successfully created'
        else:
            return False, serializer.errors


class CreateAppointmentService:
    @staticmethod
    def create_appointment(data):
        doctor = data['doctor']
        patient = data['patient']

        try:
            Doctor.objects.get(id=doctor)
        except ObjectDoesNotExist:
            return "Doctor not found"  # Обработка случая, когда у доктора не существует расписание

        try:
            Patient.objects.get(id=patient)
        except ObjectDoesNotExist:
            return "Patient not found"  # Обработка случая, когда у доктора не существует расписание

        METERED_SECRET_KEY = os.environ.get("METERED_SECRET_KEY")
        METERED_DOMAIN = os.environ.get("METERED_DOMAIN")

        roomID = random.randint(101234554312, 998765432156)

        url = f"https://{METERED_DOMAIN}/api/v1/room?secretKey={METERED_SECRET_KEY}"
        payload = {
            "roomName": roomID,
        }
        r = requests.post(url, data=payload)

        if r.status_code == status.HTTP_200_OK:
            data['url'] = roomID  # url-адрес видео конференции приема
            serializer = AppointmentSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
            return True
        else:
            return False
