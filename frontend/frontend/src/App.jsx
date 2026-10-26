/** @format */

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { generateBlog } from "./api";
import "./App.css";

const MoonIcon = () => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'>
    <path d='M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z' />
  </svg>
);

const SunIcon = () => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'>
    <circle cx='12' cy='12' r='4' />
    <path d='M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4' />
  </svg>
);

function getInitialTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function App() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("casual");
  const [length, setLength] = useState("short");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setContent("");
    try {
      const result = await generateBlog({ topic, tone, length });
      setContent(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='container'>
      <header className='header'>
        <button
          className='theme-toggle'
          onClick={toggleTheme}
          aria-label={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
          title={theme === "light" ? "Dark mode" : "Light mode"}>
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>

        <h1>BlogForge</h1>
        <p className='subtitle'>
          Turn any topic into a ready-to-publish blog post.
        </p>
      </header>

      <div className='card'>
        <input
          className='input'
          placeholder='Enter a blog topic...'
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && topic.trim() && !loading && handleGenerate()
          }
        />

        <div className='row'>
          <select value={tone} onChange={(e) => setTone(e.target.value)}>
            <option value='professional'>Professional</option>
            <option value='casual'>Casual</option>
            <option value='humorous'>Humorous</option>
            <option value='persuasive'>Persuasive</option>
          </select>

          <select value={length} onChange={(e) => setLength(e.target.value)}>
            <option value='short'>Short</option>
            <option value='medium'>Medium</option>
            <option value='long'>Long</option>
          </select>

          <button onClick={handleGenerate} disabled={loading || !topic.trim()}>
            {loading && <span className='spinner' />}
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {error && <p className='error'>{error}</p>}
      </div>

      {content && (
        <div className='result'>
          <div className='result-header'>
            <span>Generated post</span>
            <button className='copy-btn' onClick={handleCopy}>
              {copied ? "Copied!" : "Copy Markdown"}
            </button>
          </div>
          <div className='markdown'>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
