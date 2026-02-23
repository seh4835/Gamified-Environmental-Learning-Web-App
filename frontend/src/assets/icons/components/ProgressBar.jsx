export default function ProgressBar({
  value,
  max,
  label,
  helperText,
  color = "green",
}) {
  const percentage =
    max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  const colorMap = {
    green: "bg-green-600",
    blue: "bg-blue-600",
    amber: "bg-amber-500",
    red: "bg-red-600",
  };

  const barColor = colorMap[color] || colorMap.green;

  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {label}
          </span>
          <span className="text-xs text-gray-500">
            {value} / {max}
          </span>
        </div>
      )}

      <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>

      {helperText && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
