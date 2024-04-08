from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from apps.users.managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=50, verbose_name='Имя')
    last_name = models.CharField(max_length=50, verbose_name='Фамилия')
    email = models.EmailField(
        unique=True,
        error_messages={
            'unique': "A user with that email already exists.",
        },
        verbose_name='Почта',
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        verbose_name = 'пользователь'
        verbose_name_plural = 'пользователи'

    def __str__(self):
        return f'{self.last_name} {self.first_name}'

    @property
    def get_full_name(self):
        full_name = f"{self.last_name} {self.first_name}"
        return full_name


class Patient(User):
    middle_name = models.CharField(max_length=50, blank=True, verbose_name='Отчество')
    birthdate = models.DateField(verbose_name='Дата рождения')

    class Meta:
        verbose_name = 'Пациент'
        verbose_name_plural = 'Пациенты'

    def __str__(self):
        return f"{self.get_full_name} {self.middle_name}"


class Qualification(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name='Название')

    class Meta:
        verbose_name = 'Квалификация'
        verbose_name_plural = 'Квалификации'

    def __str__(self):
        return self.name


class Doctor(User):
    qualification = models.ForeignKey(
        to='Qualification',
        related_name='doctor_qualification',
        on_delete=models.CASCADE,
        blank=False,
        verbose_name='Квалификация',
    )
    birthdate = models.DateField(verbose_name='День рождение')
    start_of_activity = models.DateField(
        verbose_name='Время начала профессиональной деятельности',
        blank=False,
        null=True
    )
    permission_to_consult = models.BooleanField(default=True, verbose_name='Разрешение на ведение консультации')
    middle_name = models.CharField(blank=True, max_length=50, verbose_name='Отчество')

    class Meta:
        verbose_name = 'Доктор'
        verbose_name_plural = 'Доктора'

    def __str__(self):
        return f"{self.get_full_name} {self.middle_name}"


class DoctorCard(models.Model):
    doctor_id = models.OneToOneField(
        verbose_name='Доктор',
        to='Doctor',
        related_name='doctor_card',
        on_delete=models.CASCADE,
        db_column='doctor_id',  # явное указание имени поля внешнего ключа в БД
    )
    qualification = models.TextField(verbose_name='Квалификация')
    education = models.TextField(verbose_name='Образование')
    advanced_training = models.TextField(verbose_name='Повышение квалификации', blank=True, null=True)

    class Meta:
        verbose_name = 'Информационная карточка доктора'
        verbose_name_plural = 'Информационные карты докторов'

    def __str__(self):
        return f"Информационная карта: ID:{self.id}, Доктор:{self.doctor_id}"
