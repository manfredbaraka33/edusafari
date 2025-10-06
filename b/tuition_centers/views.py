from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes # type: ignore
from rest_framework import permissions, status # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework.views import APIView # type: ignore
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import TuitionCentre, TuitionCentreComment, TuitionCentreVote
from .serializers import TuitionCentreSerializer, TuitionCentreCommentSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated # type: ignore

# List with search, filters, pagination
@api_view(["GET"])
@permission_classes([AllowAny])
def get_centres(request):
    qs = TuitionCentre.objects.all()

    search = request.GET.get("search")
    if search:
        qs = qs.filter(
            Q(name__icontains=search) |
            Q(description__icontains=search) |
            Q(location__icontains=search) |
            Q(level__icontains=search)
        ).distinct()

    if request.GET.get("level"):
        qs = qs.filter(level=request.GET["level"])
    if request.GET.get("location"):
        qs = qs.filter(location__icontains=request.GET["location"])

    sort = request.GET.get("sort")
    if sort in ["name", "-name"]:
        qs = qs.order_by(sort)

    offset = int(request.GET.get("offset", 0))
    limit = int(request.GET.get("limit", 20))
    qs = qs[offset:offset + limit]

    serializer = TuitionCentreSerializer(qs, many=True)
    return Response(serializer.data)


def centre_detail(request, pk):
    try:
        centre = TuitionCentre.objects.get(pk=pk)
    except TuitionCentre.DoesNotExist:
        return JsonResponse({"error": "Not found"}, status=404)

    serializer = TuitionCentreSerializer(centre)
    return JsonResponse(serializer.data, safe=False)


class TuitionCentreCommentCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        centre = get_object_or_404(TuitionCentre, pk=pk)
        serializer = TuitionCentreCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, centre=centre)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

add_comment = TuitionCentreCommentCreateView.as_view()


class TuitionCentreVoteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        centre = get_object_or_404(TuitionCentre, pk=pk)
        vote, created = TuitionCentreVote.objects.update_or_create(
            centre=centre,
            user=request.user,
            defaults={"value": True},
        )
        return Response({"message": "Voted", "created": created})

add_vote = TuitionCentreVoteView.as_view()
