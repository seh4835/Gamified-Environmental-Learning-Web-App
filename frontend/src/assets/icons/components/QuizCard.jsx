import { useState } from "react";

/**
 * QuizCard Component
 * ------------------
 * Renders a single quiz question with options.
 * Parent component controls:
 * - current question index
 * - total questions
 * - submit handler
 *
 * Props:
 * - question: {
 *     id,
 *     question,
 *     option_a,
 *     option_b,
 *     option_c,
 *     option_d
 *   }
 * - selectedAnswer: string | null
 * - onSelect: (questionId, optionKey) => void
 * - index: number
 * - total: number
 */
export default function QuizCard({
  question,
  selectedAnswer,
  onSelect,
  index,
  total,
}) {
  const [hovered, setHovered] = useState(null);

  const options = [
    { key: "a", label: question.option_a },
    { key: "b", label: question.option_b },
    { key: "c", label: question.option_c },
    { key: "d", label: question.option_d },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">
          Question {index + 1} of {total}
        </span>
        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
          Quiz
        </span>
      </div>

      {/* Question */}
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        {question.question}
      </h2>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {options.map((opt) => {
          const isSelected = selectedAnswer === opt.key;

          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onSelect(question.id, opt.key)}
              onMouseEnter={() => setHovered(opt.key)}
              onMouseLeave={() => setHovered(null)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition
                ${
                  isSelected
                    ? "border-green-600 bg-green-50 text-green-800"
                    : hovered === opt.key
                    ? "border-gray-300 bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold border
                    ${
                      isSelected
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-500 border-gray-300"
                    }
                  `}
                >
                  {opt.key.toUpperCase()}
                </span>
                <span className="text-sm text-gray-800">{opt.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Hint */}
      <p className="mt-5 text-xs text-gray-500">
        Tip: Choose the option that best reflects sustainable practices and
        environmental awareness.
      </p>
    </div>
  );
}