from datetime import datetime, timedelta

import pytz
from django.core.exceptions import ObjectDoesNotExist
from apps.users.models import Patient, DoctorCard, Doctor, Appointment, Evaluation, NoteReport, User, PasswordReset
from apps.users.serializers import PatientCreateSerializer, DoctorCardSerializer, AppointmentSerializer, \
    EvaluationSerializer, PasswordResetSerializer
from rest_framework import status
import os
import requests
import random
from rest_framework.response import Response

from apps.users.utils import send_deletion_email, send_reset_code_deletion_email
from core import settings


class RegistrationService:
    @staticmethod
    def register_patient(data):
        email = data['email']

        if Patient.objects.filter(email=email).exists():
            return False, 'A user with this email already exists'

        if data['password'] != data['confirm_password']:
            return False, 'Passwords don not match'

        serializer = PatientCreateSerializer(data=data)

        #  Обработка ошибок при неправильных введенных данных
        if serializer.is_valid():
            serializer.save()
            return True, 'User was successfully created'
        else:
            return False, serializer.errors


class DoctorService:
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

    @staticmethod
    def create_update_evaluation(request):
        data = request.data
        data['patient'] = request.user.id

        if 'id' in data:
            try:
                instance = Evaluation.objects.get(id=data['id'])
                serializer = EvaluationSerializer(instance, data=data)
            except Evaluation.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            if serializer.is_valid():
                serializer.save()
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            if not Evaluation.objects.filter(doctor=data['doctor'], patient=data['patient']).exists():
                serializer = EvaluationSerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(status=status.HTTP_201_CREATED)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response('Evaluation already exists', status=status.HTTP_400_BAD_REQUEST)


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
            appointment_list = Appointment.objects.filter(patient=user.id).order_by('date', 'time')

            middle_name = user.middle_name

            for appointment in appointment_list:
                doctor = str(appointment.doctor)
                date = str(appointment.date)
                time = str(appointment.time.strftime('%H:%M'))
                appointment_data = {
                    'id': appointment.id,
                    'doctor_id': appointment.doctor.id,
                    'doctor': doctor,
                    'date': date,
                    'time': time,
                }

                appointment_date = appointment.date

                def report(appointment_id):
                    rep = NoteReport.objects.filter(appointment=appointment_id).first()
                    if rep and rep.status == 'PB':
                        appointment_data['report'] = rep.id
                    else:
                        appointment_data['report'] = None

                if appointment_date < today:
                    report(appointment.id)
                    past_appointment.append(appointment_data)
                else:
                    if appointment_date == today:
                        current_time = datetime.now()
                        appointment_datetime = datetime.combine(appointment_date, appointment.time)

                        # Вычисление разницы во времени
                        time_difference = current_time - appointment_datetime

                        # Проверка, что разница составляет 45 минут
                        if abs(time_difference) > timedelta(minutes=45):
                            report(appointment.id)
                            past_appointment.append(appointment_data)
                        else:
                            appointment_data['url'] = appointment.url
                            future_appointment.append(appointment_data)

                    else:
                        appointment_data['url'] = appointment.url
                        future_appointment.append(appointment_data)

        else:
            appointment_list = Appointment.objects.filter(doctor=user.id).order_by('date', 'time')

            middle_name = user.middle_name

            for appointment in appointment_list:
                patient = str(appointment.patient)
                date = str(appointment.date)
                time = str(appointment.time.strftime('%H:%M'))
                appointment_data = {
                    'id': appointment.id,
                    'patient_id': appointment.patient.id,
                    'patient': patient,
                    'date': date,
                    'time': time,
                }

                appointment_date = appointment.date

                def report(appointment_id):
                    rep = NoteReport.objects.filter(appointment=appointment_id).first()
                    if rep:
                        if rep.status == 'PB':
                            appointment_data['report'] = rep.id
                            appointment_data['is_published'] = True
                        else:
                            appointment_data['report'] = rep.id
                            appointment_data['is_published'] = False
                    else:
                        appointment_data['report'] = None

                if appointment_date < today:
                    report(appointment.id)
                    past_appointment.append(appointment_data)
                else:
                    if appointment_date == today:
                        current_time = datetime.now()
                        appointment_datetime = datetime.combine(appointment_date, appointment.time)

                        # Вычисление разницы во времени
                        time_difference = current_time - appointment_datetime

                        # Проверка, что разница составляет 45 минут
                        if abs(time_difference) > timedelta(minutes=45):
                            report(appointment.id)
                            past_appointment.append(appointment_data)
                        else:
                            appointment_data['url'] = appointment.url
                            future_appointment.append(appointment_data)

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

    @staticmethod
    def create_appointment(request):
        data = request.data

        try:
            Patient.objects.get(id=request.user.id)
        except Patient.DoesNotExist:
            return "User is not a patient"

        doctor = data['doctor']

        try:
            Doctor.objects.get(id=doctor)
        except ObjectDoesNotExist:
            return "Doctor not found"

        METERED_SECRET_KEY = os.environ.get("METERED_SECRET_KEY")
        METERED_DOMAIN = os.environ.get("METERED_DOMAIN")

        # Получение существующих идентификаторов (url)
        existing_ids = set(Appointment.objects.values_list('url', flat=True))
        attempts = 0
        max_attempts = 1000

        roomID = 0

        while attempts < max_attempts:
            roomID = random.randint(101234554312, 998765432156)
            if roomID not in existing_ids:
                break
            attempts += 1

        url = f"https://{METERED_DOMAIN}/api/v1/room?secretKey={METERED_SECRET_KEY}"
        payload = {
            "roomName": roomID,
        }
        r = requests.post(url, data=payload)

        if r.status_code == status.HTTP_200_OK:
            data['url'] = roomID  # ID комнаты консультации
            serializer = AppointmentSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
            return True
        else:
            return False

    @staticmethod
    def delete_appointment(request, appointment_id):
        user_id = request.user.id

        # Проверка существования записи
        try:
            appointment = Appointment.objects.get(id=appointment_id)
        except Appointment.DoesNotExist:
            return False, 'Appointment does not exist'

        # Проверка, является ли пользователь пациентом или доктором
        try:
            patient = Patient.objects.get(id=user_id)
            email = appointment.doctor.email
            user_name = f"{patient.last_name} {patient.first_name}"
            middle_name = patient.middle_name
            if middle_name:
                user_name += f" {middle_name}"
            user_role = 'Пациент'
        except Patient.DoesNotExist:
            try:
                doctor = Doctor.objects.get(id=user_id)
                email = appointment.patient.email
                user_name = f"{doctor.last_name} {doctor.first_name}"
                middle_name = doctor.middle_name
                if middle_name:
                    user_name += f" {middle_name}"
                user_role = 'Доктор'
            except Doctor.DoesNotExist:
                return False, 'User does not exist'

        date_today = datetime.now().date()
        time_now = datetime.now().time()

        # Удалять запись на прием можно, только если дата приема >= сегодняшней дате
        if appointment.date >= date_today:
            if appointment.date == date_today:
                # Если дата прием == сегодня проверять время, чтобы между временем приема и
                # сейчас было минимум 60 минут, иначе нельзя отменить (удалить прием)
                appointment_time_in_minutes = appointment.time.hour * 60 + appointment.time.minute
                time_now_in_minutes = time_now.hour * 60 + time_now.minute
                time_between_time_now_and_appointment_time = appointment_time_in_minutes - time_now_in_minutes
                if time_between_time_now_and_appointment_time >= 60:
                    appointment.delete()
                    send_deletion_email(email, user_name, appointment, user_role)
                    return True, 'Appointment deleted success'
                return False, 'Cancellation of appointment at least one hour before'
            else:
                # Если дата прием > сегодня время не важно
                appointment.delete()
                send_deletion_email(email, user_name, appointment, user_role)
                return True, 'Appointment deleted success'
        return False, 'Appointment date is up'

    @staticmethod
    def get_appointment_note(request):
        meeting_id = request.query_params.get('meetingID')
        appointment_id = Appointment.objects.get(url=meeting_id).id
        try:
            note = NoteReport.objects.get(appointment=appointment_id)
            return True, note
        except Exception as e:
            return False, appointment_id

    @staticmethod
    def create_appointment_report(request):
        doctor_id = request.user.id
        data = request.data

        try:
            Doctor.objects.get(id=doctor_id)
        except Doctor.DoesNotExist:
            return False, 'Doctor does not exist or user is not a doctor'

        report_id = data['id']

        try:
            report = NoteReport.objects.get(id=report_id)
        except NoteReport.DoesNotExist:
            return False, 'Report does not exist'

        if report.status != 'PB':
            report.status = 'PB'

        report.text = data['text']

        report.save()

        return True, 'Report saved successfully'

    @staticmethod
    def appointment_report(request, report_id):
        user_id = request.user.id

        try:
            report = NoteReport.objects.get(id=report_id)
        except NoteReport.DoesNotExist:
            return False, 'Report does not exist'

        is_patient = Patient.objects.filter(id=user_id).exists()

        if is_patient and report.status == 'DF':
            return False, 'Patient does not have access rights to the page'

        return True, 'Success'


class PasswordResetService:
    @staticmethod
    def password_reset(request):
        data = request.data
        code = data['code']

        try:
            password_reset = PasswordReset.objects.get(code=code)
        except PasswordReset.DoesNotExist:
            return False, 'There is no such reset code'

        try:
            user = User.objects.get(id=password_reset.user.id)
        except User.DoesNotExist:
            return False, 'User does not exist'

        current_date_time = datetime.now()

        # Конвертирование времени создания пароля в нужный формат и временную зону из settings
        # (с временной зоной были проблемы)
        local_tz = pytz.timezone(settings.TIME_ZONE)

        password_reset_created_at_local = password_reset.created_at.astimezone(local_tz).replace(tzinfo=None)

        # Вычисление разницы по дате и времени
        date_time_difference = current_date_time - password_reset_created_at_local

        if date_time_difference.days == 0:
            hours_difference = date_time_difference.seconds // 3600
            if hours_difference >= 12:
                return False, 'The reset code is out of date'

            password_1 = data['password_1']
            password_2 = data['password_2']
            if password_1 == password_2:
                # Сохранение нового пароля пользователя и всех кодов сброса пользователя
                user.set_password(password_1)
                user.save()
                PasswordReset.objects.filter(user=user).delete()
                return True, 'Password has been changed'
            return False, 'The passwords do not match'

        else:
            return False, 'The reset code is out of date'

    @staticmethod
    def password_reset_code(request):
        email = request.data['email']

        try:
            user_id = User.objects.get(email=email).id
        except User.DoesNotExist:
            return False, 'User does not exist'

        existing_ids = set(PasswordReset.objects.values_list('code', flat=True))
        attempts = 0
        max_attempts = 1000

        code = 0

        while attempts < max_attempts:
            code = random.randint(113223, 998789)
            if code not in existing_ids:
                break
            attempts += 1

        data = {
            'user': user_id,
            'code': code
        }

        serializer = PasswordResetSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            send_reset_code_deletion_email(email, code)
            return True, 'Reset code has been created'

        return False, 'Something went wrong'
