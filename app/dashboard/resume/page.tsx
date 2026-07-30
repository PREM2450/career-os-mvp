import ResumeUpload from "@/components/resume/ResumeUpload";

export default function ResumePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Resume Analyzer
        </h1>

        <p className="mt-2 text-gray-400">
          Upload your resume and get an AI-powered ATS analysis.
        </p>
      </div>

      <ResumeUpload />
    </div>
  );
}