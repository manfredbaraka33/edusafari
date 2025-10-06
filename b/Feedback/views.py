from rest_framework import generics # type: ignore
from .serializers import FeedbackSerializer
from .models import FeedbackOrHelp


class CreateFeedbackAPIView(generics.CreateAPIView):
    queryset = FeedbackOrHelp.objects.all()
    serializer_class = FeedbackSerializer
