from django.db import models

# Create your models here.
class Author(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(blank=True)
    
    def __unicode__(self):
        return self.first_name + ' ' + self.last_name
    
class Word(models.Model):
    text = models.CharField(max_length=100)
    author = models.ForeignKey(Author)
    publication_date = models.DateField(blank=True, null=True)
    def __unicode__(self):
        return self.text

class Phrase(models.Model):
    title = models.CharField(max_length=30)
    words = models.ManyToManyField(Word)
    
    def __unicode__(self):
        return self.title

class Article(models.Model):
    title = models.CharField(max_length=100)
    phrases= models.ManyToManyField(Phrase)
    
    def __unicode__(self):
        return self.title