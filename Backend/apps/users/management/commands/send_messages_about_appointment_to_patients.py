from django.core.management.base import BaseCommand
from datetime import datetime
from apps.users.models import Appointment
from django.core.mail import send_mail
import os


# python manage.py generate_appointment_dates - команда для создание дат приемов к доктору через неделю
class Command(BaseCommand):
    help = 'Generate appointment dates for doctors'

    def handle(self, *args, **options):
        today_date = datetime.today().date()
        appointments = Appointment.objects.filter(date=today_date).order_by('patient', 'time')
        patient_id = Appointment.objects.filter(date=today_date).values_list('patient', flat=True).distinct()

        for p in patient_id:
            patient_appointments = appointments.filter(patient=p)
            if len(patient_appointments) > 1:
                consultation = 'Консультации'
            else:
                consultation = 'Консультация'

            patient_name = f"{patient_appointments[0].patient.last_name} {patient_appointments[0].patient.first_name}"
            middle_name = patient_appointments[0].patient.middle_name
            if middle_name:
                patient_name += f" {middle_name}"

            text_of_message = ''
            num = 1
            for patient_appointment in patient_appointments:
                if len(patient_appointments) == 1:
                    doctor_name = f"{patient_appointment.doctor.last_name} {patient_appointment.doctor.first_name}"
                    middle_name = patient_appointment.doctor.middle_name
                    if middle_name:
                        doctor_name += f" {middle_name}"
                    text_of_message += f"Доктор: {doctor_name}. Время {patient_appointment.time}.\n"
                else:
                    doctor_name = f"{patient_appointment.doctor.last_name} {patient_appointment.doctor.first_name}"
                    middle_name = patient_appointment.doctor.middle_name
                    if middle_name:
                        doctor_name += f" {middle_name}"
                    text_of_message += f"{num}. Доктор: {doctor_name}. Время {patient_appointment.time}.\n"
                    num += 1

            subject = consultation

            message = (
                f'Доброго времени суток {patient_name}.\n\n'
                f'Хотели напомнить что сегодня у вас сегодня {consultation.lower()}.\n'
                f'{text_of_message}'
                f'Страница расписания приемов: http://localhost:3000/meet \n'
                f'Всего наилучшего! 😊'
            )

            send_mail(subject, message, os.environ.get("EMAIL"), [patient_appointments[0].patient.email])

        self.stdout.write(self.style.SUCCESS('Appointment dates generated successfully.'))
