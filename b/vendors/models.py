from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class VendorService(models.Model):
    CATEGORY_CHOICES = [
        ("stationery", "Stationery"),
        ("furniture", "Furniture"),
        ("food", "Food & Catering"),
        ("digital", "Digital Services"),
        ("other", "Other"),
    ]

    vendor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="services")
    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    logo = models.ImageField(upload_to="vendor_services/logos/",null=True,blank=True)
    contact = models.CharField(max_length=100, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    region = models.CharField(null=True,blank=True)
    district = models.CharField(blank=True,null=True)


    def __str__(self):
        return self.name


class VendorServiceImage(models.Model):
    service = models.ForeignKey(VendorService, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="vendor_services/images/")

    def __str__(self):
        return f"Image for {self.service.name}"


class VendorServiceComment(models.Model):
    service = models.ForeignKey(VendorService, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user} on {self.service}"
    

class ServiceVote(models.Model):
    service = models.ForeignKey(VendorService, on_delete=models.CASCADE, related_name="votes")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    value = models.BooleanField()  # True = upvote, False = downvote

    class Meta:
        unique_together = ("service", "user")  # prevent multiple votes

    def __str__(self):
        return f"{'Up' if self.value else 'Down'} by {self.user} on {self.service}"
