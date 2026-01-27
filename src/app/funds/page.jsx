"use client";
import * as React from "react";
import useSWR from "swr";
import { AppBar, Toolbar, Typography, Container, TextField, Grid, MenuItem, Box, Button } from "@mui/material";
import FundCard from "@/components/FundCard";

const fetcher = (url) => fetch(url).then(r=>r.json());

export default function FundsPage() {
  const [q, setQ] = React.useState("");
  const [house, setHouse] = React.useState("");
  const [cat, setCat] = React.useState("");
  const [type, setType] = React.useState("");
  const [skip, setSkip] = React.useState(0);
  const [limit] = React.useState(60);
  const { data: search } = useSWR(() => `/api/funds/search?q=${encodeURIComponent(q)}&house=${encodeURIComponent(house)}&category=${encodeURIComponent(cat)}&type=${encodeURIComponent(type)}&limit=${limit}&skip=${skip}`, fetcher, { revalidateOnFocus: false });

  const { data: listAll } = useSWR(`/api/mf`, fetcher, { revalidateOnFocus: false });
  const houses = React.useMemo(() => Array.from(new Set((listAll||[]).map(x=>x.fundHouse).filter(Boolean))).sort(), [listAll]);
  const cats = React.useMemo(() => Array.from(new Set((listAll||[]).map(x=>x.category).filter(Boolean))).sort(), [listAll]);
  const types = React.useMemo(() => Array.from(new Set((listAll||[]).map(x=>x.type).filter(Boolean))).sort(), [listAll]);

  const items = search?.items || [];
  const total = search?.total || 0;
  const showing = skip + items.length;
  const hasMore = search?.hasMore;

  function applyFilters(setter) {
    return (e) => { setter(e.target.value); setSkip(0); };
  }

  return (
    <Box>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>Explore Funds</Typography>
          <TextField size="small" placeholder="Search by scheme name" value={q} onChange={(e)=>{ setQ(e.target.value); setSkip(0); }} />
          <TextField size="small" select value={house} onChange={applyFilters(setHouse)} label="Fund House" sx={{ minWidth: 180 }}>
            <MenuItem value="">All</MenuItem>
            {houses.map(h => <MenuItem key={h} value={h}>{h}</MenuItem>)}
          </TextField>
          <TextField size="small" select value={cat} onChange={applyFilters(setCat)} label="Category" sx={{ minWidth: 160 }}>
            <MenuItem value="">All</MenuItem>
            {cats.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField size="small" select value={type} onChange={applyFilters(setType)} label="Type" sx={{ minWidth: 140 }}>
            <MenuItem value="">All</MenuItem>
            {types.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3 }}>
        <div className="flex items-center justify-between mb-2 text-sm text-black/60">
          <div>Showing {showing} of {total}</div>
          <div>{q || house || cat || type ? "Filtered" : "All active"}</div>
        </div>
        <Grid container spacing={2}>
          {items.map((f) => (
            <Grid item xs={12} sm={6} md={4} key={f.schemeCode}>
              <FundCard schemeCode={f.schemeCode} schemeName={f.schemeName} fundHouse={f.fundHouse} category={f.category} />
            </Grid>
          ))}
        </Grid>
        <div className="flex justify-center py-4">
          <Button onClick={()=> setSkip(skip + limit)} disabled={!hasMore} variant="outlined">{hasMore ? "Load more" : "No more"}</Button>
        </div>
      </Container>
    </Box>
  );
}
