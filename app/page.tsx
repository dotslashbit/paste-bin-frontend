"use client";
// pages/index.js
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [format, setFormat] = useState("plain");
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
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
        <textarea
          className="w-full h-48 p-4 mt-10 text-base text-black border border-gray-300 rounded-md resize-none"
          placeholder="paste the text here..."
          value={text}
          onChange={handleChange}
        ></textarea>
      </div>
      <button className="px-6 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-700">
        Submit
      </button>
      <div className="mt-4 w-4/5">{renderFormattedText()}</div>
    </div>
  );
}
