from rest_framework import serializers # type: ignore
from django.contrib.auth import get_user_model
from .models import Favorite
from institutions.serializers import InstitutionSerializer  

MyUser = get_user_model()


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = MyUser
        fields = ("id","username", "password", "profile_image", "user_type")

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = MyUser(**validated_data)
        user.set_password(password)
        user.save()
        return user


class FavoriteSerializer(serializers.ModelSerializer):
    """
    Serializes a Favorite entry, embedding institution details.
    """
    institution = InstitutionSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ["id", "user", "institution", "created_at"]
        read_only_fields = ["id", "created_at", "user"]

    def create(self, validated_data):
        """
        Ensure the favorite is tied to the requesting user automatically.
        """
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            validated_data["user"] = request.user
        return super().create(validated_data)


class UserProfileImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ["profile_image"]

    def update(self, instance, validated_data):
        instance.profile_image = validated_data.get("profile_image", instance.profile_image)
        instance.save()
        return instance
    
    
class UserCredentialsUpdateSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=False, min_length=6)

    class Meta:
        model = MyUser
        fields = ["username", "old_password", "new_password"]

      
    def validate_old_password(self, value):
            user = self.context["request"].user
            if not user.check_password(value):
                raise serializers.ValidationError("Old password is incorrect.")
            return value

    def update(self, instance, validated_data):
        # update username
        new_username = validated_data.get("username")
        if new_username:
            instance.username = new_username

        # update password
        new_password = validated_data.get("new_password")
        if new_password:
            instance.set_password(new_password)

        instance.save()
        return instance