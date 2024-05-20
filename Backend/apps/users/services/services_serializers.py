from datetime import date, timedelta, datetime
from django.db.models import Avg
from apps.users.models import Doctor, DoctorSchedule, DoctorAppointmentDate, Appointment, Patient, Evaluation
from django.core.exceptions import ObjectDoesNotExist


class DoctorService:
    @staticmethod
    def doctor_work_experience(doctor_id):
        # Возвращает опыт работы врача в требуемом формате

        try:
            doctor = Doctor.objects.get(id=doctor_id)
        except ObjectDoesNotExist:
            return "Doctor not found"  # Обработка случая, когда доктор не существует

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

    @staticmethod
    def evaluation(doctor_id, request_user):
        evaluations = Evaluation.objects.filter(doctor=doctor_id).exclude(patient=request_user)
        return evaluations

    @staticmethod
    def evaluation_for_anonymous_user(doctor_id):
        evaluations = Evaluation.objects.filter(doctor=doctor_id)
        return evaluations

    # Проверка есть ли у нынешнего пациента отзыв
    @staticmethod
    def current_user_evaluation(doctor_id, request_user):
        user_id = request_user.id

        if Patient.objects.filter(id=user_id).exists():
            appointments = Appointment.objects.filter(doctor=doctor_id, patient=user_id)
            if not appointments.exists():
                return 'Patient does not have any appointment'

            # Проверка есть ли уже прошедшая запись на прием к доктору у запрашиваемого пользователя,
            # т.к. если ее нет он не может оценить качество услуг доктора
            evaluation = Evaluation.objects.filter(doctor=doctor_id, patient=user_id)
            datetime_today = datetime.today()

            for appointment in appointments:
                # Объединение даты и времени и преобразование их в формат datetime
                appointment_datetime = datetime.combine(appointment.date, appointment.time)
                if appointment_datetime <= datetime_today:
                    return evaluation

            return 'Patient does not have any appointment'
        return None

    @staticmethod
    def favorite(doctor, request_user):
        user_id = request_user.id

        # Проверяем, является ли пользователь пациентом и существует ли он
        if Patient.objects.filter(id=user_id).exists():
            # Используем метод exists() для проверки наличия в избранном
            result = doctor.favorites.filter(id=user_id).exists()
            return result
        return 'AnonymousUser'


class DoctorAppointmentTimeService:

    @staticmethod
    def check_availability(doctor_id, appointment_date, appointment_time):
        # Проверка доступности времени для записи к врачу
        try:
            existing_appointments = Appointment.objects.filter(doctor_id=doctor_id, date=appointment_date,
                                                               time=appointment_time)
            if existing_appointments.exists():
                return False  # Запись уже существует в указанное время
            else:
                return True  # Время доступно для записи
        except Exception as e:
            return False  # Обработка возможных ошибок при выполнении запроса к базе данных

    @staticmethod
    def doctor_appointment_time(doctor_id):
        try:
            doctor_schedule = DoctorSchedule.objects.get(doctor_id=doctor_id)
        except DoctorSchedule.DoesNotExist:
            return "Doctor does not have a schedule"

        start_time = doctor_schedule.start_time
        end_time = doctor_schedule.end_time

        current_time = datetime.combine(datetime.today(), start_time)
        end_datetime = datetime.combine(datetime.today(), end_time)

        time_intervals = []
        while current_time <= end_datetime:
            time_intervals.append(current_time.strftime('%H:%M'))
            current_time += timedelta(minutes=30)

        doctor_appointment_dates = DoctorAppointmentDate.objects.filter(doctor_id=doctor_id).order_by('date')

        date_list = [str(d.date) for d in doctor_appointment_dates if d.date >= datetime.now().date()]

        result = []
        for d in date_list:
            time_list = [t for t in time_intervals if DoctorAppointmentTimeService.check_availability(doctor_id, d, t)]
            result.append({'date': d, 'time': time_list})

        return result


class DoctorRatingService:
    def calculate_average_rating(doctor):
        reviews = doctor.evaluations.all()
        if reviews.exists():
            return round(reviews.aggregate(Avg('rate'))['rate__avg'], 2)  # Рейтинг до 2-ч знаков после запятой
        return None


class TokenService:
    @staticmethod
    def user_identification(user_id):

        try:
            Patient.objects.get(id=user_id)
        except ObjectDoesNotExist:
            return False

        return True
