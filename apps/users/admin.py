from django.contrib import admin
from apps.users.models import Patient, Qualification, Doctor

admin.site.register(Qualification)


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    fields = ['last_name', 'first_name', 'middle_name', 'email', 'birthdate', 'qualification',
              'permission_to_consult', 'password']
    ordering = ['email']
    list_display = ['email', 'last_name', 'first_name', 'middle_name', 'qualification', 'permission_to_consult']
    list_filter = ['qualification', 'permission_to_consult']
    search_fields = ['last_name', 'first_name', 'middle_name']

    def save_model(self, request, obj, form, change):
        #  Хэширование пароля до сохранения
        obj.set_password(obj.password)
        super().save_model(request, obj, form, change)
