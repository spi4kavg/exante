from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, db_index=True, unique=True)

    def __str__(self):
        return self.name

    def __unicode__(self):
        return self.__str__()

    class Meta:
        ordering = ['-name']


class Post(models.Model):
    category = models.ForeignKey(Category)
    guid = models.CharField(max_length=300, db_index=True, unique=True)
    title = models.CharField(max_length=300)
    link = models.CharField(max_length=300)
    description = models.TextField()
    pub_date = models.DateTimeField()

    def __str__(self):
        return self.title

    def __unicode__(self):
        return self.__str__()

    class Meta:
        ordering = ['-pub_date']
