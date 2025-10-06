from rest_framework import serializers # type: ignore
from .models import EduTool, EduToolComment
from users.serializers import UserProfileImageSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileImageSerializer(source="*", read_only=True)  # adapt source to your user model

    class Meta:
        model = User
        fields = ["id", "username", "profile"]
        

class EduToolCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = EduToolComment
        fields = ["id", "user", "text", "created"]

class EduToolSerializer(serializers.ModelSerializer):
    comments = EduToolCommentSerializer(many=True, read_only=True)
    votes_count = serializers.SerializerMethodField()

    class Meta:
        model = EduTool
        fields = [
            "id", "name", "description", "level", "category",
            "logo", "link", "is_affiliate", "affiliate_link",
            "votes_count", "comments"
        ]

    def get_votes_count(self, obj):
        return obj.votes.count()
