from rest_framework import generics, permissions,status,viewsets # type: ignore
from rest_framework.decorators import api_view, permission_classes # type: ignore
from rest_framework.response import Response # type: ignore
from institutions.models import Institution
from django.utils import timezone
from institutions.serializers import InstitutionSerializer,InstitutionWriteSerializer
import json
from django.http import JsonResponse
from django.utils.dateparse import parse_datetime
from rest_framework.decorators import api_view, permission_classes # pyright: ignore[reportMissingImports]
from rest_framework.permissions import AllowAny,IsAuthenticated # type: ignore
from rest_framework.response import Response # pyright: ignore[reportMissingImports]
from rest_framework.views import APIView # type: ignore
from .models import (Curriculum, Subject, Combination, Course, 
                     Service,InstitutionProgram,
                     InstitutionAcademicDetail, 
                     InstitutionCombination,
                     InstitutionSubject,
                     Event,DownloadMaterial,GalleryItem,
                     InstView,Notice
                     )
from .serializers import (
    CurriculumSerializer, SubjectSerializer,
    CombinationSerializer, CourseSerializer, ServiceSerializer,
    InstitutionCombinationSerializer,
    InstitutionProgramSerializer,InstitutionAcademicDetailSerializer,
    InstitutionSubjectSerializer,EventSerializer,DownloadMaterialSerializer,
    GalleryItemSerializer,NoticeSerializer
)
from django.db.models import Q

class InstitutionCreateView(generics.CreateAPIView):
    """
    Create a new Institution
    """
    serializer_class = InstitutionWriteSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['GET'])
@permission_classes([permissions.AllowAny])  
def get_all_institutions(request):
    """
    Return all institutions (any type).
    """
    queryset = Institution.objects.all()
    serializer = InstitutionSerializer(queryset, many=True)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([AllowAny])
def get_curriculums(request):
    queryset = Curriculum.objects.all()
    serializer = CurriculumSerializer(queryset, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_subjects(request):
    queryset = Subject.objects.all()
    serializer = SubjectSerializer(queryset, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_combinations(request):
    queryset = Combination.objects.all()
    serializer = CombinationSerializer(queryset, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_courses(request):
    queryset = Course.objects.all()
    serializer = CourseSerializer(queryset, many=True)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([AllowAny])
def get_inst_courses(request,instId):
    queryset = InstitutionProgram.objects.filter(institution=instId)
    serializer = InstitutionProgramSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_inst_ac_details(request,instId):
    queryset = InstitutionAcademicDetail.objects.filter(institution=instId)
    serializer = InstitutionAcademicDetailSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_inst_combs(request,instId):
    queryset = InstitutionCombination.objects.filter(institution=instId)
    serializer = InstitutionCombinationSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_inst_subs(request,instId):
    queryset = InstitutionSubject.objects.filter(institution=instId)
    serializer = InstitutionSubjectSerializer(queryset, many=True)
    return Response(serializer.data)

    


@api_view(['GET'])
@permission_classes([AllowAny])
def get_services(request):
    queryset = Service.objects.all()
    serializer = ServiceSerializer(queryset, many=True)
    return Response(serializer.data)


class InstDetailsView(generics.RetrieveAPIView):
      queryset=Institution.objects.all()
      serializer_class=InstitutionSerializer
      permission_classes = [IsAuthenticated]

class InstitutionUpdateView(generics.UpdateAPIView):
    queryset = Institution.objects.all()
    serializer_class = InstitutionWriteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    

@api_view(['GET'])
@permission_classes([AllowAny])
def get_institutions(request):
    """
    Unified search + filters + pagination for institutions
    """
    qs = Institution.objects.all()

    # --- Search ---
    search = request.GET.get("search")
    if search:
        qs = qs.filter(
            Q(name__icontains=search) |
            Q(about__icontains=search) |
            Q(region__icontains=search) |
            Q(district__icontains=search) |
            Q(motto__icontains=search)
        ).distinct()

    # --- Filters ---
    if request.GET.get("type"):
        qs = qs.filter(type=request.GET["type"])
    if request.GET.get("curriculum"):
        qs = qs.filter(curriculums__curriculum__name__icontains=request.GET["curriculum"])
    if request.GET.get("region"):
        qs = qs.filter(region__iexact=request.GET["region"])
    
    if request.GET.get("gender"):
        qs = qs.filter(gender=request.GET["gender"])
        
    if request.GET.get("stay"):
        qs = qs.filter(stay=request.GET["stay"])
    
    if request.GET.get("fee_min"):
        qs = qs.filter(fee_min__gte=request.GET["fee_min"])
    if request.GET.get("fee_max"):
        qs = qs.filter(fee_max__lte=request.GET["fee_max"])

    # --- Sorting ---
    sort = request.GET.get("sort")
    if sort in ["fee_min", "-fee_min", "name", "-name"]:
        qs = qs.order_by(sort)

    # --- Pagination ---
    offset = int(request.GET.get("offset", 0))
    limit = int(request.GET.get("limit", 20))
    qs = qs[offset:offset + limit]

    serializer = InstitutionSerializer(qs, many=True)
    return Response(serializer.data)


class ProgrammeListCreateAPIView(generics.ListCreateAPIView):
    queryset = InstitutionProgram.objects.all()
    serializer_class = InstitutionProgramSerializer
    permission_classes = [permissions.IsAuthenticated]
    
create_list_progs = ProgrammeListCreateAPIView.as_view()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getInstProgs(request,instId):
    queryset = InstitutionProgram.objects.filter(institution=instId)
    serializer = InstitutionProgramSerializer(queryset, many=True)
    return Response(serializer.data)



class ProgrammeUpdateView(generics.UpdateAPIView):
    queryset = InstitutionProgram.objects.all()
    serializer_class = InstitutionProgramSerializer
    permission_classes = [permissions.IsAuthenticated]



class ProgrammeDeleteView(generics.DestroyAPIView):
    queryset = InstitutionProgram.objects.all()
    serializer_class = InstitutionProgramSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getInstCombs(request,instId):
    queryset = InstitutionCombination.objects.filter(institution=instId)
    serializer = InstitutionCombinationSerializer(queryset, many=True)
    return Response(serializer.data)



class CombCreateView(generics.CreateAPIView):
    queryset = InstitutionCombination.objects.all()
    serializer_class = InstitutionCombinationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addInstCombs(request):
    """
    Accepts POST:
    {
        "institution": 20,
        "combinations": ["PGM", "HGL", "ECA"]
    }
    Iteratively creates combinations and returns report.
    """
    institution_id = request.data.get("institution")
    combinations = request.data.get("combinations", [])

    if not institution_id or not isinstance(combinations, list):
        return Response(
            {"error": "Institution ID and combinations list are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        institution = Institution.objects.get(id=institution_id)
    except Institution.DoesNotExist:
        return Response(
            {"error": f"Institution with ID {institution_id} does not exist."},
            status=status.HTTP_404_NOT_FOUND
        )

    created = []
    skipped = []

    for combo in combinations:
        combo = combo.strip()
        if not combo:
            continue
        if InstitutionCombination.objects.filter(institution=institution, combination=combo).exists():
            skipped.append(combo)
        else:
            InstitutionCombination.objects.create(institution=institution, combination=combo)
            created.append(combo)

    report = {
        "created": created,
        "skipped": skipped,
        "total_requested": len(combinations)
    }

    return Response(report, status=status.HTTP_201_CREATED)


class InstitutionCombinationDeleteView(generics.DestroyAPIView):
    queryset = InstitutionCombination.objects.all()
    serializer_class = InstitutionCombinationSerializer



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_event(request, instId):
    if request.method == "POST":
        body = json.loads(request.body)
        name = body.get("name")
        description = body.get("description", "")
        start_date_time = parse_datetime(body.get("start_date_time"))

        event = Event.objects.create(
            institution_id=instId,
            name=name,
            description=description,
            start_date_time=start_date_time,
        )

        return JsonResponse({
            "id": event.id,
            "name": event.name,
            "description": event.description,
            "start_date_time": event.start_date_time.isoformat(),
        })
    return JsonResponse({"error": "POST required"}, status=400)




# Get all events for a specific institution
def institution_events(request, instId):
    events = Event.objects.filter(institution = instId).order_by("-start_date_time")
    data = [
        {
            "id": e.id,
            "name": e.name,
            "description": e.description,
            "start_date_time": e.start_date_time.isoformat(),
        }
        for e in events
    ]
    return JsonResponse(data, safe=False)

class EventsDeleteView(generics.DestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    
    
    
class EventUpdateView(generics.UpdateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    
class CreateDownloadMaterialView(generics.CreateAPIView):
    queryset = DownloadMaterial.objects.all()
    serializer_class = DownloadMaterialSerializer
    permission_classes = [permissions.IsAuthenticated] 
    
add_material=CreateDownloadMaterialView.as_view()


# Get all materials for a specific institution
def institution_materials(request, instId):
    materials = DownloadMaterial.objects.filter(institution = instId)
    base_url="http://127.0.0.1:8000"
    data = [
        {
            "id": m.id,
            "name": m.title,
            "material": base_url + m.material.url if m.material else None,
        }
        for m in materials
    ]
    return JsonResponse(data, safe=False)


class MaterialDeleteView(generics.DestroyAPIView):
    queryset = DownloadMaterial.objects.all()
    serializer_class = DownloadMaterialSerializer
    permission_classes = [permissions.IsAuthenticated]



def gallery_list(request, inst_id):
    if request.method == "GET":
        items = GalleryItem.objects.filter(institution=inst_id).order_by("-uploaded_at")
        data = [
            {
                "id": item.id,
                "title": item.title,
                "image": item.image.url if item.image else None,
                "uploaded_at": item.uploaded_at,
            }
            for item in items
        ]
        return JsonResponse(data, safe=False)





class CreateImageItemView(generics.CreateAPIView):
    queryset = GalleryItem.objects.all()
    serializer_class = GalleryItemSerializer
    permission_classes = [permissions.IsAuthenticated] 
    

gallery_add = CreateImageItemView.as_view()



def gallery_update(request, item_id):
    if request.method in ["POST", "PATCH"]:
        try:
            item = GalleryItem.objects.get(id=item_id)
        except GalleryItem.DoesNotExist:
            return JsonResponse({"error": "Not found"}, status=404)

        if request.POST.get("title"):
            item.title = request.POST["title"]
        if "image" in request.FILES:
            item.image = request.FILES["image"]

        item.save()
        return JsonResponse({
            "id": item.id,
            "title": item.title,
            "image": item.image.url,
            "uploaded_at": item.uploaded_at,
        })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def gallery_delete(request, item_id):
    if request.method == "DELETE":
        try:
            item = GalleryItem.objects.get(id=item_id)
            item.delete()
            return JsonResponse({"success": True})
        except GalleryItem.DoesNotExist:
            return JsonResponse({"error": "Not found"}, status=404)
        
        
class InstViewTrackView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        inst = Institution.objects.get(pk=pk)
        view = InstView.objects.create(
            inst=inst,
            user=request.user,  
        )
        return Response({"message": "viewed"})
    
    
add_view = InstViewTrackView.as_view()


class NoticeListCreateView(generics.ListCreateAPIView):
    """
    List all notices or create a new one.
    Supports ?active=true to only fetch active notices.
    """
    serializer_class = NoticeSerializer

    def get_queryset(self):
        qs = Notice.objects.all()
        active = self.request.query_params.get("active")
        if active == "true":
            now = timezone.now()
            qs = qs.filter(start_date__lte=now, end_date__gte=now)
        return qs


class NoticeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a single notice.
    """
    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer
    


def notices_list(request, inst_id):
    if request.method == "GET":
        notices = Notice.objects.filter(institution=inst_id).order_by("-created_at")
        data = [
            {
                "id": n.id,
                "title": n.title,
                "content": n.content,
                "start_date": n.start_date,
                "end_date": n.end_date,
                "created_at": n.created_at,
            }
            for n in notices
        ]
        return JsonResponse(data, safe=False)