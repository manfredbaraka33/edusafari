from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone

MyUser = get_user_model() 

# ---------- Shared / Lookup Models ----------

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Curriculum(TimeStampedModel):
    """
    e.g. NECTA, Cambridge (IGCSE/A Level), IB, Montessori, American, British, etc.
    """
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Subject(TimeStampedModel):
    """
    Used mainly by Secondary (O-level) and can also appear in other contexts.
    """
    name = models.CharField(max_length=120, unique=True)

    def __str__(self):
        return self.name


class Combination(TimeStampedModel):
    """
    A-level combinations (e.g., PCB, ECA, HGL). Backed by the Subject M2M.
    """
    name = models.CharField(max_length=50, unique=True)
    subjects = models.ManyToManyField(Subject, related_name='combinations', blank=True)

    def __str__(self):
        return self.name


class Course(TimeStampedModel):
    """
    Programs for Colleges/Universities (e.g., BSc Computer Science, Diploma in Nursing).
    """
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    duration_years = models.PositiveSmallIntegerField(blank=True, null=True)  # optional

    def __str__(self):
        return self.name


class Service(TimeStampedModel):
    """
    General services offered by an institution (Transport, Meals, Sports, Library, ICT Lab, Hostel, etc.)
    """
    name = models.CharField(max_length=120, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


# ---------- Base Institution ----------

class Institution(TimeStampedModel):
    """
    Abstract base with fields common to all levels.
    """
    TYPE_CHOICES = [
        ('other', 'Other'),
        ('daycare', 'Day Care'),
        ('primary', 'Primary School'),
        ('olevel', 'Ordinary level'),
        ('advance', 'Advanced level'),
        ('college', 'College'),
        ('university', 'University'),
    ]
    
    STAY_TYPE=[
        ('day','Day'),
        ('boarding','Boarding'),
        ('all','All')
    ]
    
    GENDER_EX=[
        ('boys','Boys'),
        ('girls','Girls'),
        ('mix','Mixture')
    ]
    
    
    
    regno = models.CharField(max_length=100, blank=True, null=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='other')
    stay = models.CharField(max_length=10, choices=STAY_TYPE, default='all')
    gender = models.CharField(max_length=10, choices=GENDER_EX, default='mix')
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    about = models.TextField(blank=True, null=True)
    motto = models.CharField(max_length=255, blank=True, null=True)
    fee_max=models.FloatField(max_length=30,blank=True,null=True)
    fee_min=models.FloatField(max_length=30,blank=True,null=True)

    # Location
    address = models.CharField(max_length=255, blank=True, null=True)
    region = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    ward = models.CharField(max_length=100, blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)

    # Contact
    website = models.URLField(blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=30, blank=True, null=True)

    # Media
    logo = models.ImageField(upload_to='institutions/logos/', blank=True, null=True)
    banner = models.ImageField(upload_to='institutions/banners/', blank=True, null=True)

    # Meta
    established_year = models.PositiveIntegerField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)  
    owner = models.ForeignKey(
        MyUser, on_delete=models.SET_NULL,
        related_name="institutions_owned",
        blank=True, null=True
    )

    def __str__(self):
        return self.name
    
    
class InstView(models.Model):
    inst = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name="views")
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
   
      
    def __str__(self):
        return f"View by {self.user} on {self.inst}"




class InstitutionCurriculum(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name="curriculums")
    curriculum = models.ForeignKey(Curriculum, on_delete=models.CASCADE)


class InstitutionProgram(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name="programs")
    name = models.CharField(null=True,blank=True,max_length=300)
    duration = models.PositiveSmallIntegerField(blank=True, null=True) 
    type=models.CharField(null=True,blank=True,max_length=20)
    fee = models.FloatField(max_length=30,blank=True,null=True)
    delivery_mode=models.CharField(max_length=20,blank=True,null=True)
    description = models.TextField(null=True,blank=True)
    
    


class InstitutionService(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name="services")
    service = models.ForeignKey(Service, on_delete=models.CASCADE)


class InstitutionAcademicDetail(models.Model):
    institution = models.OneToOneField(Institution, on_delete=models.CASCADE, related_name="academic_detail")
    capacity = models.PositiveIntegerField(blank=True, null=True)
    age_range = models.CharField(max_length=50, blank=True, null=True)  # daycare
    grades_offered = models.CharField(max_length=50, blank=True, null=True)  # primary
    student_population = models.PositiveIntegerField(blank=True, null=True)  # university
    accreditation = models.CharField(max_length=150, blank=True, null=True)  # university


class InstitutionSubject(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name="subjects")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("institution", "subject")




class InstitutionCombination(models.Model):
    institution = models.ForeignKey(
        Institution,
        on_delete=models.CASCADE,
        related_name="combinations"
    )
    combination = models.CharField(max_length=100)  # one combo per row

    class Meta:
        unique_together = ("institution", "combination")  # prevent duplicates per institution

    def __str__(self):
        return f"{self.institution.name} - {self.combination}" 
    
    

class Event(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name="events")
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_date_time = models.DateTimeField()

    def __str__(self):
        return f"{self.name} ({self.institution.name})"



class DownloadMaterial(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name="materials")
    title = models.CharField(null=True,blank=True,max_length=50)
    material = models.FileField(upload_to="materials/")
    
    def __str__(self):
        return f"{self.title} by institution {self.institution}"
    
    
    
class GalleryItem(models.Model):
    institution = models.ForeignKey("Institution", on_delete=models.CASCADE, related_name="gallery")
    title = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to="gallery/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title or f"Gallery item {self.id}"



class Notice(models.Model):
    institution = models.ForeignKey(Institution,on_delete=models.CASCADE, related_name="notices")
    title = models.CharField(max_length=255)
    content = models.TextField()
    start_date=models.DateTimeField()
    end_date=models.DateTimeField()
    created_at=models.DateTimeField(auto_now_add=True)
    
    def is_active(self):
        now = timezone.now()
        return self.start_date <= now <= self.end_date
    
    def __str__(self):
        return f"{self.title} ({self.institution.name})"
    
