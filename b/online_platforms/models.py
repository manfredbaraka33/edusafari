from django.db import models
from django.contrib.auth import get_user_model

MyUser = get_user_model()

class OnlinePlatform(models.Model):
    CATEGORY_CHOICES = [
        ("elearning", "E-Learning"),
        ("tutoring", "Tutoring"),
        ("coding", "Coding & Tech"),
        ("language", "Language Learning"),
        ("exam_prep", "Exam Prep"),
        ("general", "General Education"),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    logo = models.ImageField(upload_to="platforms/")
    link = models.URLField()
    is_affiliate = models.BooleanField(default=False)
    affiliate_link = models.URLField(blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class PlatformComment(models.Model):
    platform = models.ForeignKey(OnlinePlatform, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    text = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user} on {self.platform}"


class PlatformVote(models.Model):
    platform = models.ForeignKey(OnlinePlatform, on_delete=models.CASCADE, related_name="votes")
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    value = models.BooleanField()  # True = upvote, False = downvote

    class Meta:
        unique_together = ("platform", "user")

    def __str__(self):
        return f"{'Up' if self.value else 'Down'} by {self.user} on {self.platform}"
