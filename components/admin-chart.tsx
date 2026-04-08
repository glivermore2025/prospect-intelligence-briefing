"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const data = [
  { week: "W1", briefings: 5 },
  { week: "W2", briefings: 9 },
  { week: "W3", briefings: 7 },
  { week: "W4", briefings: 12 },
  { week: "W5", briefings: 10 },
];

export function AdminChart() {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="week" />
          <Tooltip />
          <Area type="monotone" dataKey="briefings" stroke="#9e2339" fill="#9e233933" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
