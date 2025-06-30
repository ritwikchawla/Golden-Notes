from django.db import models


# Create your models here.
class User(models.Model):
    fullname = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    password = models.CharField(max_length=100)
    phone = models.CharField(max_length=10)

    def __str__(self):
        return self.fullname
    

class Notes(models.Model):
    email = models.EmailField(max_length=100)
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=255)
