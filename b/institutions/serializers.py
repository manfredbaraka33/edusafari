from rest_framework import serializers # type: ignore
from django.contrib.auth import get_user_model
from .models import (
    Curriculum, Subject, Combination, Course, Service,
    Institution, InstitutionCurriculum, InstitutionProgram,
    InstitutionService, InstitutionAcademicDetail, InstitutionSubject,
    InstitutionCombination,Event,DownloadMaterial,GalleryItem,Notice
)

User = get_user_model()

# ---------- Lookup Serializers ----------

class CurriculumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curriculum
        fields = ["id", "name", "created_at", "updated_at"]


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ["id", "name", "created_at", "updated_at"]


class CombinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Combination
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ["id", "name", "description", "duration_years", "created_at", "updated_at"]


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ["id", "name", "description", "created_at", "updated_at"]


# ---------- Institution Related Serializers ----------

class InstitutionCurriculumSerializer(serializers.ModelSerializer):
    curriculum = CurriculumSerializer(read_only=True)

    class Meta:
        model = InstitutionCurriculum
        fields = ["id", "curriculum"]


class InstitutionProgramSerializer(serializers.ModelSerializer):
    # course = CourseSerializer(read_only=True)

    class Meta:
        model = InstitutionProgram
        fields = [ 'delivery_mode', 'description', 'duration', 'fee', 'id', 'institution', 'name', 'type']


class InstitutionServiceSerializer(serializers.ModelSerializer):
    service = ServiceSerializer(read_only=True)

    class Meta:
        model = InstitutionService
        fields = ["id", "service"]


class InstitutionSubjectSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)

    class Meta:
        model = InstitutionSubject
        fields = ["id", "subject"]


class InstitutionCombinationSerializer(serializers.ModelSerializer):

    class Meta:
        model = InstitutionCombination
        fields = ["id","institution", "combination"]


class InstitutionAcademicDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstitutionAcademicDetail
        fields = [
            "capacity",
            "age_range",
            "grades_offered",
            "student_population",
            "accreditation",
        ]


# ---------- Institution Serializer ----------

class InstitutionSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)
    curriculums = InstitutionCurriculumSerializer(source="institutioncurriculum_set", many=True, read_only=True)
    programs = InstitutionProgramSerializer(source="institutionprogram_set", many=True, read_only=True)
    services = InstitutionServiceSerializer(source="institutionservice_set", many=True, read_only=True)
    subjects = InstitutionSubjectSerializer(source="institutionsubject_set", many=True, read_only=True)
    combinations = InstitutionCombinationSerializer(source="institutioncombination_set", many=True, read_only=True)
    academic_detail = InstitutionAcademicDetailSerializer(read_only=True)
    views_count = serializers.SerializerMethodField()

    class Meta:
        model = Institution
        fields = [
            "id", "regno", "type", "stay", "gender", "name", "slug", "about", "motto",
            "address", "region", "district", "ward", "latitude", "longitude",
            "website", "contact_email","fee_max","fee_min", "contact_phone",
            "logo", "banner",
            "established_year", "is_verified",
            "owner",
            "curriculums", "programs", "services", "subjects", "combinations", "academic_detail",
            "created_at", "updated_at","views_count"
        ]
        
    
    def get_views_count(self, obj):
        return obj.views.count()
        
        
class InstitutionWriteSerializer(serializers.ModelSerializer):
    # Accept IDs for linked relationships
    curriculums = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    programs = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    services = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    subjects = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    combinations = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    academic_detail = serializers.DictField(write_only=True, required=False)
    
        # ✅ Logo & Banner fields
    logo = serializers.ImageField(required=False, allow_null=True, write_only=True)
    banner = serializers.ImageField(required=False, allow_null=True, write_only=True)

    # Read-only URLs for clients
    logo_url = serializers.SerializerMethodField(read_only=True)
    banner_url = serializers.SerializerMethodField(read_only=True)
    
    def get_logo_url(self, obj):
        return obj.logo.url if obj.logo else None

    def get_banner_url(self, obj):
        return obj.banner.url if obj.banner else None

    class Meta:
        model = Institution
        fields = [
            "id", "regno", "type", "stay", "gender", "name", "slug", "about", "motto",
            "address", "region", "district", "ward", "latitude", "longitude",
            "website", "contact_email","fee_max","fee_min", "contact_phone",
            "logo", "banner",   
            "logo_url", "banner_url",
            "established_year", "is_verified",
            "owner",
            "curriculums", "programs", "services", "subjects", "combinations", "academic_detail",
        ]

    def create(self, validated_data):
        # Pop linked data
        curriculums_data = validated_data.pop("curriculums", [])
        programs_data = validated_data.pop("programs", [])
        services_data = validated_data.pop("services", [])
        subjects_data = validated_data.pop("subjects", [])
        combinations_data = validated_data.pop("combinations", [])
        academic_data = validated_data.pop("academic_detail", None)

        # Step 1: Create institution
        institution = Institution.objects.create(**validated_data)

        # Step 2: Create linked objects
        for cid in curriculums_data:
            InstitutionCurriculum.objects.create(institution=institution, curriculum_id=cid)
        for pid in programs_data:
            InstitutionProgram.objects.create(institution=institution, course_id=pid)
        for sid in services_data:
            InstitutionService.objects.create(institution=institution, service_id=sid)
        for subid in subjects_data:
            InstitutionSubject.objects.create(institution=institution, subject_id=subid)
        for combid in combinations_data:
            InstitutionCombination.objects.create(institution=institution, combination_id=combid)

        # Step 3: Create academic detail if provided
        if academic_data:
            InstitutionAcademicDetail.objects.create(institution=institution, **academic_data)

        return institution
    
    
    def update(self, instance, validated_data):
        # Pop linked data
        curriculums_data = validated_data.pop("curriculums", None)
        programs_data = validated_data.pop("programs", None)
        services_data = validated_data.pop("services", None)
        subjects_data = validated_data.pop("subjects", None)
        combinations_data = validated_data.pop("combinations", None)
        academic_data = validated_data.pop("academic_detail", None)

        # Update base fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Replace linked M2M-like relations if provided
        if curriculums_data is not None:
            instance.institutioncurriculum_set.all().delete()
            for cid in curriculums_data:
                InstitutionCurriculum.objects.create(institution=instance, curriculum_id=cid)

        if programs_data is not None:
            instance.institutionprogram_set.all().delete()
            for pid in programs_data:
                InstitutionProgram.objects.create(institution=instance, course_id=pid)

        if services_data is not None:
            instance.institutionservice_set.all().delete()
            for sid in services_data:
                InstitutionService.objects.create(institution=instance, service_id=sid)

        if subjects_data is not None:
            instance.institutionsubject_set.all().delete()
            for subid in subjects_data:
                InstitutionSubject.objects.create(institution=instance, subject_id=subid)

        if combinations_data is not None:
            instance.institutioncombination_set.all().delete()
            for combid in combinations_data:
                InstitutionCombination.objects.create(institution=instance, combination_id=combid)

        # Academic detail
        if academic_data is not None:
            academic_detail, created = InstitutionAcademicDetail.objects.get_or_create(
                institution=instance
            )
            for attr, value in academic_data.items():
                setattr(academic_detail, attr, value)
            academic_detail.save()

        return instance



class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
        
        
class DownloadMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = DownloadMaterial
        fields='__all__'
        
        
class GalleryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryItem
        fields = "__all__"
        
        


class NoticeSerializer(serializers.ModelSerializer):
    institution = InstitutionSerializer(read_only=True)
    institution_id = serializers.PrimaryKeyRelatedField(
        queryset = Institution.objects.all(),
        source ="institution",
        write_only = True
    )
    
    class Meta:
        model = Notice
        fields = ['id','institution','institution_id','title','content','start_date','end_date','created_at']