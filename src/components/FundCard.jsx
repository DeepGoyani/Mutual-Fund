"use client";
import * as React from "react";
import Link from "next/link";
import useSWR from "swr";
import { Card, CardContent, CardActions, Typography, Chip, Button, Stack, CardActionArea } from "@mui/material";
import { useRouter } from "next/navigation";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function FundCard({ schemeCode, schemeName, fundHouse, category }) {
  const router = useRouter();
  const { data } = useSWR(() => (schemeCode ? `/api/scheme/${schemeCode}` : null), fetcher, { revalidateOnFocus: false });
  const latest = data?.data?.[0];
  const open = () => {
    if (schemeCode) router.push(`/scheme/${schemeCode}`);
  };
  return (
    <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Link href={schemeCode ? `/scheme/${schemeCode}` : "#"} style={{ flexGrow: 1 }} onClick={(e)=>{ if(!schemeCode){ e.preventDefault(); } }}>
        <CardActionArea sx={{ height: "100%" }} onClick={(e)=>{ if(!schemeCode) e.preventDefault(); }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {fundHouse || category || "Mutual Fund"}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }} gutterBottom>
              {schemeName}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              {category && <Chip size="small" label={category} />}
            </Stack>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Latest: {latest?.nav ?? "—"} on {latest?.date ?? "—"}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button onClick={open} variant="contained" size="small">Open</Button>
      </CardActions>
    </Card>
  );
}
