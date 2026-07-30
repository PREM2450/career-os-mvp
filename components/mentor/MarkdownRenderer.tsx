"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface Props {
  content: string;
}

export default function MarkdownRenderer({ content }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      
      components={{
        h1: ({ children }) => (
          <h1 className="mb-5 mt-2 text-4xl font-bold text-sky-400">
            {children}
          </h1>
        ),

        h2: ({ children }) => (
          <h2 className="mb-4 mt-6 text-3xl font-bold text-sky-400">
            {children}
          </h2>
        ),

        h3: ({ children }) => (
          <h3 className="mb-3 mt-5 text-2xl font-semibold text-sky-300">
            {children}
          </h3>
        ),

        p: ({ children }) => (
          <p className="mb-4 leading-8 text-slate-200">
            {children}
          </p>
        ),

        strong: ({ children }) => (
          <strong className="font-semibold text-white">
            {children}
          </strong>
        ),

        ul: ({ children }) => (
          <ul className="mb-5 list-disc space-y-2 pl-6 text-slate-200">
            {children}
          </ul>
        ),

        ol: ({ children }) => (
          <ol className="mb-5 list-decimal space-y-2 pl-6 text-slate-200">
            {children}
          </ol>
        ),

        li: ({ children }) => (
          <li>{children}</li>
        ),

        table: ({ children }) => (
          <div className="my-5 overflow-auto rounded-xl border border-slate-700">
            <table className="w-full">
              {children}
            </table>
          </div>
        ),

        thead: ({ children }) => (
          <thead className="bg-slate-900">
            {children}
          </thead>
        ),

        th: ({ children }) => (
          <th className="border border-slate-700 px-4 py-3 text-left text-sky-400">
            {children}
          </th>
        ),

        td: ({ children }) => (
          <td className="border border-slate-700 px-4 py-3">
            {children}
          </td>
        ),

       code({ className, children, ...props }) {
  const language = className?.replace("language-", "");

  if (language) {
    return (
      <CodeBlock
        language={language}
        code={String(children).replace(/\n$/, "")}
      />
    );
  }

  return (
    <code
      className="rounded bg-slate-900 px-2 py-1 text-green-400"
      {...props}
    >
      {children}
    </code>
  );
}
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function CodeBlock({
  language,
  code,
}: {
  language: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="my-5 overflow-hidden rounded-xl border border-slate-700">

      <div className="flex items-center justify-between bg-slate-900 px-4 py-2">

        <span className="text-sm font-medium text-slate-300">
          {language}
        </span>

        
        <button
  onClick={async () => {
    await navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }}
  className="flex items-center gap-2 rounded-lg px-3 py-1 transition hover:bg-slate-800"
>
  {copied ? (
    <>
      <Check size={16} />
      Copied
    </>
  ) : (
    <>
      <Copy size={16} />
      Copy
    </>
  )}
</button>

      </div>

      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "15px",
        }}
      >
        {code}
      </SyntaxHighlighter>

    </div>
  );
}