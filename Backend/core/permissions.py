from django.core.exceptions import PermissionDenied
from rest_framework import permissions

from apps.users.models import Doctor


class IsDoctorData(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        print(obj.doctor_id.id)
        print(request.user.id)
        return obj.doctor_id.id == request.user.id


class IsDoctor(permissions.BasePermission):
    message = 'This user is not a doctor'

    def has_permission(self, request, view):
        if Doctor.objects.filter(id=request.user.id).exists():
            return True
        raise PermissionDenied(self.message)
