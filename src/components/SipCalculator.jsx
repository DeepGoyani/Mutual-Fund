"use client";
import * as React from "react";
import useSWRMutation from "swr/mutation";
import { Paper, Stack, TextField, MenuItem, Button, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

async function postJson(url, { arg }) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(arg) });
  if (!res.ok) throw new Error("SIP error");
  return res.json();
}

const frequencies = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

export default function SipCalculator({ code }) {
  const [amount, setAmount] = React.useState(5000);
  const [frequency, setFrequency] = React.useState("monthly");
  const [from, setFrom] = React.useState("2020-01-01");
  const [to, setTo] = React.useState(() => new Date().toISOString().slice(0, 10));
  const { trigger, data, isMutating } = useSWRMutation(() => (code ? `/api/scheme/${code}/sip` : null), postJson);

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>SIP Calculator</Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} sx={{ mb: 2 }}>
        <TextField label="Amount" type="number" value={amount} onChange={(e)=>setAmount(Number(e.target.value))} size="small" />
        <TextField select label="Frequency" value={frequency} onChange={(e)=>setFrequency(e.target.value)} size="small" sx={{ minWidth: 160 }}>
          {frequencies.map(f => <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>)}
        </TextField>
        <TextField label="From" type="date" value={from} onChange={(e)=>setFrom(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
        <TextField label="To" type="date" value={to} onChange={(e)=>setTo(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
        <Button disabled={!code || isMutating} variant="contained" onClick={()=>trigger({ amount, frequency, from, to })}>
          {isMutating ? "Calculating..." : "Calculate Returns"}
        </Button>
      </Stack>
      {data && (
        <Paper variant="outlined" sx={{ p: 2, bgcolor: (t)=>t.palette.action.hover }}>
          <Typography variant="body2">Installments: {data.installments ?? "—"}</Typography>
          <Typography variant="body2">Total Invested: {data.totalInvested?.toLocaleString() ?? "—"}</Typography>
          <Typography variant="body2">Current Value: {data.currentValue?.toLocaleString() ?? "—"}</Typography>
          <Typography variant="body2">Absolute Return %: {data.absoluteReturn ?? "—"}</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>Annualized Return %: {data.annualizedReturn ?? "—"}</Typography>

          {Array.isArray(data.timeline) && data.timeline.length > 1 && (
            <LineChart
              xAxis={[{ scaleType: "point", data: data.timeline.map(p=>p.date) }]}
              series={[
                { data: data.timeline.map(p=>p.invested), label: "Invested" },
                { data: data.timeline.map(p=>p.value), label: "Value" },
              ]}
              height={260}
            />
          )}
        </Paper>
      )}
    </Paper>
  );
}
