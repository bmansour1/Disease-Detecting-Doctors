import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS  # To handle CORS issues
from openai import OpenAI
from firebase import *

load_dotenv() # Load OPEN_API_KEY from .env
OPEN_API_KEY = os.getenv('OPEN_API_KEY')
client = OpenAI(api_key=OPEN_API_KEY)

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the medical chatbot!"})

# GET, POST, and DELETE methods handling user credentials
@app.route('/api/user/register', methods=['POST'])
def register_user():
    user_credentials = request.get_json()
    user_id = add_user(user_credentials)

    return jsonify({"user_id": user_id})

@app.route('/api/user/edit/<user_id>', methods=['PUT'])
def update_user(user_id):
    updated_credentials = request.get_json()
    message = edit_user(user_id, updated_credentials)
    return jsonify({'message': message})

@app.route('/api/user/delete/<user_id>', methods=['DELETE'])
def remove_user(user_id):
    message = delete_user(user_id)
    return jsonify({'message': message})

@app.route('/api/user/get_all', methods=['GET'])
def get_users():
    users = get_all_users()
    return jsonify(users)

# GET, POST, and DELETE methods handling user biometrics

@app.route('/api/user/biometrics/get/<user_id>', methods=['GET'])
def get_biometrics(user_id):
    result = get_user_biometrics(user_id)
    return jsonify(result)

@app.route('/api/user/biometrics/add/<user_id>', methods=['POST'])
def add_biometrics(user_id):
    user_biometrics = request.get_json()
    result = add_user_biometrics(user_id, user_biometrics)
    return jsonify({'message': result})

@app.route('/api/user/biometrics/edit/<user_id>', methods=['PUT'])
def update_biometrics(user_id):
    updated_biometrics = request.get_json()
    result = edit_user_biometrics(user_id, updated_biometrics)
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Run Flask on port 5000
