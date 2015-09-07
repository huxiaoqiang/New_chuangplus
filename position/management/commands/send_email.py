from django.core.management.base import BaseCommand, CommandError
from position.models import Position
from position.views import email_resume
class Command(BaseCommand):
    help = 'send email to hr everyday!'
    def handle(self, *args, **options):
        print 'hello world'