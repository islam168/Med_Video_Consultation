from datetime import date, timedelta, datetime
from apps.users.models import Doctor, DoctorSchedule, DoctorAppointmentDate, Appointment
from django.core.exceptions import ObjectDoesNotExist


class DoctorCardServiceSerializers:

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
        # Возвращает времени работы врача с учетом занятых слотов под приемы (слоты по 30 минут)

        try:
            doctor_schedule = DoctorSchedule.objects.get(doctor_id=doctor_id)
        except ObjectDoesNotExist:
            return "Doctor does not have schedule"  # Обработка случая, когда у доктора не существует расписание

        start_time = doctor_schedule.start_time
        end_time = doctor_schedule.end_time

        current_time = datetime.combine(datetime.today(), start_time)
        end_datetime = datetime.combine(datetime.today(), end_time)

        time_intervals = []

        while current_time <= end_datetime:
            time_intervals.append(current_time.time())
            current_time += timedelta(minutes=30)

        try:
            doctor_appointment_dates = list(DoctorAppointmentDate.objects.filter(doctor_id=doctor_id).order_by('date').
                                            values_list('date', flat=True))
        except ObjectDoesNotExist:
            return "Doctor does not haves appointments dates"  # Обработка случая, когда у доктора нет дат
            # предстоящих приемов

        date_list = []

        for d in doctor_appointment_dates:
            if d >= datetime.now().date():
                date_list.append(str(d))

        result = []
        for d in date_list:
            time_list = []
            for t in time_intervals:
                if DoctorAppointmentTimeService.check_availability(doctor_id, d, t):
                    time_list.append(t)

            date_time = {
                'date': d,
                'time': time_list
            }
            result.append(date_time)
        return result


