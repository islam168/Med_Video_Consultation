from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from apps.users.models import Patient
from apps.users.serializers import PatientCreateSerializer, MyTokenObtainPairSerializer
from apps.users.services import RegistrationService


class RegistrationAPIView(generics.CreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientCreateSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        success, message = RegistrationService.register_patient(request.data)
        if success:
            return Response(message, status=status.HTTP_201_CREATED)
        else:
            return Response(message, status=status.HTTP_400_BAD_REQUEST)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    permission_classes = [AllowAny]


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


# class DoctorCardAPIView(generics.ListCreateAPIView):
#     queryset = DoctorCard.objects.all()
#     serializer_class = DoctorCardCreateSerializer
#     permission_classes = [AllowAny]
#
#     def post(self, request, *args, **kwargs):
#         print('запрос', request.data)
#         success, message = DoctorCardService.create_card_of_doctor(request.data)
#         if success:
#             return Response(message, status=status.HTTP_201_CREATED)
#         else:
#             return Response(message, status=status.HTTP_400_BAD_REQUEST)
