from flask import Blueprint, request, jsonify
from flask_jwt_extended import verify_jwt_in_request
from app.config import Config
import requests

chat = Blueprint('chat', __name__)

@chat.before_request
def require_jwt():
  public_endpoints = ['chat.chat_endpoint']
  if request.endpoint not in public_endpoints:
    verify_jwt_in_request()

def _bad_request(msg="Bad request"):
  return jsonify({"message": msg}), 400

@chat.route('/', methods=['POST'])
def chat_endpoint():
  data = request.json
  if not data or 'prompt' not in data:
    return _bad_request("Missing 'prompt' in request body")

  user_prompt = data['prompt']

  payload = {
    "model": "gemma3:1b-it-qat",
    "stream": False,
    "messages": [
      {
        "role": "system",
        "content": (
          "You are a customer support representative for a a parking lot management system called Binder's Parking. "
          "This system has the ability to track vehicles arrival and departure times by their license plate number. "
          "Only logged-in users can register arrivals and departures, but all users can see the dashboard with parking lot movement history. "
          "Your task is to generate polite, helpful responses to user comments.\n\n"
          "Guidelines for responses:\n"
          "1. You should always refer to yourself as an automated assistant, never as anything else (i.e. language model, or anything)\n"
          "2. Be empathetic and acknowledge the user's feedback\n"
          "3. If the comment is positive, express appreciation\n"
          "4. If the comment is negative, apologize for the inconvenience and assure them you're working on improvements\n"
          "5. If the comment is neutral, acknowledge their observation\n"
          "6. If relevant, mention that their feedback will be considered for future updates\n"
          "7. Keep responses concise (2-4 sentences) and professional\n"
          "8. Do not make specific promises about feature implementation or timelines\n"
          "9. Do not offer to collect any personal information from the user. Any action requests (like account registration) are available on the interface."
        )
      },
      {"role": "user", "content": user_prompt}
    ],
    "max_tokens": 250,
    "temperature": 0.3
  }

  try:
    response = requests.post(Config.GEMMA_API_URL, json=payload)
    response.raise_for_status()
    result = response.json()

    assistant_message = response.json()["message"]["content"]
    return jsonify({
      "assistant": assistant_message,
      "raw_response": result
    }), 200

  except requests.RequestException as e:
    return jsonify({"message": "Error communicating with Gemma model", "error": str(e)}), 500