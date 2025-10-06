from rest_framework import generics, status,permissions # type: ignore
from rest_framework.response import Response    # type: ignore
from rest_framework.permissions import IsAuthenticated    # type: ignore
from rest_framework.decorators import api_view, permission_classes  # type: ignore
from django.contrib.auth import get_user_model
from .serializers import UserProfileImageSerializer,UserCredentialsUpdateSerializer
from .models import Favorite
from .serializers import UserRegisterSerializer, FavoriteSerializer
from institutions.models import Institution

MyUser = get_user_model()


# ---------------- User Registration ----------------

class UserRegisterView(generics.CreateAPIView):
    queryset = MyUser.objects.all()
    serializer_class = UserRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "message": "User registered successfully",
            "user": {
                "id": user.id,
                "username": user.username,
                "user_type": user.user_type
            }
        }, status=status.HTTP_201_CREATED)


# ---------------- Current User ----------------

class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


# ---------------- Toggle Favorite ----------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_favorite(request):
    """
    Toggle (add/remove) a favorite institution for the current user.
    Expected body: { "institution_id": <id> }
    """
    user = request.user
    institution_id = request.data.get("institution_id")

    if not institution_id:
        return Response({"error": "institution_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        institution = Institution.objects.get(id=institution_id)
    except Institution.DoesNotExist:
        return Response({"error": "Invalid institution_id"}, status=status.HTTP_400_BAD_REQUEST)

    favorite, created = Favorite.objects.get_or_create(
        user=user,
        institution=institution
    )

    if not created:
        favorite.delete()
        return Response({"message": "Favorite removed"}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "Favorite added"}, status=status.HTTP_201_CREATED)


# ---------------- List Favorites ----------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_favorites(request):
    """
    Return a list of institutions favorited by the current user.
    """
    favorites = Favorite.objects.filter(user=request.user)
    serializer = FavoriteSerializer(favorites, many=True, context={"request": request})
    return Response(serializer.data)



#----------------Updates---------------------------------
class UpdateProfileImageView(generics.UpdateAPIView):
    serializer_class = UserProfileImageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_object(), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"message": "Profile image updated successfully"})
    
    
class UpdateCredentialsView(generics.UpdateAPIView):
    serializer_class = UserCredentialsUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_object(), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"message": "Credentials updated successfully"})
