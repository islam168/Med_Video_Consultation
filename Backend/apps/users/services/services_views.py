from datetime import datetime

from django.core.exceptions import ObjectDoesNotExist

from apps.users.models import Patient, DoctorCard, Doctor, Appointment
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
            return "Doctor not found"

        try:
            Patient.objects.get(id=patient)
        except ObjectDoesNotExist:
            return "Patient not found"

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


class AppointmentService:
    @staticmethod
    def appointment_list(request_user):
        user_id = request_user.id

        is_patient = False
        try:
            patient = Patient.objects.get(id=user_id)
            user = patient
            is_patient = True
        except Patient.DoesNotExist:
            try:
                doctor = Doctor.objects.get(id=user_id)
                user = doctor
            except Doctor.DoesNotExist:
                return "User does not exist"

        past_appointment = []
        future_appointment = []
        today = datetime.now().date()

        if is_patient:
            appointment_list = Appointment.objects.filter(patient=user.id).order_by('date')

            middle_name = user.middle_name

            for appointment in appointment_list:
                doctor = str(appointment.doctor)
                date = str(appointment.date)
                time = str(appointment.time.strftime('%H:%M'))
                appointment_data = {
                    'id': appointment.id,
                    'doctor': doctor,
                    'date': date,
                    'time': time,
                }
                if appointment.date < today:
                    past_appointment.append(appointment_data)
                else:
                    appointment_data['url'] = appointment.url
                    future_appointment.append(appointment_data)

        else:
            appointment_list = Appointment.objects.filter(doctor=user.id).order_by('date')

            middle_name = user.middle_name

            for appointment in appointment_list:
                patient = str(appointment.patient)
                date = str(appointment.date)
                time = str(appointment.time.strftime('%H:%M'))
                appointment_data = {
                    'id': appointment.id,
                    'patient': patient,
                    'date': date,
                    'time': time,
                }
                if appointment.date < today:
                    past_appointment.append(appointment_data)
                else:
                    appointment_data['url'] = appointment.url
                    future_appointment.append(appointment_data)

        full_name = f'{request_user.last_name} {request_user.first_name}'

        if middle_name:
            full_name += f' {middle_name}'

        result = {
            "UserName": full_name,
            "PastAppointments": past_appointment,
            "FutureAppointments": future_appointment,
        }

        return result
