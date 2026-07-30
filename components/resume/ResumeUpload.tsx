"use client";

import { useRef, useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";

export default function ResumeUpload() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    setFile(e.target.files[0]);
  }

  async function uploadResume() {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("API Response:", data);

      if (data.success) {
        setAnalysis(data.data.analysis);
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        hidden
        onChange={handleFile}
      />

      <div
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-cyan-500/40 p-16 text-center transition hover:border-cyan-400"
      >
        <Upload size={48} className="mx-auto text-cyan-400" />

        <h2 className="mt-6 text-2xl font-bold">
          Upload Resume
        </h2>

        <p className="mt-2 text-gray-400">
          PDF only (Maximum 5MB)
        </p>
      </div>

      {file && (
        <>
          <div className="mt-8 flex items-center justify-between rounded-2xl bg-slate-900/60 p-5">

            <div className="flex items-center gap-3">
              <FileText className="text-cyan-400" />

              <div>
                <p>{file.name}</p>

                <p className="text-sm text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button
              onClick={uploadResume}
              disabled={loading}
              className="rounded-xl bg-cyan-500 px-6 py-3 hover:bg-cyan-600 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Analyze Resume"
              )}
            </button>

          </div>
                    {analysis && (
            <div className="mt-8 space-y-6">

              {/* ATS Score */}
              <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/60 p-6">
                <h2 className="text-xl font-bold text-cyan-400">
                  ATS Score
                </h2>

                <p className="mt-3 text-5xl font-bold text-white">
                  {analysis.atsScore}/100
                </p>
              </div>

              {/* Summary */}
              <div className="rounded-2xl bg-slate-900/60 p-6">
                <h2 className="mb-3 text-xl font-bold">
                  Summary
                </h2>

                <p className="text-gray-300 leading-7">
                  {analysis.summary}
                </p>
              </div>

              {/* Strengths */}
              <div className="rounded-2xl bg-slate-900/60 p-6">
                <h2 className="mb-4 text-xl font-bold text-green-400">
                  Strengths
                </h2>

                <ul className="space-y-3">
                  {analysis.strengths?.map((item: string, index: number) => (
                    <li key={index}>✅ {item}</li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="rounded-2xl bg-slate-900/60 p-6">
                <h2 className="mb-4 text-xl font-bold text-red-400">
                  Weaknesses
                </h2>

                <ul className="space-y-3">
                  {analysis.weaknesses?.map((item: string, index: number) => (
                    <li key={index}>❌ {item}</li>
                  ))}
                </ul>
              </div>

              {/* Technical Skills */}
              {analysis.technicalSkills?.length > 0 && (
                <div className="rounded-2xl bg-slate-900/60 p-6">
                  <h2 className="mb-4 text-xl font-bold text-cyan-400">
                    Technical Skills
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {analysis.technicalSkills.map(
                      (item: string, index: number) => (
                        <span
                          key={index}
                          className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm"
                        >
                          {item}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Soft Skills */}
              {analysis.softSkills?.length > 0 && (
                <div className="rounded-2xl bg-slate-900/60 p-6">
                  <h2 className="mb-4 text-xl font-bold text-blue-400">
                    Soft Skills
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {analysis.softSkills.map(
                      (item: string, index: number) => (
                        <span
                          key={index}
                          className="rounded-full bg-blue-500/20 px-3 py-1 text-sm"
                        >
                          {item}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Missing Keywords */}
              <div className="rounded-2xl bg-slate-900/60 p-6">
                <h2 className="mb-4 text-xl font-bold text-yellow-400">
                  Missing Keywords
                </h2>

                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords?.map(
                    (item: string, index: number) => (
                      <span
                        key={index}
                        className="rounded-full bg-yellow-500/20 px-3 py-1 text-sm"
                      >
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Company Recommendations */}
              {analysis.companyRecommendations?.length > 0 && (
                <div className="rounded-2xl bg-slate-900/60 p-6">
                  <h2 className="mb-4 text-xl font-bold text-emerald-400">
                    Recommended Companies
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {analysis.companyRecommendations.map(
                      (item: string, index: number) => (
                        <span
                          key={index}
                          className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm"
                        >
                          {item}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* AI Suggestions */}
              <div className="rounded-2xl bg-slate-900/60 p-6">
                <h2 className="mb-4 text-xl font-bold text-violet-400">
                  AI Suggestions
                </h2>

                <ul className="space-y-3">
                  {(analysis.suggestions ||
                    analysis.improvements)?.map(
                    (item: string, index: number) => (
                      <li key={index}>🚀 {item}</li>
                    )
                  )}
                </ul>
              </div>

            </div>
          )}
        </>
      )}
    </div>
  );
}