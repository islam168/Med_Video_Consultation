import django.db.utils
from django.core.management.base import BaseCommand
from datetime import datetime, timedelta
from apps.users.models import DoctorSchedule, DoctorAppointmentDate


# python manage.py generate_appointment_dates - команда для создание дат приемов к доктору через неделю
class Command(BaseCommand):
    help = 'Generate appointment dates for doctors'

    def handle(self, *args, **options):
        # Получение сегодняшней даты
        today = datetime.now().date()
        days_of_week = {
            'Понедельник': 0,
            'Вторник': 1,
            'Среда': 2,
            'Четверг': 3,
            'Пятница': 4,
            'Суббота': 5,
            'Воскресенье': 6,
        }

        # Получение даты через 7 дней от нынешней
        date_in_week = today + timedelta(days=7)  # Дата через неделю
        day_of_week = date_in_week.weekday()

        # Итерация расписаний врачей
        for schedule in DoctorSchedule.objects.all():
            for day in schedule.days_of_week.all():

                if day_of_week == days_of_week[day.name]:  # Если день недели через неделю, совпадает с днем недели
                    # в расписании у доктора, создается дата приемов этому доктору на это день через неделю

                    # Обработка ошибки существующих дат на приемы к докторам в базе данных
                    try:
                        DoctorAppointmentDate.objects.create(doctor=schedule.doctor, date=date_in_week)
                    except django.db.utils.IntegrityError:
                        self.stdout.write(self.style.WARNING(
                            f'Appointment date for doctor {schedule.doctor} on {date_in_week} already exists.'))

        self.stdout.write(self.style.SUCCESS('Appointment dates generated successfully.'))
