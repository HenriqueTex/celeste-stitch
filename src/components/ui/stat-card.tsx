import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Skeleton } from "./skeleton";

interface StatCardProps {
  title: string;
  total: string;
  success: number;
  outdated: string;
}

function getPercentage(value: number, total: number) {
  if (total === 0) return 0;
  return parseFloat(((value / total) * 100).toFixed(2));
}

function getBarColor(percentage: number) {
  if (percentage >= 90) return "bg-emerald-500";
  if (percentage >= 70) return "bg-amber-500";
  return "bg-red-500";
}

function getTextColor(percentage: number) {
  if (percentage >= 90) return "text-emerald-500";
  if (percentage >= 70) return "text-amber-500";
  return "text-red-500";
}

function ProgressRow({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percentage = getPercentage(value, total);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${getTextColor(percentage)}`}>
            {percentage}%
          </span>
          <span className="text-muted-foreground text-xs">
            ({value}/{total})
          </span>
        </div>
      </div>
      <div className="bg-secondary h-2 w-full rounded-full">
        <div
          className={`h-full rounded-full transition-all ${getBarColor(
            percentage,
          )}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function StatCard({ title, total, success, outdated }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Total Pontos</span>
          <span className="text-xl font-bold">{total}</span>
        </div>
        <ProgressRow label="Sucesso" value={success} total={parseInt(total)} />
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            Não sincronizados
          </span>
          <span className="text-sm font-semibold text-red-500">{outdated}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-8" />
        </div>
      </CardContent>
    </Card>
  );
}
