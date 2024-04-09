from datetime import date
from apps.users.models import DoctorCard, Doctor


class DoctorCardServiceSerializers:

    @staticmethod
    def doctor_work_experience(data):
        '''
        Логика для возвращения стажа работы доктора в нужный serializers
        '''
        doctor_id = data.get('doctor_id')
        doctor_start_of_activity = Doctor.objects.get(id=doctor_id).start_of_activity
        today = date.today()
        doctor_work_experience = (today.year - doctor_start_of_activity.year) - (
                (today.month, today.day) < (doctor_start_of_activity.month, doctor_start_of_activity.day))

        return doctor_work_experience
