BlogForge — AI Blog Generator
A full-stack AI-powered blog writing application that generates blog posts from a topic using Google's open API. Users can select a writing tone and target length, preview generated content as formatted Markdown, copy the raw Markdown with one click, and switch between light and dark themes.
Architecture
┌────────────────────────────────┐
│        React + Vite UI         │
│      frontend/frontend/        │
│                                │
│  Topic | Tone | Length         │
│  Markdown Preview | Copy       │
│  Light / Dark Theme            │
└───────────────┬────────────────┘
                │ HTTP / JSON
                ▼
┌────────────────────────────────┐
│       Django REST API          │
│          aiblog/               │
│                                │
│  Request Validation            │
│  Blog Generation Endpoint      │
│  Error Handling                │
└───────────────┬────────────────┘
                │ Google Gen AI SDK
                ▼
┌────────────────────────────────┐
│          Open API              │
│                                │
│  Topic + Tone + Length         │
│              │                 │
│              ▼                 │
│      Generated Blog Markdown   │
└────────────────────────────────┘
Request flow
1. The user enters a blog topic and selects a tone and length in the React interface.
2. The frontend sends a JSON request to the Django REST API.
3. The backend validates the request and calls the open API using a server-side API key.
4. The backend returns the generated Markdown content to the frontend.
5. The frontend renders the content, allowing the user to copy the Markdown or change the theme.
Key Features
- Topic-Based Generation: Generate a blog post from a user-provided topic.
- Tone Control: Choose Professional, Casual, Humorous, or Persuasive writing.
- Length Control: Choose Short, Medium, or Long output.
- Markdown Preview: Display generated content as formatted Markdown in the browser.
- One-Click Copy: Copy the generated raw Markdown to the clipboard.
- Theme Support: Switch between light and dark themes.
- REST API: Use a Django REST Framework endpoint for blog generation.
- Configurable open Model: Select the model through the open_MODEL environment variable.
- Local Development: Run the React frontend and Django backend independently.
Technology Stack
Component	Technology
Frontend	React, Vite, JavaScript, CSS
Markdown Rendering	React Markdown
Backend API	Python, Django, Django REST Framework
AI Integration	Google Gen AI SDK, open API
Configuration	python-dotenv, environment variables
Database	SQLite (Django default; generation flow may not require persistent storage)
Development Server	Vite, Django development server
Version Control	Git, GitHub


Project Structure
Ai_Blog_Generator/
├── aiblog/                         # Django backend
│   ├── manage.py
│   ├── aiblog/                     # Django project configuration
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   ├── wsgi.py
│   │   └── .env                    # Local environment variables (do not commit)
│   └── ai_api/                     # Blog generation API
│       ├── serializers.py
│       ├── services.py
│       ├── views.py
│       ├── urls.py
│       └── tests.py
└── frontend/
    └── frontend/                   # React + Vite client
        ├── src/
        ├── package.json
        ├── vite.config.js
        └── .env                    # Frontend environment variables (do not commit)
Note: Update this tree if your actual repository contains additional files or uses different paths.
Prerequisites
Before running the application, make sure you have:
- Python 3.11 or later.
- Node.js and npm.
- A Google open API key.
- Git (optional, for version control).
1. Configure the Backend
From the repository root, open a terminal and enter the backend directory:
cd aiblog
Create and activate a virtual environment
Windows — Command Prompt
py -m venv venv
venv\Scripts\activate
macOS / Linux
python3 -m venv venv
source venv/bin/activate
Install dependencies
pip install django djangorestframework django-cors-headers python-dotenv google-genai
If your repository includes a backend requirements.txt, prefer installing from it:
pip install -r requirements.txt
Configure environment variables
Create a .env file at aiblog/aiblog/.env:
open_API_KEY=your_open_api_key_here
open_MODEL=open-3.5-flash-lite
Replace the placeholder with your own open API key. Confirm that the configured model is available to your Google AI project; model availability and names can change.
Run the backend
From the aiblog/ directory:
python manage.py runserver
The local API should be available at:
http://127.0.0.1:8000
2. Configure the Frontend
Open a second terminal and navigate to the React application:
cd frontend/frontend
Install dependencies
npm install
Configure the API URL
Create a .env file at frontend/frontend/.env:
VITE_API_URL=http://127.0.0.1:8000/api
VITE_API_URL should include the /api path expected by the frontend.
Run the frontend
npm run dev
Open the local URL printed by Vite, usually:
http://localhost:5173
Important: Restart the Vite development server after changing frontend environment variables.
3. Configuration Reference
Backend — aiblog/aiblog/.env
Variable	Description	Example
open_API_KEY	Secret key used by the backend to access open	your_open_api_key_here
open_MODEL	open model used to generate blog content	open-3.5-flash-lite


Frontend — frontend/frontend/.env
Variable	Description	Example
VITE_API_URL	Base URL for the backend API, including /api	http://127.0.0.1:8000/api


Environment variable names and defaults must match the application's implementation. Never place the open API key in a VITE_ variable or frontend code, because frontend variables are exposed to the browser.
4. API Reference
Generate a blog post
Endpoint
POST /api/generate/
Content-Type: application/json
Request body
{
  "topic": "How artificial intelligence is changing education",
  "tone": "professional",
  "length": "medium"
}
Field	Type	Allowed values	Required	Default
topic	String	Non-empty text, up to 300 characters	Yes	—
tone	String	professional, casual, humorous, persuasive	No	professional
length	String	short, medium, long	No	medium


Example using cURL
curl -X POST http://127.0.0.1:8000/api/generate/ \
  -H "Content-Type: application/json" \
  -d '{"topic":"How artificial intelligence is changing education","tone":"professional","length":"medium"}'
Successful response
{
  "content": "# Generated Blog Title\n\nGenerated blog content in Markdown..."
}
The content field contains the generated blog post as Markdown.

Error handling
- Invalid request fields should return validation errors from Django REST Framework.
- AI provider, network, or configuration failures should return an appropriate error response.
- The exact HTTP status codes and error response shape depend on the implemented view and service logic.
5. Development Notes
- Run the backend and frontend in separate terminals during local development.
- The frontend expects VITE_API_URL to include /api.
- The backend uses SQLite as Django's default local database. The blog-generation flow may not need database persistence unless the project adds saved posts, users, or history.
- CORS is configured for the Vite development origins http://localhost:5173 and http://127.0.0.1:5173; verify the Django settings before deployment.
- open model selection is controlled by open_MODEL if the backend reads that variable as configured.
- Keep the open API key on the backend. Requests to the AI provider should be made by the Django service, not directly from the browser.
- Generated content quality, length, and formatting may vary by model and prompt.
6. Troubleshooting
Issue	Recommended Action
Backend does not start	Activate the virtual environment, install dependencies, and check Django settings and URL configuration.
Frontend cannot reach the API	Verify VITE_API_URL, confirm Django is running, and check the browser network console.
CORS error	Ensure the frontend origin is included in the backend's CORS configuration.
open authentication fails	Verify open_API_KEY is set in the backend environment and is valid.
open model error	Check that open_MODEL names a model available to your API project.
Generation returns an error	Inspect Django terminal logs and the backend's AI service error handling.
Markdown is displayed as plain text	Check the React Markdown component and the response's content field.
Copy button does not work	Verify clipboard permissions and that the page is served from a supported secure context.
Environment changes have no effect	Restart the relevant Django or Vite process after changing environment variables.


7. Security Checklist
Before publishing or deploying the project:
- [ ] Do not commit .env files, API keys, passwords, or other secrets.
- [ ] Ensure .gitignore covers environment files, virtual environments, node_modules, Python caches, and local database files where appropriate.
- [ ] Keep the open API key exclusively on the backend.
- [ ] If a secret has ever been committed or exposed, revoke or rotate it. Removing it in a later commit does not erase it from Git history.
- [ ] For production, configure Django's DEBUG, ALLOWED_HOSTS, SECRET_KEY, CORS origins, and other security settings appropriately.
- [ ] Use HTTPS for deployed frontend-to-backend traffic.
- [ ] Add appropriate rate limiting, request validation, and usage controls to reduce abuse and unexpected AI API costs.
- [ ] Avoid returning internal exception details, API keys, or provider secrets to clients.
- [ ] Review generated content before publishing it, especially for factual accuracy and citations.
8. Deployment Notes
The application is currently documented for local development. Before deploying:
1. Deploy the Django API to a Python-compatible hosting provider.
2. Configure open_API_KEY, open_MODEL, and Django production settings in the hosting provider's environment configuration.
3. Configure the allowed frontend origin in Django CORS settings.
4. Build and deploy the React frontend to a static hosting provider.
5. Set the frontend's VITE_API_URL to the deployed backend's /api base URL and rebuild the frontend.
6. Test generation, error handling, CORS, and secret handling in the deployed environment.
Hosting providers, build commands, and start commands are intentionally not prescribed here because they depend on your chosen deployment platform and repository configuration.
9. Summary
BlogForge turns a topic into a formatted blog draft through a React interface, a Django REST API, and Google's open API. Users can tailor the writing tone and length, preview the result as Markdown, copy the content, and switch themes.

The frontend manages the writing experience, the Django backend validates requests and calls open, and the open API generates the blog content. Keeping provider credentials on the backend helps protect the API key.
Project: BlogForge — AI Blog Generator
Frontend: React + Vite
Backend: Django REST Framework
AI Provider: open API
Local Database: SQLite (Django default)
