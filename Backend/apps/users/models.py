from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from apps.users.managers import UserManager
from apps.users.utils import upload_image


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
    favorites = models.ManyToManyField(to='Doctor', verbose_name='Избранное', related_name='favorites')

    class Meta:
        verbose_name = 'Пациент'
        verbose_name_plural = 'Пациенты'

    def __str__(self):
        return f"{self.get_full_name} {self.middle_name}"


class Qualification(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name='Название')
    description = models.CharField(verbose_name='Описание', max_length=150, default=None, null=True)
    image = models.ImageField(verbose_name='Изображение', upload_to=upload_image, blank=False, null=True)
    slug = models.SlugField(unique=True, blank=False, null=False, default=None)

    class Meta:
        verbose_name = 'Квалификация'
        verbose_name_plural = 'Квалификации'

    def __str__(self):
        return self.name


# Болезни, трудности и т.д. с которыми пациент пришел на консультацию.
class Problem(models.Model):
    name = models.CharField(verbose_name='Проблема пациента', max_length=50, unique=True)
    image = models.ImageField(verbose_name='Изображение', upload_to=upload_image, default=None)
    qualification = models.ForeignKey(
        verbose_name='Квалификация специалиста по данной проблеме',
        to='Qualification',
        related_name='problems',
        on_delete=models.PROTECT
    )
    slug = models.SlugField(unique=True, blank=False, null=False, default=None)

    class Meta:
        verbose_name = 'Проблема пациента'
        verbose_name_plural = 'Проблемы пациентов'

    def __str__(self):
        return self.name


class Doctor(User):
    qualification = models.ForeignKey(
        to='Qualification',
        related_name='doctor_qualification',
        on_delete=models.PROTECT,
        #  Это означает, что при попытке удалить родительскую запись будет возбуждено исключение ProtectedError.
        blank=False,
        verbose_name='Квалификация',
    )
    birthdate = models.DateField(verbose_name='День рождение')
    doctor_photo = models.ImageField(verbose_name='Фото доктора', upload_to=upload_image, blank=False, null=True)
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
        db_column='doctor_id',  # Явное указание имени поля внешнего ключа в БД.
    )
    qualification = models.CharField(verbose_name='Квалификация', max_length=800)
    education = models.CharField(verbose_name='Образование', max_length=800)
    advanced_training = models.CharField(verbose_name='Повышение квалификации', blank=True, null=True, max_length=800)

    class Meta:
        verbose_name = 'Информационная карточка доктора'
        verbose_name_plural = 'Информационные карты докторов'

    def __str__(self):
        return f"Информационная карта: ID:{self.id}, Доктор:{self.doctor_id}"


class DayOfWeek(models.Model):
    name = models.CharField(max_length=20, verbose_name='Название дня', default=None)

    class Meta:
        verbose_name = 'День недели'
        verbose_name_plural = 'Дени недели'

    def __str__(self):
        return self.name


class DoctorSchedule(models.Model):
    doctor = models.OneToOneField(
        verbose_name='Доктор',
        to='Doctor',
        on_delete=models.CASCADE,
        related_name='schedule'
    )
    days_of_week = models.ManyToManyField(
        verbose_name='Дни недели',
        to='DayOfWeek',
        related_name='schedule',
        blank=False
    )
    start_time = models.TimeField(verbose_name='Время начала консультаций')
    end_time = models.TimeField(verbose_name='Время окончания консультаций')

    class Meta:
        verbose_name = 'Расписание'
        verbose_name_plural = 'Расписания'

    def __str__(self):
        return f'Расписание {self.doctor}'


class DoctorAppointmentDate(models.Model):
    doctor = models.ForeignKey(
        verbose_name='Доктор',
        to='Doctor',
        on_delete=models.CASCADE,
        related_name='appointment_date',
    )
    date = models.DateField(verbose_name='Дата')

    class Meta:
        verbose_name = 'Дата приема'
        verbose_name_plural = 'Даты приемов'
        unique_together = ['doctor', 'date']

    def __str__(self):
        return f'Дата приема у доктора: {self.doctor}. Дата: {self.date}'


class Appointment(models.Model):
    doctor = models.ForeignKey(
        verbose_name='Доктор',
        to='Doctor',
        on_delete=models.CASCADE,
        related_name='appointment',
    )
    patient = models.ForeignKey(
        verbose_name='Доктор',
        to='Patient',
        on_delete=models.CASCADE,
        related_name='appointment',
    )
    time = models.TimeField(verbose_name='Дата')
    date = models.DateField(verbose_name='Время')
    url = models.CharField(max_length=20, unique=True, default='')

    class Meta:
        verbose_name = 'Прием у доктора'
        verbose_name_plural = 'Приемы у доктора'

    def __str__(self):
        return f'Доктор: {self.doctor}. Пациент: {self.patient.email}. Дата: {self.date}. Время: {self.time}.'


class Evaluation(models.Model):
    doctor = models.ForeignKey(
        verbose_name='Доктор',
        to='Doctor',
        related_name='evaluations',
        on_delete=models.CASCADE,
    )
    patient = models.ForeignKey(
        verbose_name='Пользователь',
        to='Patient',
        related_name='evaluations',
        on_delete=models.CASCADE,
    )
    rate = models.PositiveIntegerField(
        verbose_name='Оценка',
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )
    review = models.CharField(
        verbose_name='Отзыв',
        max_length=500,
        blank=True,
        null=True,
    )

    class Meta:
        # Обеспечивают уникальность, когда пациент оценивает доктора,
        # чтобы он не мог поставить оценку и оставить отзыв одному доктору больше 1 раза.
        unique_together = ['doctor', 'patient']
        verbose_name = 'Оценка доктора'
        verbose_name_plural = 'Оценки доктора'

    def __str__(self):
        return f'{self.doctor} {self.patient.email}'


class Note(models.Model):
    note = models.TextField(verbose_name='Заметки')
    appointment = models.OneToOneField(
        on_delete=models.CASCADE,
        related_name='note',
        to='Appointment',
        verbose_name='Запись на прием',
        default=None
    )

    class Meta:
        verbose_name = 'Заметка'
        verbose_name_plural = 'Заметки'

    def __str__(self):
        return f"{self.id}, {self.note}, {self.appointment.id}"
