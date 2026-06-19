import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/utils/cn";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  trendUp?: boolean;
}

export default function StatCard({ title, value, icon: Icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-card p-6 rounded-[32px] border border-border shadow-sm hover:shadow-xl hover:shadow-accent-500/5 transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center text-accent-500 group-hover:bg-accent-500 group-hover:text-white transition-all duration-500">
          <Icon className="w-6 h-6" />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full border",
          trendUp 
            ? "text-emerald-600 bg-emerald-50 border-emerald-100" 
            : "text-red-600 bg-red-50 border-red-100"
        )}>
          {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-xs font-black text-muted-foreground tracking-[0.2em] uppercase mb-1">{title}</p>
        <h3 className="text-3xl font-heading font-bold text-foreground">{value}</h3>
      </div>
    </div>
  );
}
