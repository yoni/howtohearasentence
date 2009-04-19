from django.contrib import admin
from hthas.sentences.models import Author, Word, Phrase, Article

class AuthorAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email')
    search_fields = ('first_name', 'last_name')
    
class WordAdmin(admin.ModelAdmin):
    list_display = ('text', 'author', 'publication_date')
    list_filter = ('publication_date',)    
    ordering = ('-publication_date',)
    raw_id_fields = ('author',)
        
class PhraseAdmin(admin.ModelAdmin):
    filter_horizontal = ('words',)
    
admin.site.register(Author,AuthorAdmin)
admin.site.register(Word, WordAdmin)
admin.site.register(Phrase, PhraseAdmin)
admin.site.register(Article)