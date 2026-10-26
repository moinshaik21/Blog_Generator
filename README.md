BlogForge — AI Blog Generator

BlogForge is a full-stack web application that generates blog posts from a single topic using Google's Gemini API. Users select a writing tone and target length, preview the result as formatted Markdown, copy it with one click, and switch between light and dark themes.

Table of Contents
Features
Tech Stack
Project Structure
Prerequisites
Getting Started
Configuration
API Reference
Development Notes
Security Checklist
License
Features
Topic-based generation: produce a complete blog post from a user-provided topic.
Tone control: choose from Professional, Casual, Humorous, or Persuasive.
Length control: choose from Short, Medium, or Long.
Markdown rendering: generated content is displayed as formatted text in the browser.
One-click copy: copy the raw Markdown to the clipboard.
Theme support: toggle between light and dark modes.
REST API: a Django REST Framework backend powered by the Gemini API.
Tech Stack
Layer	Technologies
Frontend	React, Vite, React Markdown, JavaScript, CSS
Backend	Python, Django, Django REST Framework, django-cors-headers, Google Gen AI SDK (Gemini)
Database	SQLite (default local Django database)
Project Structure
Ai_Blog_Generator/
├── aiblog/                     # Django backend
│   ├── manage.py
│   ├── aiblog/                 # Project configuration
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   └── ai_api/                 # Blog generation API
│       ├── serializers.py
│       ├── services.py
│       ├── views.py
│       ├── urls.py
│       └── tests.py
└── frontend/
    └── frontend/               # React + Vite client
        ├── src/
        ├── package.json
        └── vite.config.js
Prerequisites
Python 3.11 or later
Node.js and npm
A Google Gemini API key
Getting Started

The backend and frontend run as separate processes. Use two terminal windows.

1. Backend

From the repository root:

bash
cd aiblog

Create and activate a virtual environment (recommended).

Windows (Command Prompt)

bat
py -m venv venv
venv\Scripts\activate

macOS / Linux

bash
python3 -m venv venv
source venv/bin/activate

Install the dependencies:

bash
pip install django djangorestframework django-cors-headers python-dotenv google-genai

Create a .env file at aiblog/aiblog/.env (see Configuration), then start the server from the aiblog/ directory:

bash
python manage.py runserver

The API will be available at http://127.0.0.1:8000.

2. Frontend

In a second terminal:

bash
cd frontend/frontend
npm install

Create a .env file at frontend/frontend/.env (see Configuration), then start the development server:

bash
npm run dev

Open the URL printed by Vite (typically http://localhost:5173).

Note: Vite reads environment variables at startup. Restart npm run dev after changing the frontend .env file.

Configuration
Backend — aiblog/aiblog/.env
Variable	Description	Example
GEMINI_API_KEY	Your Google Gemini API key	your_gemini_api_key_here
GEMINI_MODEL	Gemini model used for generation	gemini-3.5-flash-lite
env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash-lite
Frontend — frontend/frontend/.env
Variable	Description	Example
VITE_API_URL	Backend API base URL (must include the /api path)	http://127.0.0.1:8000/api
env
VITE_API_URL=http://127.0.0.1:8000/api

Important: Replace the placeholder API key with your own. Keep .env files private and never commit them to source control.

API Reference
Generate a blog post

POST /api/generate/

Request body

json
{
  "topic": "How artificial intelligence is changing education",
  "tone": "professional",
  "length": "medium"
}
Field	Type	Allowed values	Required	Default
topic	string	Any non-empty text, up to 300 characters	Yes	—
tone	string	professional, casual, humorous, persuasive	No	professional
length	string	short, medium, long	No	medium

Example request

bash
curl -X POST http://127.0.0.1:8000/api/generate/ \
  -H "Content-Type: application/json" \
  -d '{"topic": "How artificial intelligence is changing education", "tone": "professional", "length": "medium"}'

Successful response

json
{
  "content": "# Generated Blog Title\n\n..."
}

The content field contains the generated post as Markdown.

Errors

Validation errors are returned in the standard Django REST Framework format. If generation fails, the API returns an error response.

Development Notes
The frontend expects VITE_API_URL to contain the API base URL, including /api.
The backend uses SQLite for local development.
CORS is currently configured to allow the Vite development origins http://localhost:5173 and http://127.0.0.1:5173.
The Gemini model can be changed through the GEMINI_MODEL environment variable.
Security Checklist

Complete the following before publishing the repository or deploying:

 Do not commit .env files, API keys, passwords, or other secrets.
 Do not commit virtual environments, node_modules, Python cache files, or the local SQLite database.
 Ensure .gitignore rules cover the entire repository, not only individual subfolders.
 If a secret was ever committed or shared, revoke or rotate it. Deleting the file in a later commit does not remove it from Git history.
 For production, configure Django's DEBUG, ALLOWED_HOSTS, SECRET_KEY, CORS origins, and other security settings appropriately.
License

No license has been specified yet. Add a LICENSE file if you intend to distribute or reuse this project publicly.
