"use client";
// pages/index.js
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [format, setFormat] = useState("plain");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [expirationValue, setExpirationValue] = useState(1);
  const [expirationUnit, setExpirationUnit] = useState("minutes");

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSubmit = async () => {
    // Calculate the expiration date
    const now = new Date();
    let expirationDate;
    switch (expirationUnit) {
      case "seconds":
        expirationDate = new Date(now.getTime() + expirationValue * 1000);
        break;
      case "minutes":
        expirationDate = new Date(now.getTime() + expirationValue * 60000);
        break;
      case "hours":
        expirationDate = new Date(now.getTime() + expirationValue * 3600000);
        break;
      case "days":
        expirationDate = new Date(now.getTime() + expirationValue * 86400000);
        break;
      case "weeks":
        expirationDate = new Date(now.getTime() + expirationValue * 604800000);
        break;
      case "months":
        expirationDate = new Date(
          now.setMonth(now.getMonth() + expirationValue),
        );
        break;
      case "years":
        expirationDate = new Date(
          now.setFullYear(now.getFullYear() + expirationValue),
        );
        break;
      default:
        expirationDate = now;
    }

    // Format expirationDate to ISO 8601 with timezone offset
    const expirationISO = expirationDate.toISOString();

    // Create JSON object with data
    const data = {
      title: title,
      content: text,
      expires_at: expirationISO,
      format: format,
    };

    try {
      const response = await fetch("http://localhost:4000/v1/snippets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Success:", responseData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderFormattedText = () => {
    switch (format) {
      case "markdown":
        return (
          <div className="prose max-w-none">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        );
      case "python":
      case "java":
      case "javascript":
      case "go":
        return (
          <SyntaxHighlighter language={format} style={vscDarkPlus}>
            {text}
          </SyntaxHighlighter>
        );
      default:
        return <pre>{text}</pre>;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative w-4/5">
        <input
          className="w-full p-4 text-base text-black border border-gray-300 rounded-md"
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
        />
        <select
          className="absolute top-0 left-0 p-2 text-base bg-white border border-gray-300 rounded-md"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
        >
          <option value="plain">Plain Text</option>
          <option value="markdown">Markdown</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
          <option value="go">Go</option>
        </select>
      </div>
      <textarea
        className="w-4/5 h-96 p-4 mt-4 text-base text-black border border-gray-300 rounded-md"
        placeholder="Enter your text here..."
        value={text}
        onChange={handleTextChange}
      />
      <button
        className="px-6 py-2 mt-4 text-base text-white bg-blue-500 rounded-md"
        onClick={handleSubmit}
      >
        Submit
      </button>
      <div className="w-4/5 p-4 mt-4 text-base text-black border border-gray-300 rounded-md">
        {renderFormattedText()}
      </div>
    </div>
  );
}
