from django.contrib import admin
from apps.users.models import Qualification, Doctor, DoctorCard, Problem


admin.site.register(DoctorCard)


@admin.register(Qualification)
class QualificationAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}  # при вводе заголовка нового поста поле slug заполняется автоматически


@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    fields = ['last_name', 'first_name', 'middle_name', 'email', 'doctor_photo', 'birthdate',
              'start_of_activity', 'qualification', 'permission_to_consult', 'password']
    list_display = ['email', 'id', 'last_name', 'first_name', 'middle_name', 'qualification', 'permission_to_consult']
    list_filter = ['qualification', 'permission_to_consult']
    search_fields = ['last_name', 'first_name', 'middle_name']

    def save_model(self, request, obj, form, change):
        #  Хэширование пароля до сохранения
        obj.set_password(obj.password)
        super().save_model(request, obj, form, change)
