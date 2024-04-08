from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from apps.users.views import RegistrationAPIView, MyTokenObtainPairView, DoctorCreateCardAPIView, DoctorCardAPIView

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('registration/', RegistrationAPIView.as_view(), name='registration'),
    # path('logout/', LogoutView.as_view(), name='logout'),
    path('create_doctor_card/', DoctorCreateCardAPIView.as_view(), name='create_doctor_card'),
    path('doctor_card/<int:id>/', DoctorCardAPIView.as_view(), name='doctor_card'),
]
