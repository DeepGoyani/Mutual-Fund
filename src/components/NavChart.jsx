"use client";
import * as React from "react";
import useSWR from "swr";
import { LineChart } from "@mui/x-charts/LineChart";
import { ToggleButton, ToggleButtonGroup, Box } from "@mui/material";

const fetcher = (url) => fetch(url).then((r) => r.json());

function sliceByRange(series, range) {
  if (!Array.isArray(series) || series.length === 0) return [];
  const latest = series[0];
  const [dd, mm, yy] = String(latest.date).split("-").map(Number);
  const end = new Date(yy, mm - 1, dd);
  let start = new Date(end);
  switch (range) {
    case "1M": start.setMonth(start.getMonth() - 1); break;
    case "3M": start.setMonth(start.getMonth() - 3); break;
    case "6M": start.setMonth(start.getMonth() - 6); break;
    case "1Y": start.setFullYear(start.getFullYear() - 1); break;
    case "ALL": default: start = null;
  }
  return series.filter((p) => {
    const [d, m, y] = String(p.date).split("-").map(Number);
    const t = new Date(y, m - 1, d);
    return !start || t >= start;
  });
}

export default function NavChart({ code }) {
  const { data } = useSWR(() => (code ? `/api/scheme/${code}` : null), fetcher, { revalidateOnFocus: false });
  const [range, setRange] = React.useState("3M");
  const series = data?.data || [];
  const sliced = sliceByRange(series, range);
  const x = sliced.map((p) => p.date).reverse();
  const y = sliced.map((p) => parseFloat(p.nav)).reverse();

  return (
    <Box>
      <ToggleButtonGroup value={range} exclusive onChange={(_, v) => v && setRange(v)} size="small" sx={{ mb: 1 }}>
        <ToggleButton value="1M">1M</ToggleButton>
        <ToggleButton value="3M">3M</ToggleButton>
        <ToggleButton value="6M">6M</ToggleButton>
        <ToggleButton value="1Y">1Y</ToggleButton>
        <ToggleButton value="ALL">ALL</ToggleButton>
      </ToggleButtonGroup>
      <LineChart
        xAxis={[{ scaleType: "point", data: x }]}
        series={[{ data: y, label: "NAV" }]}
        height={280}
      />
    </Box>
  );
}
