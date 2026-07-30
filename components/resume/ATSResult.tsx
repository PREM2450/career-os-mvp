interface ResumeResult {
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  companyRecommendations: string[];
}

export default function ATSResult({
  result,
}: {
  result: ResumeResult;
}) {
  return (
    <div className="mt-8 rounded-2xl bg-[#111827] border border-white/10 p-6">

      <h2 className="text-2xl font-bold mb-6">
        Resume Analysis
      </h2>

      <div className="flex items-center justify-center">

        <div className="h-36 w-36 rounded-full border-8 border-cyan-500 flex items-center justify-center">

          <div className="text-center">
            <div className="text-4xl font-bold">
              {result.atsScore}
            </div>

            <div className="text-gray-400">
              ATS
            </div>
          </div>

        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">

        <div>
          <h3 className="text-xl font-semibold text-green-400 mb-3">
            Strengths
          </h3>

          <ul className="space-y-2">
            {result.strengths.map((item, index) => (
              <li key={index}>
                ✅ {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-red-400 mb-3">
            Weaknesses
          </h3>

          <ul className="space-y-2">
            {result.weaknesses.map((item, index) => (
              <li key={index}>
                ❌ {item}
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div className="mt-8">

        <h3 className="text-xl font-semibold text-cyan-400 mb-3">
          Suggestions
        </h3>

        <ul className="space-y-2">
          {result.suggestions.map((item, index) => (
            <li key={index}>
              💡 {item}
            </li>
          ))}
        </ul>

      </div>

      <div className="mt-8">

        <h3 className="text-xl font-semibold text-yellow-400 mb-3">
          Recommended Companies
        </h3>

        <div className="flex flex-wrap gap-3">

          {result.companyRecommendations.map((company, index) => (
            <span
              key={index}
              className="rounded-full bg-cyan-500/20 px-4 py-2"
            >
              {company}
            </span>
          ))}

        </div>

      </div>

    </div>
  );
}