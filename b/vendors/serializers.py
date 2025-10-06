from rest_framework import serializers # type: ignore
from .models import VendorService, VendorServiceImage, VendorServiceComment
from users.serializers import UserProfileImageSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileImageSerializer(source="*", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "profile"]


class VendorServiceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorServiceImage
        fields = ["id", "image"]


class VendorServiceCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = VendorServiceComment
        fields = ["id", "user", "text", "created"]


class VendorServiceSerializer(serializers.ModelSerializer):
    comments = VendorServiceCommentSerializer(many=True, read_only=True)
    images = VendorServiceImageSerializer(many=True, read_only=True)
    votes_count = serializers.SerializerMethodField()  

    class Meta:
        model = VendorService
        fields = [
            "id", "vendor", "name", "description", "category",
            "logo", "contact", "website", "is_featured","is_verified",
            "images", "comments", "votes_count","region","district"
        ]
        read_only_fields = ["vendor"]

    
    def get_votes_count(self, obj):
        return obj.votes.count()
