from django.http import JsonResponse
from rest_framework.parsers import JSONParser, MultiPartParser # type: ignore
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes # type: ignore
from .models import EduTool, EduToolComment, EduToolVote
from .serializers import EduToolSerializer, EduToolCommentSerializer
from rest_framework import permissions, status # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework.views import APIView # type: ignore
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny,IsAuthenticated # type: ignore
from django.db.models import Q


# Get all tools
def edutools_list(request):
    tools = EduTool.objects.all()
    serializer = EduToolSerializer(tools, many=True)
    return JsonResponse(serializer.data, safe=False)



@api_view(['GET'])
@permission_classes([AllowAny])
def get_edutools(request):
    """
    Unified search + filters + pagination for edutools
    """
    qs = EduTool.objects.all()

    # --- Search ---
    search = request.GET.get("search")
    if search:
        qs = qs.filter(
            Q(name__icontains=search) |
            Q(description__icontains=search) |
            Q(level__icontains=search) |
            Q(category__icontains=search)  
        ).distinct()

    # --- Filters ---
    if request.GET.get("level"):
        qs = qs.filter(level=request.GET["level"])
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

    serializer = EduToolSerializer(qs, many=True)
    return Response(serializer.data)



# Get a single tool (with comments & votes)
def edutool_detail(request, pk):
    try:
        tool = EduTool.objects.get(pk=pk)
    except EduTool.DoesNotExist:
        return JsonResponse({"error": "Not found"}, status=404)

    serializer = EduToolSerializer(tool)
    return JsonResponse(serializer.data, safe=False)


    
class EduToolCommentCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        tool = get_object_or_404(EduTool, pk=pk)
        serializer = EduToolCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, tool=tool)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

add_comment = EduToolCommentCreateView.as_view()


class EduToolVoteView(APIView):
    permission_classes = [permissions.IsAuthenticated]


    def post(self, request, pk):
        tool = EduTool.objects.get(pk=pk)
        vote, created = EduToolVote.objects.update_or_create(
            tool=tool,
            user=request.user,
            defaults={"value": True},  
        )
        return Response({"message": "Voted", "created": created})
    
    
add_vote = EduToolVoteView.as_view()



