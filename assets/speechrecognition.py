from flask import Flask, render_template, request, jsonify
import speech_recognition as sr
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Sample menu
menu = {
    "C1": {"name": "Cappuccino", "price": 99},
    "C2": {"name": "Latte", "price": 109},
    "C3": {"name": "Espresso", "price": 89},
    "D1": {"name": "Donut", "price": 59},
}

cart = []  # Store cart items

@app.route("/")
def home():
    return render_template("index.php")

@app.route("/add_to_cart", methods=["POST"])
def add_to_cart():
    data = request.json
    food_code = data.get("food_code")

    if food_code in menu:
        cart.append(menu[food_code])
        return jsonify({"message": f"{menu[food_code]['name']} added to cart", "cart": cart})
    else:
        return jsonify({"message": "Invalid food code"}), 400

@app.route("/get_cart", methods=["GET"])
def get_cart():
    return jsonify({"cart": cart})

@app.route("/speech_order", methods=["POST"])
def speech_order():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening for food code...")
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)

    try:
        speech_text = recognizer.recognize_google(audio).upper().strip()
        print(f"Recognized: {speech_text}")

        return jsonify({"food_code": speech_text})
    
    except sr.UnknownValueError:
        return jsonify({"error": "Could not understand"}), 400
    except sr.RequestError:
        return jsonify({"error": "Request failed"}), 500

if __name__ == "__main__":
    app.run(debug=True)
