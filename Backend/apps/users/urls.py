from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from apps.users.views import (RegistrationAPIView, MyTokenObtainPairView, DoctorCreateCardAPIView,
                              DoctorCardRetrieveUpdateAPIView, DoctorPageRetrieveAPIView, DoctorListAPIView,
                              QualificationListAPIView, HomePageAPIView, LogoutView, CreateAppointmentAPIView,
                              ValidateMeetingAPIView, GetMeteredDomainAPIView, AppointmentListAPIView,
                              EvaluationListCreateAPIView, EvaluationRetrieveUpdateAPIView, DeleteAppointmentAPIView,
                              FavoritesRetrieveUpdateDestroyAPIView, ProblemListAPIView, ListCreateNoteAPIView,
                              UpdateNoteAPIView, CreateUpdateReportAPIView)

urlpatterns = [
    path('', HomePageAPIView.as_view(), name='home_page'),

    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('registration/', RegistrationAPIView.as_view(), name='registration'),
    path('logout/', LogoutView.as_view(), name='auth_logout_all'),

    path('create_doctor_card/', DoctorCreateCardAPIView.as_view(), name='create_doctor_card'),
    path('doctor_card/<int:id>/', DoctorCardRetrieveUpdateAPIView.as_view(), name='doctor_card'),

    path('doctor/<int:id>/', DoctorPageRetrieveAPIView.as_view(), name='doctor_page'),
    path('doctors/', DoctorListAPIView.as_view(), name='doctor_list'),

    path('qualifications/', QualificationListAPIView.as_view(), name='qualification_list'),
    path('problems/', ProblemListAPIView.as_view(), name='problem_list'),

    path('evaluation/', EvaluationListCreateAPIView.as_view(), name='evaluation_list'),
    path('evaluation/<int:id>/', EvaluationRetrieveUpdateAPIView.as_view(), name='evaluation'),
    path('favorite/<int:id>/', FavoritesRetrieveUpdateDestroyAPIView.as_view(), name='favorite'),

    path('appointment_list/', AppointmentListAPIView.as_view(), name='appointment_list'),
    path('delete_appointment/<int:id>/', DeleteAppointmentAPIView.as_view(), name='delete_appointment'),
    path('create_appointment/', CreateAppointmentAPIView.as_view(), name='create_room'),

    path('validate-meeting', ValidateMeetingAPIView.as_view(), name='meeting'),
    path('metered-domain', GetMeteredDomainAPIView.as_view(), name='metered-domain'),

    path('note/', ListCreateNoteAPIView.as_view(), name='create_note'),
    path('note/<int:id>/', UpdateNoteAPIView.as_view(), name='note'),

    path('report/<int:id>/', CreateUpdateReportAPIView.as_view(), name='report'),
]
