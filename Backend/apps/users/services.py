from datetime import date

from apps.users.models import Patient, Doctor, DoctorCard
from apps.users.serializers import PatientCreateSerializer, DoctorCardSerializer


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

    @staticmethod
    def doctor_work_experience(data):
        doctor_id = data.get('doctor_id')
        doctor = Doctor.objects.get(id=doctor_id)
        qualification = doctor.qualification
        doctor_start_of_activity = doctor.start_of_activity
        today = date.today()
        doctor_work_experience = (today.year - doctor_start_of_activity.year) - (
                (today.month, today.day) < (doctor_start_of_activity.month, doctor_start_of_activity.day))

        information_about_doctor = {
            'doctor_work_experience': doctor_work_experience,
            'qualification': qualification,
        }
        print('Стаж работы', information_about_doctor)
        return information_about_doctor
