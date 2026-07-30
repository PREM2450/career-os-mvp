import ResumeUpload from "@/components/resume/ResumeUpload";

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-[#070B17] text-white p-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          AI Resume Analyzer
        </h1>

        <p className="text-gray-400 mb-8">
          Upload your resume and get an AI-powered ATS analysis.
        </p>

        <ResumeUpload />

      </div>
    </div>
  );
}