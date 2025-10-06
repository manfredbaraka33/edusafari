from django.db import models


class FeedbackOrHelp(models.Model):
    title = models.CharField(max_length=50)
    content = models.TextField()
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    def __str__(self):
        return f"{self.title} - {self.created_at}"
