import os

from apps.users.models import Doctor, Qualification

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
import django
django.setup()
import pytest
from django.urls import reverse
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_registration_correct_data_api_view():
    client = APIClient()
    correct_data = {
        "first_name": "user_first_name",
        "last_name": "user_last_name.",
        "middle_name": "",
        "birthdate": "2001-12-20",
        "email": "user_username@gmail.com",
        "password": "userpassword",
        "confirm_password": "userpassword"
    }
    response = client.post(reverse('registration'), correct_data, format='json')
    assert response.status_code == 201


@pytest.mark.django_db
def test_registration_incorrect_data_api_view():

    client = APIClient()

    incorrect_data = {
        "first_name": "user_first_name",
        "last_name": "user_last_name.",
        "middle_name": "",
        "birthdate": "2001-12-20",
        "email": "user3434242@gmailcom",
        "password": "userpassword",
        "confirm_password": "userpassword1"
    }

    response = client.post(reverse('registration'), incorrect_data, format='json')
    assert response.status_code == 400


@pytest.mark.django_db
def test_doctor_list_api_view():
    client = APIClient()
    response = client.get(reverse('doctor_list'))
    assert response.status_code == 200


@pytest.mark.django_db
def test_login_correct_data():
    client = APIClient()
    qualification = Qualification.objects.create(name="Cardiologist", description="Cardiology Specialist", slug="cardiologist")
    doctor = Doctor.objects.create_user(
        first_name="Doctor",
        last_name="Test",
        email="doctor@test.com",
        birthdate="2000-10-10",
        password="doctortest123",
        qualification=qualification

    )
    correct_data = {
        "email": doctor.email,
        "password": "doctortest123"
    }
    response = client.post(reverse('token_obtain_pair'), correct_data, format='json')
    assert response.status_code == 200
    assert 'access' in response.data
    assert 'refresh' in response.data