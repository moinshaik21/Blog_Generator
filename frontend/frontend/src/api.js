const API_URL = import.meta.env.VITE_API_URL;

export async function generateBlog({ topic, tone, length }) {
  const res = await fetch(`${API_URL}/generate/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, tone, length }),
  });

  const data = await res.json();

  if (!res.ok) {
    // DRF validation errors come as { field: ["message"] }
    const message =
      data.error ||
      Object.values(data).flat().join(" ") ||
      "Something went wrong";
    throw new Error(message);
  }

  return data.content;
}