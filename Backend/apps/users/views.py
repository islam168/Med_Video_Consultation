from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveUpdateAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.views import TokenObtainPairView
from apps.users.filters import DoctorFilter
from apps.users.models import Patient, DoctorCard, Doctor, Qualification, Problem
from apps.users.serializers import (PatientCreateSerializer, MyTokenObtainPairSerializer, DoctorCardSerializer,
                                    DoctorPageSerializer, DoctorSerializer, QualificationSerializer, ProblemSerializer)
from apps.users.services.services_views import RegistrationService, DoctorCardService
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
            print(message)
            return Response(message, status=status.HTTP_400_BAD_REQUEST)


# Обновление информационной карточки доктора
class DoctorCardAPIView(RetrieveUpdateAPIView):
    queryset = DoctorCard.objects.all()
    serializer_class = DoctorCardSerializer
    permission_classes = [IsDoctorData,]
    lookup_field = 'id'


# Страница доктора
class DoctorPageAPIView(RetrieveAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorPageSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'


class DoctorListAPIView(ListAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
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


class LogoutView(APIView):
    permission_classes = [AllowAny,]

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
