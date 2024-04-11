from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from apps.users.views import (RegistrationAPIView, MyTokenObtainPairView, DoctorCreateCardAPIView, DoctorCardAPIView,
                              DoctorPageAPIView, DoctorListAPIView, QualificationListAPIView, HomePageAPIView)

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('registration/', RegistrationAPIView.as_view(), name='registration'),
    # path('logout/', LogoutView.as_view(), name='logout'),
    path('create_doctor_card/', DoctorCreateCardAPIView.as_view(), name='create_doctor_card'),
    path('doctor_card/<int:id>/', DoctorCardAPIView.as_view(), name='doctor_card'),
    path('doctor/<int:id>/', DoctorPageAPIView.as_view(), name='doctor_page'),
    path('doctors/', DoctorListAPIView.as_view(), name='doctor_list'),
    path('qualifications/', QualificationListAPIView.as_view(), name='qualification_list'),
    path('', HomePageAPIView.as_view(), name='home_page'),
]
