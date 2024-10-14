from flask import Flask, jsonify
from flask_cors import CORS  # To handle CORS issues

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the medical chatbot!"})

@app.route('/api/diagnosis', methods=['GET'])
def get_diagnosis():
    # Example of a response
    diagnosis = {
        'symptoms': ['fever', 'cough'],
        'diagnosis': 'Common Cold',
        'recommendedAction': 'Rest and drink fluids'
    }
    return jsonify(diagnosis)

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Run Flask on port 5000
