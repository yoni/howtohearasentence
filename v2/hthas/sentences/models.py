from django.db import models
import datetime

# Create your models here.
class Author(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(blank=True)
    
    def __unicode__(self):
        return self.first_name + ' ' + self.last_name

class Sentence(models.Model):
    text = models.CharField(max_length=500)
    created = models.DateTimeField()
    updated = models.DateTimeField(null=True)
    authors = models.ManyToManyField(Author)
    
    def save(self):
        if not self.id:
            self.created = datetime.datetime.now()
            self.updated = self.created
        self.updated = datetime.datetime.now()
        super(Sentence, self).save()

    def __unicode__(self):
        return self.text

class Article(models.Model):
    sentences= models.ManyToManyField(Sentence)
    created = models.DateTimeField()
    updated = models.DateTimeField(null=True)
    text = models.FilePathField(null=True)
    
    def save(self):
        if not self.id:
            self.created = datetime.datetime.now()
            self.updated = self.created
        self.updated = datetime.datetime.now()
        super(Article, self).save()
    
    def __unicode__(self):
        return self.id