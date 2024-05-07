from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.users.services.services_serializers import DoctorCardServiceSerializers, DoctorAppointmentTimeService
from apps.users.models import Patient, Doctor, DoctorCard, Qualification, Problem, DoctorSchedule


class PatientCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ('first_name', 'last_name', 'middle_name', 'email', 'birthdate', 'password')

    def create(self, validated_data):
        user = Patient.objects.create_user(**validated_data)
        user.set_password(validated_data['password'])
        user.save()

        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['email'] = user.email

        return token


class DoctorCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorCard
        fields = ['id', 'doctor_id', 'qualification', 'education', 'advanced_training', 'doctor_photo']


class DoctorInfoCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorCard
        fields = ['qualification', 'education', 'advanced_training']


class DoctorPageSerializer(serializers.ModelSerializer):
    doctor_card = DoctorInfoCardSerializer(read_only=True)
    qualification = serializers.CharField(source='qualification.name', read_only=True)
    work_experience = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = ['id', 'last_name', 'first_name', 'middle_name', 'qualification', 'work_experience',
                  'doctor_photo', 'doctor_card']

    # Получение опыта работы доктора
    def get_work_experience(self, obj):
        dop_info = DoctorCardServiceSerializers.doctor_work_experience(obj.id)
        return dop_info


# Время работы доктора с учетом занятых временных периодов под приемы
class DoctorAppointmentDateTimeSerializer(serializers.Serializer):
    date_time = serializers.SerializerMethodField()

    def get_date_time(self, obj):
        date_time = DoctorAppointmentTimeService.doctor_appointment_time(obj.id)
        return date_time


class DoctorListSerializer(serializers.ModelSerializer):
    work_experience = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = ['id', 'last_name', 'first_name', 'middle_name', 'work_experience', 'doctor_photo']

    def get_work_experience(self, obj):
        dop_info = DoctorCardServiceSerializers.doctor_work_experience(obj.id)
        return dop_info


class QualificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Qualification
        fields = ['name', 'description', 'slug', 'image']


class ProblemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Problem
        fields = ['name', 'slug', 'image']
