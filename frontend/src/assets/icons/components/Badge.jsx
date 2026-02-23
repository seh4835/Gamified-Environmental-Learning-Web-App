import leafIcon from "../assets/icons/leaf.svg";
import trophyIcon from "../assets/icons/trophy.svg";
import badgeIcon from "../assets/icons/badge.svg";

/**
 * Badge Component
 * ---------------
 * Displays a single achievement badge.
 *
 * Props:
 * - badge: {
 *     id,
 *     name,
 *     description,
 *     required_points
 *   }
 * - earned?: boolean
 */
export default function Badge({ badge, earned = true }) {
  // Map badge types to icons (can be extended later)
  const iconMap = {
    "Green Beginner": leafIcon,
    "Eco Warrior": trophyIcon,
    "Sustainability Champion": badgeIcon,
  };

  const iconSrc = iconMap[badge.name] || badgeIcon;

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border transition
        ${
          earned
            ? "bg-green-50 border-green-200"
            : "bg-gray-50 border-gray-200 opacity-70"
        }
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <img
          src={iconSrc}
          alt={badge.name}
          className="h-10 w-10 object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h4
          className={`text-sm font-semibold ${
            earned ? "text-green-800" : "text-gray-700"
          }`}
        >
          {badge.name}
        </h4>
        <p className="text-xs text-gray-600 mt-1">
          {badge.description}
        </p>
        {badge.required_points != null && (
          <p className="mt-1 text-[11px] text-gray-500">
            Unlocks at {badge.required_points} eco-points
          </p>
        )}
      </div>

      {/* Status */}
      <div>
        {earned ? (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium bg-green-100 text-green-800">
            Earned
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium bg-gray-200 text-gray-700">
            Locked
          </span>
        )}
      </div>
    </div>
  );
}