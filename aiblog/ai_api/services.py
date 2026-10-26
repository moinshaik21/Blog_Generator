import os
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")


def generate_blog_post(topic: str, tone: str = "professional", length: str = "medium") -> str:
    word_targets = {"short": "300", "medium": "600", "long": "1000"}
    words = word_targets.get(length, "600")

    prompt = f"""Write a blog post about: {topic}

Requirements:
- Tone: {tone}
- Length: about {words} words
- Format: Markdown
- Include a catchy title (H1), an introduction, 3-5 sections with H2 headings, and a conclusion.
"""

    response = client.models.generate_content(model=MODEL, contents=prompt)
    return response.text