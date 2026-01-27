"use client";
import * as React from "react";
import useSWR from "swr";
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography, TableContainer } from "@mui/material";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function ReturnsTable({ code }) {
  const { data: r1 } = useSWR(() => (code ? `/api/scheme/${code}/returns?period=1m` : null), fetcher);
  const { data: r3 } = useSWR(() => (code ? `/api/scheme/${code}/returns?period=3m` : null), fetcher);
  const { data: r6 } = useSWR(() => (code ? `/api/scheme/${code}/returns?period=6m` : null), fetcher);
  const { data: r12 } = useSWR(() => (code ? `/api/scheme/${code}/returns?period=1y` : null), fetcher);

  const rows = [
    { label: "1M", data: r1 },
    { label: "3M", data: r3 },
    { label: "6M", data: r6 },
    { label: "1Y", data: r12 },
  ];

  const fmtPct = (v) => (v == null ? "—" : `${Number(v).toFixed(2)}%`);

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Returns</Typography>
      <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 520 }}>
          <TableHead>
            <TableRow>
              <TableCell>Period</TableCell>
              <TableCell align="right">Start NAV</TableCell>
              <TableCell align="right">End NAV</TableCell>
              <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>Simple %</TableCell>
              <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>Annualized %</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.label}>
                <TableCell>{r.label}</TableCell>
                <TableCell align="right">{r.data?.startNAV ?? "—"}</TableCell>
                <TableCell align="right">{r.data?.endNAV ?? "—"}</TableCell>
                <TableCell align="right">{fmtPct(r.data?.simpleReturn)}</TableCell>
                <TableCell align="right">{fmtPct(r.data?.annualizedReturn)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {(r1?.note || r3?.note || r6?.note || r12?.note) && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Data note: Nearest NAV within ±3 days used when exact date missing.
        </Typography>
      )}
    </Paper>
  );
}
