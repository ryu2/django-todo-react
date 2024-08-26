import os
import openai

# Get your OpenAI API key from the environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_shopping_list(dish_name):
    prompt = f"Create a shopping list for {dish_name}. Return each entry in JSON format, where each entry has the following attributes: item, quantity, note. Exclude the kitchen supplies."

    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
    ])
    # import pdb;
    # pdb.set_trace()

    # Extract the content from the response
    shopping_list = response.choices[0].message.content.strip()
    return shopping_list