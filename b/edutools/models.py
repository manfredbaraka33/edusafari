from django.db import models
from django.contrib.auth import get_user_model

MyUser = get_user_model()


class EduTool(models.Model):
    LEVEL_CHOICES = [
        ("daycare", "Daycare"),
        ("primary", "Primary"),
        ("olevel", "Ordinary Level"),
        ("alevel", "Advanced Level"),
        ("college", "College"),
        ("university", "University"),
    ]
    CATEGORY_CHOICES = [
        ("study", "Study & Notes"),
        ("productivity", "Productivity"),
        ("creativity", "Creativity & Design"),
        ("career", "Career & Skills"),
        ("teacher", "Teacher Tools"),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    logo = models.ImageField(upload_to="tools/")
    link = models.URLField()
    is_affiliate = models.BooleanField(default=False)
    affiliate_link = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name


class EduToolComment(models.Model):
    tool = models.ForeignKey(EduTool, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    text = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user} on {self.tool}"


class EduToolVote(models.Model):
    tool = models.ForeignKey(EduTool, on_delete=models.CASCADE, related_name="votes")
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    value = models.BooleanField()  # True = upvote, False = downvote

    class Meta:
        unique_together = ("tool", "user")  # prevent multiple votes

    def __str__(self):
        return f"{'Up' if self.value else 'Down'} by {self.user} on {self.tool}"
