from django.contrib import admin
from apps.users.models import Qualification, Doctor, DoctorCard

admin.site.register(Qualification)
admin.site.register(DoctorCard)


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    fields = ['last_name', 'first_name', 'middle_name', 'email', 'birthdate', 'start_of_activity', 'qualification',
              'permission_to_consult', 'password']
    ordering = ['email']
    list_display = ['id', 'email', 'last_name', 'first_name', 'middle_name', 'qualification', 'permission_to_consult']
    list_filter = ['qualification', 'permission_to_consult']
    search_fields = ['last_name', 'first_name', 'middle_name']

    def save_model(self, request, obj, form, change):
        #  Хэширование пароля до сохранения
        obj.set_password(obj.password)
        super().save_model(request, obj, form, change)
