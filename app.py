from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
import os
import requests
from pathlib import Path

# Load environment variables
load_dotenv(dotenv_path=Path('.') / '.env')

API_KEY = os.getenv("DEEPSEEK_API_KEY")
API_URL = "https://api.deepseek.com/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

developer_response = """
I was developed by Cephas Osei-Bonsu and Kwaku Mintah, two passionate science students and best friends committed to improving healthcare access through innovation.

Together, they built VITAL-GO Technologies, a forward-thinking startup focused on wearable health solutions and intelligent patient-doctor connections worldwide.

**VITAL-GO** is one of their flagship innovations — designed to deliver intelligent health support to underserved communities and beyond.

I'm proud to be part of their mission to make healthcare smarter, more accessible, and truly inclusive. 🌍💙
"""

developer_keywords = [
    "who made you", "who created you", "who built you", "who designed you",
    "who coded you", "who programmed you", "who developed you", "who is your creator"
]

# Flask app
app = Flask(__name__, template_folder='templates')

@app.route("/")
def home():
    return render_template("index.html")  # Renders the index.html file

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message", "").lower()

    if any(phrase in user_input for phrase in developer_keywords):
        return jsonify({"response": developer_response.strip()})

    data = {
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": user_input}]
    }

    try:
        response = requests.post(API_URL, headers=headers, json=data)

        if response.status_code == 200:
            content = response.json()["choices"][0]["message"]["content"]
            return jsonify({"response": content})
        else:
            return jsonify({"response": f"Error {response.status_code}: {response.text}"})
    except requests.exceptions.RequestException as e:
        return jsonify({"response": f"Error: {str(e)}"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
