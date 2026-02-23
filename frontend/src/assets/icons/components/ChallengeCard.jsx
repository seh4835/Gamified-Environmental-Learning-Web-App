import { useState } from "react";

export default function ChallengeCard({ challenge, onSubmit, submissionStatus }) {
  const [proofFile, setProofFile] = useState(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!proofFile && !note) {
      setError("Please upload a proof image or add a short note.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("challenge_id", challenge.id);

      if (proofFile) {
        formData.append("proof", proofFile);
      }

      if (note) {
        formData.append("note", note);
      }

      await onSubmit(challenge.id, formData);
      setSuccess(true);
    } catch (err) {
      setError("Failed to submit challenge. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {challenge.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {challenge.description}
          </p>
        </div>
        <span className="shrink-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
          +{challenge.points} points
        </span>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          Instructions
        </p>
        <p className="text-sm text-gray-700">{challenge.instructions}</p>
      </div>

      {/* Status */}
      {submissionStatus && (
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[submissionStatus]}`}
        >
          Status: {submissionStatus.charAt(0).toUpperCase() +
            submissionStatus.slice(1)}
        </div>
      )}

      {/* Proof Upload */}
      {!submissionStatus && (
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Proof (Image)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProofFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Optional Note
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Briefly describe what you did..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      )}

      {/* Feedback */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {success && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-md px-3 py-2">
          Challenge submitted successfully. Awaiting approval.
        </p>
      )}

      {/* Actions */}
      {!submissionStatus && (
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white transition
              ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }
            `}
          >
            {isSubmitting ? "Submitting..." : "Submit Proof"}
          </button>
        </div>
      )}
    </div>
  );
}