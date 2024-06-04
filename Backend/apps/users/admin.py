from django.contrib import admin
from apps.users.models import (Qualification, Doctor, DoctorCard, Problem, DoctorSchedule, DayOfWeek,
                               DoctorAppointmentDate, Appointment, Evaluation, NoteReport, PasswordReset)
from django.db.models import Avg


admin.site.register(DoctorCard)
admin.site.register(DayOfWeek)
admin.site.register(DoctorAppointmentDate)


@admin.register(Qualification)
class QualificationAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}  # При вводе заголовка нового поста поле slug заполняется автоматически.


@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}


@admin.register(DoctorSchedule)
class DoctorScheduleAdmin(admin.ModelAdmin):
    list_display = ['doctor']
    search_fields = ['doctor__last_name', 'doctor__first_name', 'doctor__middle_name']


@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ['doctor', 'patient', 'rate']
    search_fields = ['doctor__last_name', 'doctor__first_name', 'doctor__middle_name']
    list_filter = ['rate', 'doctor']
    readonly_fields = ['doctor', 'patient', 'rate', 'review']


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ['email', 'id', 'last_name', 'first_name', 'middle_name', 'qualification',
                    'permission_to_consult', 'average_rating']
    list_filter = ['qualification', 'permission_to_consult']
    search_fields = ['last_name', 'first_name', 'middle_name']

    def get_fields(self, request, obj=None):
        if obj:  # если объект уже существует (редактирование)
            return ['last_name', 'first_name', 'middle_name', 'email', 'doctor_photo', 'birthdate',
                    'start_of_activity', 'qualification', 'permission_to_consult', 'is_active']
        else:  # если объект создается (новый)
            return ['last_name', 'first_name', 'middle_name', 'email', 'doctor_photo', 'birthdate',
                    'start_of_activity', 'qualification', 'permission_to_consult', 'password']

    def average_rating(self, obj):
        return self.calculate_average_rating(obj)

    average_rating.short_description = 'Средняя оценка'

    def calculate_average_rating(self, doctor):
        reviews = doctor.evaluations.all()
        if reviews.exists():
            return round(reviews.aggregate(Avg('rate'))['rate__avg'], 2)  # Рейтинг до 2-х знаков после запятой
        return None

    def save_model(self, request, obj, form, change):
        #  Хэширование пароля до сохранения
        obj.set_password(obj.password)
        super().save_model(request, obj, form, change)
