from django.http import JsonResponse
from rest_framework.parsers import JSONParser, MultiPartParser  # type: ignore
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes  # type: ignore
from .models import OnlinePlatform, PlatformComment, PlatformVote
from .serializers import PlatformSerializer, PlatformCommentSerializer
from rest_framework import permissions, status  # type: ignore
from rest_framework.response import Response  # type: ignore
from rest_framework.views import APIView  # type: ignore
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated  # type: ignore
from django.db.models import Q


# Get all platforms
def platforms_list(request):
    platforms = OnlinePlatform.objects.all()
    serializer = PlatformSerializer(platforms, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(["GET"])
@permission_classes([AllowAny])
def get_platforms(request):
    """
    Unified search + filters + pagination for online platforms
    """
    qs = OnlinePlatform.objects.all()

    # --- Search ---
    search = request.GET.get("search")
    if search:
        qs = qs.filter(
            Q(name__icontains=search) |
            Q(description__icontains=search) |
            Q(category__icontains=search)
        ).distinct()

    # --- Filters ---
    if request.GET.get("category"):
        qs = qs.filter(category=request.GET["category"])

    # --- Sorting ---
    sort = request.GET.get("sort")
    if sort in ["name", "-name"]:
        qs = qs.order_by(sort)

    # --- Pagination ---
    offset = int(request.GET.get("offset", 0))
    limit = int(request.GET.get("limit", 20))
    qs = qs[offset:offset + limit]

    serializer = PlatformSerializer(qs, many=True)
    return Response(serializer.data)


# Get a single platform (with comments & votes)
def platform_detail(request, pk):
    try:
        platform = OnlinePlatform.objects.get(pk=pk)
    except OnlinePlatform.DoesNotExist:
        return JsonResponse({"error": "Not found"}, status=404)

    serializer = PlatformSerializer(platform)
    return JsonResponse(serializer.data, safe=False)


class OnlinePlatformCommentCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        platform = get_object_or_404(OnlinePlatform, pk=pk)
        serializer = PlatformCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, platform=platform)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


add_comment = OnlinePlatformCommentCreateView.as_view()


class OnlinePlatformVoteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        platform = get_object_or_404(OnlinePlatform, pk=pk)
        vote, created = PlatformVote.objects.update_or_create(
            platform=platform,
            user=request.user,
            defaults={"value": True},  # simple upvote system
        )
        return Response({"message": "Voted", "created": created})


add_vote = OnlinePlatformVoteView.as_view()
