import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Settings, Activity, TrendingUp, TrendingDown } from "lucide-react";

const data = [
  { time: "10:00", throughput: 1100 },
  { time: "10:05", throughput: 1240 },
  { time: "10:10", throughput: 980 },
  { time: "10:15", throughput: 1420 },
  { time: "10:20", throughput: 1150 },
  { time: "10:25", throughput: 1300 },
  { time: "10:30", throughput: 1210 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel bg-surface-container-high/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <p className="text-[11px] text-on-surface/60 font-mono mb-1">{label}</p>
        <p className="text-sm font-bold text-white flex items-center gap-2">
          Throughput:
          <span className="text-primary tracking-wide">
            {payload[0].value.toLocaleString()} req/s
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const SystemThroughputWidget = () => {
  return (
    <div className="bg-surface/50 border border-white/5 rounded-2xl p-5 mb-5 overflow-hidden shadow-inner flex flex-col group relative">
      {/* Background glow specific to widget */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10 gap-2">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 shadow-inner">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <p className="text-sm font-semibold text-white tracking-wide">
              System Throughput
            </p>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-high border border-white/5 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest leading-none">
                Live
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,1)]" />
            <span className="hidden sm:inline">Operational</span>
          </span>
          <button className="text-on-surface/50 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 relative z-10 mt-2">
        <div>
          <p className="text-[10px] sm:text-[11px] text-on-surface/50 font-medium mb-1">
            Peak
          </p>
          <div className="flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-2">
            <p className="text-sm sm:text-base font-bold text-white font-headline">
              1,420{" "}
              <span className="text-[10px] text-on-surface/40 font-normal">
                req/s
              </span>
            </p>
            <span className="flex items-center text-[10px] font-bold text-emerald-400">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12.4%
            </span>
          </div>
        </div>
        <div>
          <p className="text-[10px] sm:text-[11px] text-on-surface/50 font-medium mb-1">
            Average
          </p>
          <div className="flex items-center gap-2">
            <p className="text-sm sm:text-base font-bold text-white font-headline">
              1,200{" "}
              <span className="text-[10px] text-on-surface/40 font-normal">
                req/s
              </span>
            </p>
          </div>
        </div>
        <div>
          <p className="text-[10px] sm:text-[11px] text-on-surface/50 font-medium mb-1">
            Load
          </p>
          <div className="flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-2">
            <p className="text-sm sm:text-base font-bold text-white font-headline">
              85{" "}
              <span className="text-[10px] text-on-surface/40 font-normal">
                %
              </span>
            </p>
            <span className="flex items-center text-[10px] font-bold text-red-400">
              <TrendingDown className="w-3 h-3 mr-0.5" /> -5.2%
            </span>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="h-32 w-full relative z-10 -ml-4 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="throughputGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "rgba(255,255,255,0.4)",
                fontSize: 10,
                fontFamily: "monospace",
              }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
              width={40}
              domain={[0, "auto"]}
              orientation="right"
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "rgba(255,255,255,0.1)",
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
            />
            <Area
              type="monotone"
              dataKey="throughput"
              stroke="#8b5cf6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#throughputGradient)"
              animationDuration={1500}
              animationEasing="ease-out"
              activeDot={{
                r: 6,
                fill: "#8b5cf6",
                stroke: "#fff",
                strokeWidth: 2,
                boxShadow: "0 0 15px rgba(139,92,246,0.8)",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SystemThroughputWidget;
