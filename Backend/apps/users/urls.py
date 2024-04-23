from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from apps.users.views import (RegistrationAPIView, MyTokenObtainPairView, DoctorCreateCardAPIView, DoctorCardAPIView,
                              DoctorPageAPIView, DoctorListAPIView, QualificationListAPIView, HomePageAPIView,
                              LogoutView, CreateRoomAPIView, ValidateMeetingAPIView, GetMeteredDomainAPIView)

urlpatterns = [
    path('', HomePageAPIView.as_view(), name='home_page'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('registration/', RegistrationAPIView.as_view(), name='registration'),
    path('logout/', LogoutView.as_view(), name='auth_logout_all'),
    path('create_doctor_card/', DoctorCreateCardAPIView.as_view(), name='create_doctor_card'),
    path('doctor_card/<int:id>/', DoctorCardAPIView.as_view(), name='doctor_card'),
    path('doctor/<int:id>/', DoctorPageAPIView.as_view(), name='doctor_page'),
    path('doctors/', DoctorListAPIView.as_view(), name='doctor_list'),
    path('qualifications/', QualificationListAPIView.as_view(), name='qualification_list'),

    path('create/room', CreateRoomAPIView.as_view(), name='create_room'),
    path('validate-meeting', ValidateMeetingAPIView.as_view(), name='meeting'),
    path('metered-domain', GetMeteredDomainAPIView.as_view(), name='metered-domain'),
]
