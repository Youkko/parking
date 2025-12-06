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
    "model": Config.GEMMA_DEFAULT_MODEL,
    "stream": False,
    "messages": [
      {
        "role": "system",
        "content": Config.GEMMA_DEFAULT_SYSTEM_PROMPT
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