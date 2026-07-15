import { Badge } from "./badge";

export type StatusBadgeType = "fail" | "success" | "progress";

interface StatusBadgeProps {
  title: string;
  type: StatusBadgeType;
}

const badgeStylesMap: Record<StatusBadgeType, { badge: string; dot: string }> =
  {
    progress: {
      badge:
        "bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60 shadow-none rounded-full",
      dot: "h-1.5 w-1.5 rounded-full bg-amber-500 mr-2",
    },
    fail: {
      badge:
        "bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500 border-red-600/60 shadow-none rounded-full",
      dot: "h-1.5 w-1.5 rounded-full bg-red-500 mr-2",
    },
    success: {
      badge:
        "bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full",
      dot: "h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2",
    },
  };

export default function StatusBadge({ title, type }: StatusBadgeProps) {
  const styles = badgeStylesMap[type];

  if (!styles) return null;

  return (
    <Badge className={styles.badge}>
      <div className={styles.dot} />
      {title}
    </Badge>
  );
}
