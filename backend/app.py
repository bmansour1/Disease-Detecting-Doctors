import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS  # To handle CORS issues
from openai import OpenAI
from firebase import get_all_users, add_user, edit_user, delete_user

load_dotenv() # Load OPEN_API_KEY from .env
OPEN_API_KEY = os.getenv('OPEN_API_KEY')
client = OpenAI(api_key=OPEN_API_KEY)

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the medical chatbot!"})

@app.route('/api/openai/test-diagnosis', methods=['GET', 'POST'])
def answer():
    # Parse the json data for each parameter
    json_data = request.get_json()
    disease = json_data["disease"]
    gender = json_data["gender"]
    race = json_data["race"]
    age = json_data["age"]
    height = json_data["height"]
    weight = json_data["weight"]
    blood_pressure = json_data["bloodPressure"]
    allergies = json_data["allergies"]

    def generate():
        # Create a stream to capture and output the AI's response
        stream = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{
                "role": "user", 
                "content": f"""\
                    In 100 words, give a risk of {disease} diagnosis for an individual who is:
                    Gender: {gender}
                    Race: {race}
                    Age: {age}
                    Height: {height}
                    Weight: {weight}
                    Blood Pressure: {blood_pressure}
                    Allergies: {allergies}
                """
                }],
            stream = True
        )

        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                yield(chunk.choices[0].delta.content)
        
    return generate(), {"Content-Type": "text/plain"}

# GET, POST, and DELETE methods handling user credentials
@app.route('/api/user/register', methods=['POST'])
def register_user():
    user_credentials = request.get_json()
    user_id = add_user(user_credentials)

    return jsonify({"user_id": user_id})

@app.route('/api/user/edit/<user_id>', methods=['POST'])
def update_user(user_id):
    updated_credentials = request.json
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Run Flask on port 5000
