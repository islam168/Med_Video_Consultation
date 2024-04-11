from datetime import date
from apps.users.models import Doctor
from django.core.exceptions import ObjectDoesNotExist


class DoctorCardServiceSerializers:

    @staticmethod
    def doctor_work_experience(data):
        '''
        Returns the doctor's work experience in the required format
        '''
        doctor_id = data

        try:
            doctor = Doctor.objects.get(id=doctor_id)
        except ObjectDoesNotExist:
            return "Doctor not found"  # Handle the case where the doctor doesn't exist

        doctor_start_date = doctor.start_of_activity
        today = date.today()
        doctor_work_experience_years = today.year - doctor_start_date.year

        # Check if the current month and day are before the doctor's start date
        if (today.month, today.day) < (doctor_start_date.month, doctor_start_date.day):
            doctor_work_experience_years -= 1  # Subtract a year if we haven't reached the anniversary yet

        if (doctor_work_experience_years % 10) == 0:
            return f'{doctor_work_experience_years} лет'
        elif (doctor_work_experience_years % 10) == 1:
            return f'{doctor_work_experience_years} год'
        elif 1 < (doctor_work_experience_years % 10) < 5:
            return f'{doctor_work_experience_years} года'
        else:
            return f'{doctor_work_experience_years} лет'
        