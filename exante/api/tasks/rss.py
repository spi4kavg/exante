# -*- coding: utf-8 -*-
import urllib2
from dateutil import parser
from lxml import etree
from celery.task.schedules import crontab
from celery.decorators import periodic_task
from celery.utils.log import get_task_logger
from api.models import Category, Post


logger = get_task_logger(__file__)


@periodic_task(run_every=(crontab(minute='*/2')), name="rss_parser")
def rss_parser():
    try:
        content = urllib2.urlopen("https://lenta.ru/rss").read()
    except urllib2.HTTPError:
        return False

    tree = etree.fromstring(content)
    items = tree.xpath("//item")

    for item in items:
        try:
            category = item.xpath('category/text()')[0]
            guid = item.xpath('guid/text()')[0]
            title = item.xpath('title/text()')[0]
            link = item.xpath('link/text()')[0]
            description = item.xpath('description/text()')[0]
            pub_date = parser.parse(item.xpath('pubDate/text()')[0])
        except IndexError:
            continue

        category, created = Category.objects.get_or_create(name=category)

        try:
            post = Post.objects.get(guid=guid)
        except Post.DoesNotExist:
            post = Post(guid=guid)

        post.category = category
        post.title = title
        post.link = link
        post.description = description
        post.pub_date = pub_date
        post.save()
    return True
