from datetime import date

from apps.users.models import DoctorCard, Doctor


class DoctorCardServ:

    @staticmethod
    def doctor_work_experience(data):
        '''
        Логика для возвращения стажа работы, фото и другой информации о докторе из его
        информационной карточки в нужный serializers
        '''
        doctor_id = data.get('doctor_id')
        doctor = DoctorCard.objects.get(doctor_id_id=doctor_id)
        doctor_start_of_activity = Doctor.objects.get(id=doctor_id).start_of_activity
        qualification = doctor.qualification
        education = doctor.education
        advanced_training = doctor.advanced_training
        doctor_photo = str(doctor.doctor_photo)
        today = date.today()
        doctor_work_experience = (today.year - doctor_start_of_activity.year) - (
                (today.month, today.day) < (doctor_start_of_activity.month, doctor_start_of_activity.day))

        information_about_doctor = {
            'doctor_work_experience': doctor_work_experience,
            'qualification': qualification,
            'education': education,
            'advanced_training': advanced_training,
            'doctor_photo': doctor_photo,
        }
        return information_about_doctor
