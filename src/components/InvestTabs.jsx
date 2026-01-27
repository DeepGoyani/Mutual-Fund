"use client";
import * as React from "react";
import { Tabs, Tab, Box, Paper } from "@mui/material";
import SipCalculator from "@/components/SipCalculator";
import LumpsumCalculator from "@/components/LumpsumCalculator";

export default function InvestTabs({ code, defaultTab = "sip" }) {
  const [tab, setTab] = React.useState(defaultTab);
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="Investment type">
        <Tab value="sip" label="SIP" />
        <Tab value="lumpsum" label="Lumpsum" />
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {tab === "sip" ? <SipCalculator code={code} /> : <LumpsumCalculator code={code} />}
      </Box>
    </Paper>
  );
}
