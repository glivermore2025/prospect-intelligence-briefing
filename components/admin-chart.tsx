"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";

type AdminChartProps = {
  data: Array<{ date: string; reports: number }>;
};

export function AdminChart({ data }: AdminChartProps) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tickFormatter={(value) => value.slice(5)} />
          <Tooltip />
          <Area type="monotone" dataKey="reports" stroke="#9e2339" fill="#9e233933" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
