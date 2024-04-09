import uuid


def upload_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'

    return f'uploads/{instance.__class__.__name__}/{filename}'