import { Typography, Container, Grid, Paper, Stack, Chip } from "@mui/material";
import NavChart from "@/components/NavChart";
import ReturnsTable from "@/components/ReturnsTable";
import SipCalculator from "@/components/SipCalculator";
import { headers } from "next/headers";

async function fetchScheme(code) {
  const h = headers();
  const proto = h.get("x-forwarded-proto") || "http";
  const host = h.get("host");
  const base = process.env.NEXT_PUBLIC_BASE_URL || (host ? `${proto}://${host}` : "http://localhost:3000");
  const res = await fetch(`${base}/api/scheme/${code}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function SchemePage({ params }) {
  const { code } = await params;
  const scheme = await fetchScheme(code);
  if (!scheme) {
    return (
      <Container sx={{ py: 4 }}>
        <Paper variant="outlined" sx={{ p: 3 }}>Invalid or unknown scheme code.</Paper>
      </Container>
    );
  }
  const meta = scheme.meta || {};
  const latest = scheme.data?.[0];

  return (
    <Container sx={{ py: 4 }}>
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{meta.scheme_name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} component="div">
          Code: <Chip size="small" label={meta.scheme_code} sx={{ ml: 0.5 }} />{latest ? ` • Latest ${latest.nav} on ${latest.date}` : ""}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {meta.fund_house && <Chip size="small" label={meta.fund_house} />}
          {meta.scheme_type && <Chip size="small" label={meta.scheme_type} />}
          {meta.scheme_category && <Chip size="small" label={meta.scheme_category} />}
        </Stack>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>NAV Chart</Typography>
            <NavChart code={meta.scheme_code} />
          </Paper>
          <ReturnsTable code={meta.scheme_code} />
        </Grid>
        <Grid item xs={12} md={4}>
          <SipCalculator code={meta.scheme_code} />
        </Grid>
      </Grid>
    </Container>
  );
}
