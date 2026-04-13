import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white/5 ring-1 ring-white/10 p-1.5 rounded-[2rem] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
        hover &&
          "hover:ring-white/20 hover:bg-white/8 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]",
        className
      )}
    >
      <div className="bg-black/40 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] rounded-[calc(2rem-0.375rem)] p-6">
        {children}
      </div>
    </div>
  );
}

export function CardMinimal({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white/5 ring-1 ring-white/10 p-1 rounded-[1.5rem]",
        className
      )}
    >
      <div className="bg-black/20 backdrop-blur-xl rounded-[calc(1.5rem-0.25rem)] p-4">
        {children}
      </div>
    </div>
  );
}
