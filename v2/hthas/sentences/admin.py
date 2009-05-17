from django.contrib import admin
from hthas.sentences.models import Article, Sentence, Author

class AuthorAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email')
    search_fields = ('first_name', 'last_name')
    
class SentenceAdmin(admin.ModelAdmin):
    list_display = ('text', 'created', 'updated')
    list_filter = ('created',)    
    ordering = ('-created',)
        
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('text','created', 'updated','sentences')
    list_filter = ('created',)    
    ordering = ('-created',)
    
admin.site.register(Author,AuthorAdmin)
admin.site.register(Sentence, SentenceAdmin)
admin.site.register(Article)