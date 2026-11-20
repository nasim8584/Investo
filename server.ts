import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { financialProducts } from './src/data/financialProducts.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const FALLBACK_PULSE = [
  {
    title: "Bangladesh Bank Policy Rate Anchored at 10.00%",
    summary: "Entering mid-Q4 2026, Bangladesh Bank sustains its anti-inflationary monetary policy stance with the benchmark repo rate held at 10.00% (SLF 11.50%, SDF 8.50%), keeping commercial bank FDR yields competitive at 10.50% - 12.00% across scheduled lenders.",
    impact: "Retail investors can lock in peak multi-year FDR and DPS yields across premier private commercial banks.",
    category: "Policy"
  },
  {
    title: "Banking Governance & Restructuring",
    summary: "Bangladesh Bank's strengthened oversight, liquidity mechanisms through the Islamic Banks Liquidity Facility (IBLF), and independent board governance restore depositor stability across all scheduled lenders.",
    impact: "Enhanced depositor confidence and competitive profit-sharing ratios on Mudaraba and conventional term deposits.",
    category: "Banking"
  },
  {
    title: "National Savings & UPension Automation",
    summary: "Automated BEFTN/NPSB coupon settlements for Sanchaypatra (up to 11.76% p.a.) and real-time contribution tracking on the Universal Pension Scheme (UPension) portal streamline retail wealth management.",
    impact: "Direct digital crediting of monthly profits and retirement annuities without branch visits.",
    category: "Market"
  }
];

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Routes
const GEMINI_MODELS = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];

app.get('/api/market-pulse', async (req, res) => {
  if (!aiClient) {
    return res.json({ pulse: FALLBACK_PULSE, isFallback: true });
  }

  for (const model of GEMINI_MODELS) {
    try {
      const response = await aiClient.models.generateContent({
        model,
        contents: "Analyze the current financial landscape in Bangladesh (Scenario date: November 2026). Provide 3 critical, high-impact news updates or trends specifically for retail investors (banks, savings, mutual funds, Shariah banking). Return ONLY a JSON object with a 'pulse' key containing an array of objects with keys: title, summary, impact, category (e.g., Banking, Policy, Shariah, Market).",
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{ "pulse": [] }';
      const data = JSON.parse(text);
      if (data.pulse && Array.isArray(data.pulse) && data.pulse.length > 0) {
        return res.json({ pulse: data.pulse, isFallback: false, modelUsed: model });
      }
    } catch (err: any) {
      console.warn(`Market pulse failed on ${model}:`, err.message || err.status);
    }
  }

  return res.json({ pulse: FALLBACK_PULSE, isFallback: true });
});

// Dynamic Local Advisory Engine for when all external AI models are inaccessible or rate-limited
function generateLocalAdvisory(message: string, mode: 'quick' | 'comprehensive' | 'shariah' = 'comprehensive') {
  const query = message.toLowerCase();
  const isShariahQuery = query.includes('islam') || query.includes('shariah') || query.includes('halal') || query.includes('mudaraba') || query.includes('sukuk') || mode === 'shariah';
  const isDPSQuery = query.includes('dps') || query.includes('monthly') || query.includes('installment');
  const isSanchaypatraQuery = query.includes('sanchay') || query.includes('govt') || query.includes('national') || query.includes('certificate');
  const isMFQuery = query.includes('mutual') || query.includes('fund') || query.includes('stock') || query.includes('capm');

  let relevantProducts = financialProducts;

  if (isShariahQuery) {
    relevantProducts = relevantProducts.filter(p => p.isShariahCompliant);
  }

  if (isSanchaypatraQuery) {
    relevantProducts = relevantProducts.filter(p => p.type === 'Sanchaypatra');
  } else if (isDPSQuery) {
    relevantProducts = relevantProducts.filter(p => p.type === 'DPS');
  } else if (isMFQuery) {
    relevantProducts = relevantProducts.filter(p => p.type === 'Mutual Fund');
  } else if (!isShariahQuery) {
    // Default to FDR or high yield
    relevantProducts = relevantProducts.filter(p => p.type === 'FDR' || p.type === 'Sanchaypatra');
  }

  if (relevantProducts.length === 0) {
    relevantProducts = financialProducts;
  }

  const topPicks = [...relevantProducts].sort((a, b) => b.interestRate - a.interestRate).slice(0, 4);

  const bestRate = topPicks[0]?.interestRate || 10.5;
  const principal100k = 100000;
  const grossAnnual = Math.round((principal100k * bestRate) / 100);
  const netWithTin = Math.round(grossAnnual * 0.90); // 10% AIT
  const netNoTin = Math.round(grossAnnual * 0.85);   // 15% AIT

  return `### 🎯 Executive Advisory: November 2026 Bangladesh Market Analysis

**Current Macroeconomic Backdrop:**
With the Bangladesh Bank policy repo rate pegged at **10.00%**, retail depositors and investors are in a prime window to lock in historically high interest and profit rates before expected future monetary easing.

---

### 📊 Top Recommended Packages (${isShariahQuery ? '100% Shariah Compliant' : 'Market Benchmark'})

${topPicks.map((p, idx) => `
**${idx + 1}. ${p.bankName} — ${p.productName}**
* **${p.isShariahCompliant ? 'Expected Profit Rate' : 'Annual Interest Rate'}:** **${p.interestRate.toFixed(2)}% p.a.** (${p.compoundFrequency || 'Compounded at maturity'})
* **Category & Tenure:** ${p.type} • ${p.tenureMonths > 0 ? `${p.tenureMonths} Months (${(p.tenureMonths / 12).toFixed(1)} Yrs)` : 'Flexible / Open'}
* **Safety & Security:** Safety Rating: \`${p.safetyRating}\` • ${p.isShariahCompliant ? 'Audited by Shariah Supervisory Committee' : 'Scheduled Commercial Bank'}
* **Key Features:** ${p.features.slice(0, 2).join(' • ')}
`).join('\n')}

---

### 🧮 Mathematical Yield & Tax Impact Breakdown (BDT 100,000 Principal)

Assuming an allocation into top benchmark rate (**${bestRate.toFixed(2)}% p.a.**):
* **Gross Annual Earnings:** **৳${grossAnnual.toLocaleString()}**
* **Net with e-TIN / Return Proof (10% AIT):** **৳${netWithTin.toLocaleString()}** (~৳${Math.round(netWithTin / 12).toLocaleString()}/month)
* **Net without Return Proof (15% AIT):** **৳${netNoTin.toLocaleString()}** (~৳${Math.round(netNoTin / 12).toLocaleString()}/month)
* **Tax Optimization Tip:** Always submit your updated Income Tax Return Acknowledgement Slip to your bank branch to save the extra 5% withholding tax.

---

### ⚖️ Risk & Regulatory Guidance
${isShariahQuery ? `
* **Shariah Integrity:** All Islamic banking accounts operate under Mudaraba (profit-sharing) or Wakalah (agency) contracts. Profit weightages are determined by the bank's Islamic Banking Division and audited by scholars to ensure zero Riba.
` : `
* **Sovereign vs Private Banks:** National Savings Certificates (Sanchaypatra) carry 100% Sovereign Govt Guarantee up to allowable limits. For Private Commercial Banks, diversify deposits exceeding BDT 200,000 across A-grade rated lenders.
`}

---

### 💡 Actionable Next Steps
1. **Verification:** Inspect the live rates inside BANKTANK's comparison table.
2. **KYC Required:** National ID (NID), 2 copies of passport photos, Nominee NID & photo, and active e-TIN Certificate.
3. **Lock-in Strategy:** Since the 10.00% policy rate may normalize over the next 12-24 months, lock in 3-to-5-year tenures today to secure peak yields.`;
}

app.post('/api/advisor', async (req, res) => {
  const startTime = Date.now();
  const { message, history, mode = 'comprehensive' } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const estimatedTimeSeconds = mode === 'quick' ? 3 : mode === 'shariah' ? 4 : 5;

  if (!aiClient) {
    const localReply = generateLocalAdvisory(message, mode);
    return res.json({
      reply: localReply,
      estimatedTimeSeconds,
      actualTimeMs: Date.now() - startTime,
      modelUsed: 'BANKTANK-RuleEngine-Local',
      productCountAnalyzed: financialProducts.length
    });
  }

  // Curate comprehensive banking products context
  const topFDRs = financialProducts.filter(p => p.type === 'FDR').sort((a,b) => b.interestRate - a.interestRate).slice(0, 6);
  const topIslamic = financialProducts.filter(p => p.isShariahCompliant).sort((a,b) => b.interestRate - a.interestRate).slice(0, 8);
  const topDPS = financialProducts.filter(p => p.type === 'DPS').sort((a,b) => b.interestRate - a.interestRate).slice(0, 6);
  const sanchaypatra = financialProducts.filter(p => p.type === 'Sanchaypatra');
  const topMF = financialProducts.filter(p => p.type === 'Mutual Fund').slice(0, 4);

  const curatedProducts = [...topFDRs, ...topIslamic, ...topDPS, ...sanchaypatra, ...topMF].map(p => ({
    name: p.productName,
    bank: p.bankName,
    rate: p.interestRate,
    type: p.type,
    safety: p.safetyRating,
    maturity: p.tenureMonths > 0 ? `${p.tenureMonths} mo` : 'Open',
    shariah: p.isShariahCompliant ? 'Yes (Mudaraba/Halal)' : 'No',
    tax: p.taxApplicable ? 'Yes (10%/15% AIT)' : 'No',
    compounding: p.compoundFrequency || 'Annually',
    features: p.features.slice(0, 2).join('; ')
  }));

  const systemInstruction = `You are BANKTANK's Lead Banking Sector Specialist and Senior Investment Advisor in Bangladesh.
Current market date: November 2026.
Macroeconomic indicators:
- Bangladesh Bank Policy Repo Rate: 10.00% (anchored high rate regime; SLF 11.50%, SDF 8.50%).
- Top Commercial Bank FDR Rates: 10.50% - 12.00% p.a.
- Top Islamic Mudaraba Term Deposit (MTDR) & Islamic DPS: 10.25% - 11.50% expected profit rate.
- National Savings Certificates (Sanchaypatra): 11.04% - 11.76% p.a. (100% sovereign government guaranteed).
- Advance Income Tax (AIT): 10% deducted at source with proof of tax return submission (e-TIN), 15% without proof.
- Shariah banking principles: Riba-free, profit-sharing ratio (Mudaraba) or agency fee (Wakalah), strictly audited by Shariah Supervisory Boards.

Database Sample Context (from 225+ tracked Bangladesh financial products):
${JSON.stringify(curatedProducts)}

CRITICAL ADVISORY INSTRUCTIONS:
1. NEVER give a short, boring, or generic 1-2 sentence response. The user expects a PROPER, deep, authoritative, mathematically structured consultation.
2. Structure your response cleanly using Markdown:
   - 🎯 **Executive Verdict & Strategy**: Direct answer to user's objective.
   - 📊 **Top Recommended Products**: List 2-4 exact bank names, product names, profit/interest rates, and tenures.
   - 🧮 **Mathematical Return Model**: Provide realistic concrete calculations (e.g. for BDT 100k, 500k, or user's requested amount), showing gross yield, 10% vs 15% AIT tax deduction, and net take-home profit.
   - ⚖️ **Safety & Regulatory Assessment**: Compare bank credit safety ratings vs sovereign backing, or Shariah compliance details.
   - 💡 **Actionable Execution Plan**: Eligibility, required KYC documents (NID, TIN, photos), and timing strategy.
3. Language: Match user's language (Bengali if written in Bengali, English if in English, or natural Banglish).
4. Tone: Senior Financial Consultant, mathematically precise, empowering, and culturally fluent in Bangladesh banking.`;

  // Build multi-turn contents if history is provided
  let contentsPayload: any;
  if (Array.isArray(history) && history.length > 0) {
    const formattedHistory = history.slice(-6).map((item: any) => ({
      role: item.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(item.content) }]
    }));
    formattedHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });
    contentsPayload = formattedHistory;
  } else {
    contentsPayload = message;
  }

  // Resilient multi-model fallback execution
  for (const model of GEMINI_MODELS) {
    try {
      const response = await aiClient.models.generateContent({
        model,
        contents: contentsPayload,
        config: {
          systemInstruction,
        },
      });

      const replyText = response.text?.trim();
      if (replyText && replyText.length > 50) {
        return res.json({
          reply: replyText,
          estimatedTimeSeconds,
          actualTimeMs: Date.now() - startTime,
          modelUsed: model,
          productCountAnalyzed: financialProducts.length
        });
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed for advisor query (${err.status || err.message}). Falling back to next model...`);
    }
  }

  // If all Gemini models encounter unexpected high load or rate limit, use the dynamic local advisory engine
  const dynamicReply = generateLocalAdvisory(message, mode);
  return res.json({
    reply: dynamicReply,
    estimatedTimeSeconds,
    actualTimeMs: Date.now() - startTime,
    modelUsed: 'BANKTANK-RuleEngine-Local',
    productCountAnalyzed: financialProducts.length,
    isLocalFallback: true
  });
});

// Health check endpoints for deployment platforms (Cloud Run)
app.get(['/healthz', '/api/health'], (req, res) => {
  res.status(200).send('OK');
});

async function startServer() {
  const server = http.createServer(app);
  const isProd = process.env.NODE_ENV === 'production';
  const distDir = path.resolve(__dirname, 'dist');
  const distIndexPath = path.resolve(distDir, 'index.html');

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server,
        },
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);

    // In dev, transform index.html through Vite so it works seamlessly without needing build
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const rawTemplate = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        const transformedHtml = await vite.transformIndexHtml(url, rawTemplate);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(transformedHtml);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Production mode: serve compiled dist
    if (fs.existsSync(distDir)) {
      app.use(express.static(distDir));
    }

    app.get('*', (req, res) => {
      if (fs.existsSync(distIndexPath)) {
        res.sendFile(distIndexPath);
      } else {
        const devHtml = path.resolve(__dirname, 'index.html');
        if (fs.existsSync(devHtml)) {
          res.sendFile(devHtml);
        } else {
          res.status(200).send('<!doctype html><html><body><h1>Application Initializing</h1><p>Please reload in a moment.</p></body></html>');
        }
      }
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT} in ${isProd ? 'production' : 'development'} mode`);
  });

  process.on('SIGTERM', () => {
    server.close(() => {
      process.exit(0);
    });
  });
}

startServer();


