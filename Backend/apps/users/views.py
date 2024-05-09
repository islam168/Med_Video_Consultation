import os
import requests
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveUpdateAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from apps.users.filters import DoctorFilter
from apps.users.models import Patient, DoctorCard, Doctor, Qualification, Problem, Appointment
from apps.users.serializers import (PatientCreateSerializer, MyTokenObtainPairSerializer, DoctorCardSerializer,
                                    DoctorPageSerializer, DoctorListSerializer, QualificationSerializer,
                                    ProblemSerializer, DoctorAppointmentDateTimeSerializer, AppointmentSerializer)
from apps.users.services.services_views import (RegistrationService, DoctorCardService, CreateAppointmentService,
                                                AppointmentService)
from core.permissions import IsDoctor, IsDoctorData
from django_filters import rest_framework as filters


class RegistrationAPIView(CreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientCreateSerializer
    permission_classes = [AllowAny,]

    def post(self, request, *args, **kwargs):
        success, message = RegistrationService.register_patient(request.data)
        if success:
            return Response(message, status=status.HTTP_201_CREATED)
        else:
            return Response(message, status=status.HTTP_400_BAD_REQUEST)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    permission_classes = [AllowAny,]


# Создание информационной карточки доктора
class DoctorCreateCardAPIView(CreateAPIView):
    queryset = DoctorCard.objects.all()
    serializer_class = DoctorCardSerializer
    permission_classes = [IsDoctor,]

    def post(self, request, *args, **kwargs):
        success, message = DoctorCardService.create_doctor_card(request.data)
        if success:
            return Response(message, status=status.HTTP_201_CREATED)
        else:
            return Response(message, status=status.HTTP_400_BAD_REQUEST)


# Обновление информационной карточки доктора
class DoctorCardAPIView(RetrieveUpdateAPIView):
    queryset = DoctorCard.objects.all()
    serializer_class = DoctorCardSerializer
    permission_classes = [IsDoctorData,]
    lookup_field = 'id'


class DoctorListAPIView(ListAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorListSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = DoctorFilter


# Страница "Специалисты"
class QualificationListAPIView(ListAPIView):
    queryset = Qualification.objects.all()
    serializer_class = QualificationSerializer
    permission_classes = [AllowAny,]


class HomePageAPIView(ListAPIView):
    serializer_class_problem = ProblemSerializer
    serializer_class_qualification = QualificationSerializer
    permission_classes = [AllowAny]

    def get_queryset_problem(self):
        return Problem.objects.all()

    def get_queryset_qualification(self):
        return Qualification.objects.all()

    def list(self, request, *args, **kwargs):
        problem = self.get_queryset_problem()
        qualification = self.get_queryset_qualification()
        problem_serializer = self.serializer_class_problem(problem, many=True)
        qualification_serializer = self.serializer_class_qualification(qualification, many=True)
        return Response(
            {
                "Problems": problem_serializer.data,
                "Qualification": qualification_serializer.data,
            }
        )


# Страница доктора
class DoctorPageAPIView(RetrieveAPIView):
    serializer_class_doctor = DoctorPageSerializer
    serializer_class_date_time = DoctorAppointmentDateTimeSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'
    queryset = Doctor.objects.all()

    def retrieve(self, request, *args, **kwargs):
        doctor = self.get_object()  # This will retrieve the specific doctor
        doctor_serializer = self.serializer_class_doctor(doctor)
        date_time_serializer = self.serializer_class_date_time(doctor)
        return Response(
            {
                "Doctor": doctor_serializer.data,
                "DateTime": date_time_serializer.data,
            }
        )


class AppointmentAPIView(ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [AllowAny]
    queryset = Appointment.objects.all()

    def list(self, request, *args, **kwargs):
        result = AppointmentService.appointment_list(request.user)
        if result:
            return Response(result, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated,]

    def post(self, request):
        # print("Request headers:", request.headers)
        # print("Request body:", request.body)
        # return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            refresh_token = request.data["refresh_token"]
            # print("Received refresh token:", refresh_token)  # Отладочный вывод
            token = RefreshToken(refresh_token)
            # print("Blacklisting token:", token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            # print("Error:", e)  # Отладочный вывод
            return Response(status=status.HTTP_400_BAD_REQUEST)


class CreateAppointmentAPIView(CreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [AllowAny, ]

    def post(self, request, *args, **kwargs):
        result = CreateAppointmentService.create_appointment(request.data)
        if result:
            return Response('Success', status=status.HTTP_200_OK)
        else:
            return Response('Error', status=status.HTTP_400_BAD_REQUEST)


class ValidateMeetingAPIView(RetrieveAPIView):
    serializer_class = None  # Замените на ваш сериализатор

    def retrieve(self, request, *args, **kwargs):
        METERED_SECRET_KEY = os.environ.get("METERED_SECRET_KEY")
        METERED_DOMAIN = os.environ.get("METERED_DOMAIN")

        print('DOMAIN', type(METERED_DOMAIN))
        print('KEY', METERED_SECRET_KEY)

        roomName = request.query_params.get("roomName")

        if roomName:
            url = f"https://{METERED_DOMAIN}/api/v1/room/{roomName}?secretKey={METERED_SECRET_KEY}"
            r = requests.get(url)
            data = r.json()
            if "roomName" in data:
                return Response({"roomFound": True}, status=status.HTTP_200_OK)
            else:
                return Response({"roomFound": False}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"success": False, "message": "Please specify roomName"},
                            status=status.HTTP_400_BAD_REQUEST)


class GetMeteredDomainAPIView(RetrieveAPIView):
    serializer_class = None  # Замените на ваш сериализатор

    def retrieve(self, request, *args, **kwargs):
        METERED_DOMAIN = os.environ.get("METERED_DOMAIN")

        return Response({"METERED_DOMAIN": METERED_DOMAIN}, status=status.HTTP_200_OK)
