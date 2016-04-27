import unittest
import json
from django.test import Client
from api.models import Category


class CategoryAPITestCase(unittest.TestCase):

    def setUp(self):
        self.client = Client()
        self.url = "/api/v1/categories/"

    def test_methods(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 405)

        response = self.client.put(self.url)
        self.assertEqual(response.status_code, 405)

        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 405)


class DigsetAPITestCase(unittest.TestCase):

    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        self.url = "/api/v1/digset/"

    def test_methods(self):
        response = self.client.get(self.url)
        self.assertNotEqual(response.status_code, 405)

        response = self.client.post(self.url)
        self.assertNotEqual(response.status_code, 405)

        response = self.client.put(self.url)
        self.assertEqual(response.status_code, 405)

        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 405)

    def test_post_correct_data(self):
        categories = Category.objects.all()[0:2]
        data = dict(
            categories=[c.id for c in categories],
            date_start="2016-01-01",
            date_end="2016-03-01",
            email="test@test.ru"
        )
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 200)
        content = json.loads(response.content)

        self.assertEqual(len(content.keys()), 1)
        self.assertEqual(content.keys()[0], 'task_id')

        response = self.client.get(self.url, content)
        self.assertEqual(response.status_code, 200)

        content = json.loads(response.content)
        self.assertIn(
            content['status'].lower(),
            ['pending', 'failure', 'success']
        )
