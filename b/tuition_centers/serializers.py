from rest_framework import serializers # type: ignore
from .models import TuitionCentre, TuitionCentreComment, TuitionCentreVote
from users.serializers import UserProfileImageSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileImageSerializer(source="*", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "profile"]


class TuitionCentreCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = TuitionCentreComment
        fields = ["id", "user", "text", "created"]


class TuitionCentreSerializer(serializers.ModelSerializer):
    comments = TuitionCentreCommentSerializer(many=True, read_only=True)
    votes_count = serializers.SerializerMethodField()

    class Meta:
        model = TuitionCentre
        fields = [
            "id", "name", "description", "level",
            "location", "contact", "logo", "website",
            "votes_count", "comments"
        ]

    def get_votes_count(self, obj):
        return obj.votes.count()
