from django.db import models
from django.contrib.auth import get_user_model

MyUser = get_user_model()

class TuitionCentre(models.Model):
    LEVEL_CHOICES = [
        ("primary", "Primary"),
        ("olevel", "Ordinary Level"),
        ("alevel", "Advanced Level"),
    ]
    name = models.CharField(max_length=100)
    description = models.TextField()
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    location = models.CharField(max_length=200)  # city/area
    contact = models.CharField(max_length=100, blank=True, null=True)
    logo = models.ImageField(upload_to="tuition_centres/")
    website = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name


class TuitionCentreComment(models.Model):
    centre = models.ForeignKey(TuitionCentre, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    text = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user} on {self.centre}"


class TuitionCentreVote(models.Model):
    centre = models.ForeignKey(TuitionCentre, on_delete=models.CASCADE, related_name="votes")
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    value = models.BooleanField()  # True = upvote, False = downvote

    class Meta:
        unique_together = ("centre", "user")

    def __str__(self):
        return f"{'Up' if self.value else 'Down'} by {self.user} on {self.centre}"
