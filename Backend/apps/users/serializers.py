from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.users.services.services_serializers import DoctorCardServ
from apps.users.models import Patient, Doctor, DoctorCard


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


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'last_name', 'first_name', 'middle_name']


class DoctorPageSerializer(serializers.ModelSerializer):
    card = serializers.SerializerMethodField()
    qualification = serializers.CharField(source='qualification.name', read_only=True)

    class Meta:
        model = Doctor
        fields = ['id', 'last_name', 'first_name', 'middle_name', 'qualification', 'card']

    def get_card(self, obj):
        # Получение данных из информационной карточки доктора
        data = {'doctor_id': obj.id}
        dop_info = DoctorCardServ.doctor_work_experience(data)
        return dop_info
