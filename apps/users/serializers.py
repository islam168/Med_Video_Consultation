from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.users.models import Patient, Doctor


class PatientCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Patient
        fields = ('first_name', 'last_name', 'middle_name', 'email', 'birthdate', 'password')

    def create(self, validated_data):
        user = Patient.objects.create_user(**validated_data)
        user.set_password(validated_data['password'])
        user.save()

        return user


class DoctorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Doctor
        fields = ('id', 'last_name', 'first_name', 'middle_name')


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['email'] = user.email

        return token

# class DoctorCardCreateSerializer(serializers.ModelSerializer):
#     doctor_id = DoctorSerializer(read_only=True)
#
#     class Meta:
#         model = DoctorCard
#         fields = ('doctor_id', 'length_of_service', 'qualification', 'education', 'advanced_training')

