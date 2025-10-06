from rest_framework import serializers # type: ignore
from .models import FeedbackOrHelp


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackOrHelp
        fields ='__all__'