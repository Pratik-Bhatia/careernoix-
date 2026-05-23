#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo -e "\033[0;36mChecking prerequisites...\033[0m"

# Check for Python
if command_exists python; then
    PYTHON_CMD="python"
elif command_exists python3; then
    PYTHON_CMD="python3"
elif command_exists py; then
    PYTHON_CMD="py"
else
    echo -e "\033[0;31mError: Python is not installed or not in PATH.\033[0m"
    echo "Please install Python from https://www.python.org/downloads/"
    echo "Make sure to check 'Add Python to PATH' during installation."
    exit 1
fi

# Check for Node.js and npm
if ! command_exists npm; then
    echo -e "\033[0;31mError: npm is not installed or not in PATH.\033[0m"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "\033[0;32mPrerequisites found.\033[0m"
echo -e "\033[0;36mStarting Smart Job Matching Services...\033[0m"

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_PATH="$SCRIPT_DIR/backend"
FRONTEND_PATH="$SCRIPT_DIR/frontend"
VENV_PATH="$SCRIPT_DIR/venv"

# 1. Backend Setup & Start
echo -e "\033[0;32mConfiguring Backend...\033[0m"

# Create Virtual Environment if it doesn't exist
if [ ! -d "$VENV_PATH" ]; then
    echo "Creating Python virtual environment..."
    $PYTHON_CMD -m venv "$VENV_PATH"
fi

# 2. Frontend Setup
echo -e "\033[0;32mConfiguring Frontend...\033[0m"
cd "$FRONTEND_PATH"
if [ ! -d "node_modules" ]; then
    echo -e "\033[0;33mInstalling frontend dependencies...\033[0m"
    npm install
fi

# 3. Start Services
echo -e "\033[0;36mAll services launching...\033[0m"
echo "Backend: http://localhost:8000/docs"
echo "Frontend: http://localhost:3000"

# Function to handle cleanup on exit
cleanup() {
    echo "Stopping services..."
    if [ -n "$BACKEND_PID" ]; then kill $BACKEND_PID 2>/dev/null; fi
    if [ -n "$FRONTEND_PID" ]; then kill $FRONTEND_PID 2>/dev/null; fi
}
trap cleanup EXIT

# Start Backend in background
echo -e "\033[0;32mStarting FastAPI Server on Port 8000...\033[0m"
source "$VENV_PATH/Scripts/activate"
pip install -r "$BACKEND_PATH/requirements.txt"
cd "$BACKEND_PATH"
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

# Start Frontend in background
echo -e "\033[0;32mStarting Next.js Server on Port 3000...\033[0m"
cd "$FRONTEND_PATH"
npm run dev -- -p 3000 &
FRONTEND_PID=$!

# Wait for process to finish
wait
