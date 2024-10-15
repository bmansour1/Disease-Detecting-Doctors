from flask import Flask, jsonify, request
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

# Route to handle the form submission
@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    age = data.get('age')
    height = data.get('height')
    weight = data.get('weight')
    bloodPressure = data.get('bloodPressure')
    allergies = data.get('allergies')

    # You can process or save the data here

    return jsonify({
        "message": "Form submitted successfully",
        "age": age,
        "height": height,
        "weight": weight,
        "bloodPressure": bloodPressure,
        "allergies": allergies
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Run Flask on port 5000
