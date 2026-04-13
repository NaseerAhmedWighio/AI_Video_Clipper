import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "card" | "text" | "button" | "video" | "avatar";
}

export function Skeleton({ className, variant = "text" }: SkeletonProps) {
  const variants = {
    card: "h-48 rounded-2xl",
    text: "h-4 rounded-lg",
    button: "h-10 rounded-full w-32",
    video: "aspect-video rounded-xl",
    avatar: "w-10 h-10 rounded-full",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-white/10",
        variants[variant],
        className
      )}
    />
  );
}

export function VideoCardSkeleton() {
  return (
    <div className="bg-white/5 ring-1 ring-white/10 p-1.5 rounded-[2rem]">
      <div className="bg-black/40 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] rounded-[calc(2rem-0.375rem)] p-6 space-y-4">
        <Skeleton variant="video" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="flex gap-2">
          <Skeleton variant="button" className="flex-1" />
          <Skeleton variant="button" className="w-10" />
        </div>
      </div>
    </div>
  );
}

export function ShortCardSkeleton() {
  return (
    <div className="bg-white/5 ring-1 ring-white/10 p-1.5 rounded-[2rem]">
      <div className="bg-black/40 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] rounded-[calc(2rem-0.375rem)] p-6 space-y-4">
        <Skeleton className="aspect-[9/16] max-w-[280px] mx-auto" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4 mx-auto" />
          <Skeleton className="h-3 w-1/2 mx-auto" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton variant="button" className="flex-1" />
          <Skeleton variant="button" className="w-10" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white/5 ring-1 ring-white/10 p-1.5 rounded-[2rem]"
          >
            <div className="bg-black/40 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] rounded-[calc(2rem-0.375rem)] p-6 space-y-3">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
