from rest_framework import permissions, status # type: ignore
from rest_framework.decorators import api_view, permission_classes # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework.views import APIView # type: ignore
from django.shortcuts import get_object_or_404
from .models import VendorService, VendorServiceComment, VendorServiceImage,ServiceVote
from .serializers import VendorServiceSerializer, VendorServiceCommentSerializer, VendorServiceImageSerializer
from django.db.models import Q

# # List / search / filter vendor services
@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def get_vendor_services(request):
    qs = VendorService.objects.all()
    print("I got in ====================")
    
    search = request.GET.get("search")
    if search:
        qs = qs.filter(Q(name__icontains=search) | Q(description__icontains=search))
    if request.GET.get("category"):
        qs = qs.filter(category=request.GET["category"])
    if request.GET.get("region"):
        qs = qs.filter(region=request.GET["region"])
        
    sort = request.GET.get("sort")
    if sort in ["name", "-name"]:
        qs = qs.order_by(sort)
    
    serializer = VendorServiceSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def vendor_service_detail(request, pk):
    service = get_object_or_404(VendorService, pk=pk)
    serializer = VendorServiceSerializer(service)
    return Response(serializer.data)


# Create a service (Vendor only)
class VendorServiceCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if request.user.user_type != "vendor_user":
            return Response({"error": "Only vendors can create services"}, status=403)
        serializer = VendorServiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(vendor=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

create_vendor_service = VendorServiceCreateView.as_view()


# Add images
class VendorServiceImageCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        service = get_object_or_404(VendorService, pk=pk, vendor=request.user)
        serializer = VendorServiceImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(service=service)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

add_vendor_image = VendorServiceImageCreateView.as_view()


# Add comment
class VendorServiceCommentCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        service = get_object_or_404(VendorService, pk=pk)
        serializer = VendorServiceCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, service=service)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

add_vendor_comment = VendorServiceCommentCreateView.as_view()



class ServiceVoteView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    print('I got in here')

    def post(self, request, pk):
        service = VendorService.objects.get(pk=pk)
        vote, created = ServiceVote.objects.update_or_create(
            service=service,
            user=request.user,
            defaults={"value": True},  # simple upvote system
        )
        return Response({"message": "Voted", "created": created})
    
    
add_service_vote = ServiceVoteView.as_view()