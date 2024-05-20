from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.users.services.services_serializers import DoctorService, DoctorAppointmentTimeService, \
    TokenService, DoctorRatingService
from apps.users.models import Patient, Doctor, DoctorCard, Qualification, Problem, DoctorSchedule, Appointment, \
    Evaluation


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
        print(user)
        user_identification = TokenService.user_identification(user.id)
        token = super().get_token(user)

        token['is_patient'] = user_identification

        return token


class DoctorCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorCard
        fields = ['id', 'doctor_id', 'qualification', 'education', 'advanced_training', 'doctor_photo']


class DoctorInfoCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorCard
        fields = ['qualification', 'education', 'advanced_training']


class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = ['id', 'doctor', 'patient', 'rate', 'review']


class DoctorPageSerializer(serializers.ModelSerializer):
    doctor_card = DoctorInfoCardSerializer(read_only=True)
    qualification = serializers.CharField(source='qualification.name', read_only=True)
    work_experience = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    evaluations = serializers.SerializerMethodField()
    current_user_evaluation = serializers.SerializerMethodField()
    date_time = serializers.SerializerMethodField()
    favorite = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = ['id', 'last_name', 'first_name', 'middle_name', 'qualification', 'work_experience',
                  'doctor_photo', 'doctor_card', 'date_time', 'average_rating', 'evaluations',
                  'current_user_evaluation', 'favorite']

    def get_date_time(self, obj):
        return DoctorAppointmentTimeService.doctor_appointment_time(obj.id)

    def get_average_rating(self, obj):
        return DoctorRatingService.calculate_average_rating(obj)

    def get_evaluations(self, obj):
        request_user = self.context['request'].user
        try:
            evaluations = DoctorService.evaluation(obj, request_user)
        except TypeError:
            evaluations = DoctorService.evaluation_for_anonymous_user(obj)
        if evaluations:
            serialized_evaluations = EvaluationSerializer(evaluations, many=True).data
            # Заменяем id пациента на его имя
            for evaluation in serialized_evaluations:
                patient_id = evaluation['patient']
                patient = Patient.objects.get(id=patient_id)
                evaluation['patient'] = f"{patient.last_name} {patient.first_name}"
            return serialized_evaluations
        else:
            return []

    def get_current_user_evaluation(self, obj):
        request_user = self.context['request'].user
        if str(request_user) == 'AnonymousUser':
            return 'AnonymousUser'
        evaluation = DoctorService.current_user_evaluation(obj, request_user)
        if evaluation == 'Patient does not have any appointment':
            return 'Patient does not have any appointment with this doctor'
        if evaluation:
            return EvaluationSerializer(evaluation, many=True).data
        else:
            return None

    # Получение опыта работы доктора
    def get_work_experience(self, obj):
        dop_info = DoctorService.doctor_work_experience(obj.id)
        return dop_info

    def get_favorite(self, obj):
        request_user = self.context['request'].user
        return DoctorService.favorite(obj, request_user)


class DoctorListSerializer(serializers.ModelSerializer):
    work_experience = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = ['id', 'last_name', 'first_name', 'middle_name', 'work_experience',
                  'doctor_photo', 'average_rating']

    def get_work_experience(self, obj):
        dop_info = DoctorService.doctor_work_experience(obj.id)
        return dop_info

    def get_average_rating(self, obj):
        return DoctorRatingService.calculate_average_rating(obj)


class QualificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Qualification
        fields = ['name', 'description', 'slug', 'image']


class ProblemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Problem
        fields = ['name', 'slug', 'image']


class AppointmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Appointment
        fields = ['doctor', 'patient', 'date', 'time', 'url']


class FavoritesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Patient
        fields = ['favorites']

    def to_representation(self, instance):
        if self.context['request'].method == 'GET':
            # Получаем представление объекта Patient
            representation = super().to_representation(instance)
            # Извлекаем список id избранных докторов
            favorite_ids = representation['favorites']
            favorite_doctors = Doctor.objects.filter(id__in=favorite_ids)
            serialized_favorites = DoctorListSerializer(instance=favorite_doctors, many=True).data
            # Заменяем список идентификаторов на сериализованные данные о докторах
            representation['favorites'] = serialized_favorites
            # Возвращаем измененное представление Patient
            return representation
        else:
            return super().to_representation(instance)
