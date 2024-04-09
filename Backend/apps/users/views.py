from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from apps.users.models import Patient, DoctorCard, Doctor
from apps.users.serializers import (PatientCreateSerializer, MyTokenObtainPairSerializer, DoctorCardSerializer,
                                    DoctorPageSerializer)
from apps.users.services.services_views import RegistrationService, DoctorCardService
from core.permissions import IsDoctor, IsDoctorData


class RegistrationAPIView(generics.CreateAPIView):
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
class DoctorCreateCardAPIView(generics.ListCreateAPIView):
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
class DoctorCardAPIView(generics.RetrieveUpdateAPIView):
    queryset = DoctorCard.objects.all()
    serializer_class = DoctorCardSerializer
    permission_classes = [IsDoctorData,]
    lookup_field = 'id'


# Страница доктора
class DoctorPageAPIView(generics.RetrieveAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorPageSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'


# class LogoutView(APIView):
#     permission_classes = [IsAuthenticated]
#
#     def post(self, request):
#         try:
#             refresh_token = request.data["refresh_token"]
#             token = RefreshToken(refresh_token)
#             token.blacklist()
#
#             return Response(status=status.HTTP_205_RESET_CONTENT)
#         except Exception as e:
#             return Response(status=status.HTTP_400_BAD_REQUEST)
