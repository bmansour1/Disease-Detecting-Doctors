import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
import requests
from flask_cors import CORS  # To handle CORS issues
from openai import OpenAI
from firebase import *

load_dotenv() # Load OPEN_API_KEY from .env
OPEN_API_KEY = os.getenv('OPEN_API_KEY')
client = OpenAI(api_key=OPEN_API_KEY)
PLACES_API_KEY = os.getenv('PLACES_API_KEY')

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the medical chatbot!"})

# GET, POST, and DELETE methods handling user biometrics

@app.route('/api/user/biometrics/get/<user_id>', methods=['GET'])
def get_biometrics(user_id):
    result = get_user_biometrics(user_id)
    return jsonify(result)

@app.route('/api/user/biometrics/set/<user_id>', methods=['POST'])
def set_biometrics(user_id):
    user_biometrics = request.get_json()
    result = set_user_biometrics(user_id, user_biometrics)
    return jsonify({'message': result})

@app.route('/api/user/biometrics/delete/<user_id>', methods=['DELETE'])
def remove_biometrics(user_id):
    result = delete_user_biometrics(user_id)
    return jsonify({'message': result})

# GET, POST, and DELETE methods handling user chat conversations

@app.route('/api/user/chat/get/<user_id>', methods=['GET'])
def get_chat(user_id):
    result = get_user_chat(user_id)
    return jsonify(result)

@app.route('/api/user/chat/create/<user_id>', methods=['GET', 'POST'])
def create_chat(user_id):
    # Get user biometrics for the first prompt
    user_biometrics = get_user_biometrics(user_id)
    user_input = request.get_json()

    prompt = f'''
                I am an individual who is:
                Gender: {user_biometrics["gender"]}
                Race: {user_biometrics["race"]}
                Age: {user_biometrics["age"]}
                Height: {user_biometrics["height"]}
                Weight: {user_biometrics["weight"]}
                Blood Pressure: {user_biometrics["bloodPressure"]}
                Allergies: {user_biometrics["allergies"]}
                {user_input["input"]}
            '''

    def generate():
        # Create a stream to capture and output the AI's response
        openai_response = ""

        stream = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{
                "role": "user", 
                "content": prompt
                }],
            stream = True
        )

        # Iterate chunk by chunk, saving and yielding AI response
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                openai_response += chunk.choices[0].delta.content
                yield(chunk.choices[0].delta.content)

        # Save the user prompt and AI response
        chat_log = {
            "log": f'User: {prompt}\nAI: {openai_response}'
        }
        add_user_chat(user_id, chat_log)
        
    return generate(), {"Content-Type": "text/plain"}

@app.route('/api/user/chat/add/<user_id>', methods=['GET', 'PUT'])
def add_chat(user_id):
    # Grab the chat history from the chat log
    chat_log = get_user_chat(user_id)["log"]
    user_input = request.get_json()

    prompt = f'{chat_log}\nUser: {user_input["input"]}'

    def generate():
        # Create a stream to capture and output the AI's response
        openai_response = ""

        stream = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{
                "role": "user", 
                "content": prompt
                }],
            stream = True
        )

        # Iterate chunk by chunk, saving and yielding AI response
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                openai_response += chunk.choices[0].delta.content
                yield(chunk.choices[0].delta.content)

        # Save the user prompt and AI response
        chat_log = {
            "log": f'{prompt}\nAI: {openai_response}'
        }
        edit_user_chat(user_id, chat_log)
        
    return generate(), {"Content-Type": "text/plain"}

@app.route('/api/user/chat/delete/<user_id>', methods=['DELETE'])
def remove_user_chat(user_id):
    result = delete_user_chat(user_id)
    return jsonify({'message': result})

@app.route('/api/user/doctors', methods=['POST'])
def get_nearby_doctors():
    # Extract text query from request data
    data = request.get_json()
    text_query = data["textQuery"]
    
    # Set up the request header and payload
    url = "https://places.googleapis.com/v1/places:searchText"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_API_KEY,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.priceLevel"
    }
    payload = {
        "textQuery": text_query
        # You can add further parameters for more specific results
        # "locationBias": {
        #    "circle": {
        #        "center": {
        #        "latitude": 37.7937,
        #        "longitude": -122.3965
        #        },
        #        "radius": 500.0
        #    }
        # },

        # "includedType": "doctor",
        
        # "pageSize": 5
    }
    
    # Perform the API request
    response = requests.post(url, headers=headers, json=payload)
    
    # Handle the API response
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Failed to fetch data"}), response.status_code

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Run Flask on port 5000
