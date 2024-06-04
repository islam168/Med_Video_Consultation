import uuid
from django.core.mail import send_mail
import os


def upload_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'

    return f'uploads/{instance.__class__.__name__}/{filename}'


def send_deletion_email(email, user_name, appointment, user_role):
    subject = 'Отмена консультации'
    message = (
        f'Доброго времени суток 😊.\n\n'
        f'{user_role} {user_name} отменил консультацию на {appointment.date} в {appointment.time.strftime("%H:%M")}.\n'
        f'Просим прощения, за оказанные неудобства. Всего наилучшего!'
    )

    send_mail(subject, message, os.environ.get("EMAIL"), [email])


def send_reset_code_deletion_email(email, code):
    subject = 'Сброс пароля'
    message = (
        f'Доброго времени суток 😊.\n\n'
        f'Ваш код сброса пароля {code}. \n'
        f'Ссылка на страницу сброса пароля http://localhost:3000/password_reset_code'
    )

    send_mail(subject, message, os.environ.get("EMAIL"), [email])
