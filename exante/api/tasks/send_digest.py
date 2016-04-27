# -*- coding: utf-8 -*-
import os
import cStringIO as StringIO
from xhtml2pdf import pisa
from django.core.mail import EmailMessage
from django.template import loader
from django.conf import settings
from celery.task.schedules import crontab
from celery.task import task
from celery.utils.log import get_task_logger
from api import models

logger = get_task_logger(__file__)


@task
def send_digest(categories, date_start, date_end, email):
    """
        task creates digest and sends it to email
    """
    # gets category and posts
    categories = models.Category.objects.filter(pk__in=categories)
    posts = models.Post.objects\
        .filter(category__in=categories)\
        .filter(pub_date__gte=date_start, pub_date__lte=date_end)\
        .order_by('-category__name', '-pub_date')
    # gets pdf template
    tpl = loader.get_template('task/pdf.html')
    # creates context
    if settings.STATIC_ROOT:
        FONTS_ROOT = os.path.join(settings.STATIC_ROOT, 'fonts/')
    else:
        FONTS_ROOT = os.path.join(settings.BASE_DIR, 'index/static/fonts/')

    html = tpl.render({
        'categories': categories,
        'posts': posts,
        'FONTS_ROOT': FONTS_ROOT
    })

    # generated pdf
    result = StringIO.StringIO()
    doc = html.encode('UTF-8')
    pdf = pisa.pisaDocument(StringIO.StringIO(doc), dest=result)

    # gets mail template and sets context
    tpl = loader.get_template('task/mail.html')
    html = tpl.render({
        categories: [c.name for c in categories],
        date_start: date_start,
        date_end: date_end
    })

    # sends email
    message = EmailMessage(
        u'Exante - Дайджест новостей',
        html,
        settings.DEFAULT_FROM_EMAIL,
        [email]
    )
    message.content_subtype = "html"
    message.attach('digset.pdf', result.getvalue(), 'application/pdf')
    message.send()
