/**
 * Loader Component
 * ----------------
 * Reusable loading spinner for:
 * - API calls
 * - Page transitions
 * - Form submissions
 *
 * Props:
 * - size?: "sm" | "md" | "lg"
 * - fullScreen?: boolean
 * - text?: string
 */

export default function Loader({
  size = "md",
  fullScreen = false,
  text = "Loading...",
}) {
  const sizeMap = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-16 w-16 border-4",
  };

  const spinnerSize = sizeMap[size] || sizeMap.md;

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`rounded-full border-green-600 border-t-transparent animate-spin ${spinnerSize}`}
      />
      {text && (
        <p className="text-sm text-gray-600 font-medium">{text}</p>
      )}
    </div>
  );

    if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="w-full py-10 flex items-center justify-center">
      {spinner}
    </div>
  );
}