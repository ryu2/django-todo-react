from django.test import TestCase
from django.urls import reverse
from unittest.mock import patch

# Create your tests here.

class ShoppingListViewTestCase(TestCase):
    
    def setUp(self):
        # Dynamically generates the URL (urls.py) for the view named generate-shopping-list
        self.url = reverse('generate-shopping-list')

    # The string 'todo.views.generate_shopping_list' tells the patch function 
    # which function to replace. It locates the generate_shopping_list function 
    # in the todo.views module where it is being called. 
    # @patch replaces the actual generate_shopping_list function with a Mock object 
    # for the duration of the test.
    @patch('todo.views.generate_shopping_list')
    def test_shopping_list_view(self, mock_generate_shopping_list):
        
        # Mock the generate_shopping_list function to return a fake shopping list
        mock_generate_shopping_list.return_value = [
            {"item": "beef", "quantity": "1 lb", "note": ""},
            {"item": "potato", "quantity": "3", "note": ""}
        ]

        data = {"dish_name": "beef stew"}

        # Send a POST request to the shopping_list view
        response = self.client.post(self.url, data, format='json')

        # Assert the response status code
        self.assertEqual(response.status_code, 200)

        # Assert the response data
        self.assertEqual(response.json(), {
            "shopping_list": mock_generate_shopping_list.return_value
        })

    def test_shopping_list_view_no_dish_name(self):
        # url = reverse('shopping_list')
        data = {}

        # Send a POST request to the shopping_list view without a dish name
        response = self.client.post(self.url, data, format='json')

        # Assert the response status code
        self.assertEqual(response.status_code, 400)

        # Assert the response data
        self.assertEqual(response.data, {"error": "Dish name is required"})


