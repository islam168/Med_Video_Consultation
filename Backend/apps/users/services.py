from datetime import date

from apps.users.models import Patient, Doctor
from apps.users.serializers import PatientCreateSerializer, DoctorCardCreateSerializer


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
    def create_card_of_doctor(data):
        length_of_service = data.get('length_of_service')
        doctor_id = data.get('doctor_id')
        doctor_instance = Doctor.objects.get(id=doctor_id)
        doctor_birthdate = doctor_instance.birthdate
        today = date.today()
        age_of_doctor = today.year - doctor_birthdate.year - (
                    (today.month, today.day) < (doctor_birthdate.month, doctor_birthdate.day))

        serializer = DoctorCardCreateSerializer(data=data)
        if serializer.is_valid():
            if length_of_service + age_of_doctor < 50:
                return False, 'The doctor\'s length of service does not match his age'
            serializer.save()
            return True, 'User was successfully created'
        else:
            return False, serializer.errors
