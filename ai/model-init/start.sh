#!/bin/sh
set -e

/usr/bin/ollama serve &
sleep 5

ollama pull gemma3:1b-it-qat

wait