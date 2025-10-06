from rest_framework import serializers  # type: ignore
from .models import OnlinePlatform, PlatformComment
from users.serializers import UserProfileImageSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileImageSerializer(source="*", read_only=True)  # adapt source to your user model

    class Meta:
        model = User
        fields = ["id", "username", "profile"]


class PlatformCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = PlatformComment
        fields = ["id", "user", "text", "created"]


class PlatformSerializer(serializers.ModelSerializer):
    comments = PlatformCommentSerializer(many=True, read_only=True)
    votes_count = serializers.SerializerMethodField()

    class Meta:
        model = OnlinePlatform
        fields = [
            "id", "name", "description", "category",
            "logo", "link", "is_affiliate", "affiliate_link",
            "votes_count", "comments"
        ]

    def get_votes_count(self, obj):
        return obj.votes.count()
