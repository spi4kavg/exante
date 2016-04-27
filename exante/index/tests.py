import unittest
from django.test import Client


class IndexPageTestCase(unittest.TestCase):

    def setUp(self):
        self.client = Client()

    def test_methods(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        response = self.client.post("/")
        self.assertEqual(response.status_code, 405)
        response = self.client.delete("/")
        self.assertEqual(response.status_code, 405)
        response = self.client.put("/")
        self.assertEqual(response.status_code, 405)
