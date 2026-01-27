"use client";
import * as React from "react";
import useSWRMutation from "swr/mutation";
import { Paper, Stack, TextField, Button, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

async function postJson(url, { arg }) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(arg) });
  if (!res.ok) throw new Error("Lumpsum error");
  return res.json();
}

export default function LumpsumCalculator({ code }) {
  const [amount, setAmount] = React.useState(50000);
  const [from, setFrom] = React.useState("2020-01-01");
  const [to, setTo] = React.useState(() => new Date().toISOString().slice(0, 10));
  const { trigger, data, isMutating } = useSWRMutation(() => (code ? `/api/scheme/${code}/lumpsum` : null), postJson);

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Lumpsum Calculator</Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} sx={{ mb: 2 }}>
        <TextField label="Amount" type="number" value={amount} onChange={(e)=>setAmount(Number(e.target.value))} size="small" />
        <TextField label="From" type="date" value={from} onChange={(e)=>setFrom(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
        <TextField label="To" type="date" value={to} onChange={(e)=>setTo(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
        <Button disabled={!code || isMutating} variant="contained" onClick={()=>trigger({ amount, from, to })}>
          {isMutating ? "Calculating..." : "Calculate Returns"}
        </Button>
      </Stack>
      {data && (
        <Paper variant="outlined" sx={{ p: 2, bgcolor: (t)=>t.palette.action.hover }}>
          <Typography variant="body2">Start NAV: {data.startNAV ?? "—"} on {data.startDate ?? "—"}</Typography>
          <Typography variant="body2">End NAV: {data.endNAV ?? "—"} on {data.endDate ?? "—"}</Typography>
          <Typography variant="body2">Units: {data.units ?? "—"}</Typography>
          <Typography variant="body2">Total Invested: {data.totalInvested?.toLocaleString() ?? "—"}</Typography>
          <Typography variant="body2">Current Value: {data.currentValue?.toLocaleString() ?? "—"}</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>Absolute Return %: {data.absoluteReturn ?? "—"} • Annualized %: {data.annualizedReturn ?? "—"}</Typography>

          {Array.isArray(data.timeline) && data.timeline.length > 1 && (
            <LineChart
              xAxis={[{ scaleType: "point", data: data.timeline.map(p=>p.date) }]}
              series={[
                { data: data.timeline.map(p=>p.invested), label: "Invested" },
                { data: data.timeline.map(p=>p.value), label: "Value" },
              ]}
              height={240}
            />
          )}
        </Paper>
      )}
    </Paper>
  );
}
