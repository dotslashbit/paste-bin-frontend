"use client";
// pages/index.js
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function Home() {
  const [format, setFormat] = useState("plain");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [highlight, setHighlight] = useState(false);
  const [expirationValue, setExpirationValue] = useState(1);
  const [expirationUnit, setExpirationUnit] = useState("minutes");

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSubmit = async () => {
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

    const expirationISO = expirationDate.toISOString();

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
    if (!highlight) {
      return (
        <textarea
          className={`w-full h-full p-4 text-base bg-white text-black border border-gray-300 rounded-md resize-none`}
          value={text}
          onChange={handleTextChange}
        />
      );
    }

    const renderers = {
      // Customize rendering for math components
      inlineMath: ({ value }) => <InlineMath math={value} />,
      math: ({ value }) => <BlockMath math={value} />,
    };

    switch (format) {
      case "markdown":
        return (
          <div className="prose max-w-none p-4 border border-gray-300 rounded-md bg-white text-black h-full overflow-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              components={renderers}
            >
              {text}
            </ReactMarkdown>
          </div>
        );
      case "python":
      case "java":
      case "javascript":
      case "go":
        return (
          <SyntaxHighlighter
            language={format}
            style={vscDarkPlus}
            className="h-full overflow-auto p-4 bg-black text-white border border-gray-300 rounded-md"
          >
            {text}
          </SyntaxHighlighter>
        );
      default:
        return (
          <textarea
            className={`w-full h-full p-4 text-base bg-white text-black border border-gray-300 rounded-md resize-none`}
            value={text}
            onChange={handleTextChange}
          />
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex justify-between w-4/5 mb-4">
        <input
          className="w-full p-4 text-base text-black border border-gray-300 rounded-md mr-2"
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
        />
        <select
          className="p-2 text-base text-black bg-white border border-gray-300 rounded-md"
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
      <div className="flex justify-end w-4/5 mb-4 text-black">
        <label htmlFor="highlight-toggle" className="mr-2">
          Highlight
        </label>
        <button
          id="highlight-toggle"
          onClick={() => setHighlight(!highlight)}
          className={`p-2 border rounded ${highlight ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
        >
          {highlight ? "On" : "Off"}
        </button>
      </div>
      <div className="flex w-4/5 h-96">
        <textarea
          className="w-1/2 h-full p-4 text-base text-black border border-gray-300 rounded-md resize-none"
          placeholder="Enter your text here..."
          value={text}
          onChange={handleTextChange}
        />
        <div className="w-1/2 h-full p-4 ml-2 bg-white text-black border border-gray-300 rounded-md resize-none overflow-auto">
          {renderFormattedText()}
        </div>
      </div>
      <div className="flex items-center mt-4 text-black">
        <input
          type="number"
          className="w-20 p-2 text-base border border-gray-300 rounded-md"
          value={expirationValue}
          onChange={(e) => setExpirationValue(e.target.value)}
        />
        <select
          className="ml-2 p-2 text-base bg-white border border-gray-300 rounded-md"
          value={expirationUnit}
          onChange={(e) => setExpirationUnit(e.target.value)}
        >
          <option value="seconds">Seconds</option>
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
          <option value="days">Days</option>
          <option value="weeks">Weeks</option>
          <option value="months">Months</option>
          <option value="years">Years</option>
        </select>
      </div>
      <button
        className="px-6 py-2 mt-4 text-base text-white bg-blue-500 rounded-md hover:bg-blue-700"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}
