from django_filters import rest_framework as filters
from apps.users.models import Doctor


class DoctorFilter(filters.FilterSet):
    # Определение фильтра для поиска врачей по названию проблемы, с которой они могут работать
    problem = filters.CharFilter(field_name='qualification__problems__slug', lookup_expr='iexact')
    # Определение фильтра для поиска врачей по их квалификации
    qualification = filters.CharFilter(field_name='qualification__slug', lookup_expr='iexact')

    class Meta:
        # Указание модели, с которой связан данный FilterSet
        model = Doctor
        # Указание полей, по которым можно применять фильтрацию в адресной строке.
        # Пример: /api/users/doctors/?qualification=Терапевт. /api/users/doctors/?problem=Боль в горле
        fields = ['qualification', 'problem']
