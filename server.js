import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REQUEST_HEADER_ID = "x-request-id";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = new Set([
  "https://francielimadeira.com",
  "https://www.francielimadeira.com",
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  }),
);

app.use(express.json());
app.use(express.static(__dirname));

app.use((req, res, next) => {
  const requestId =
    req.get(REQUEST_HEADER_ID) ||
    `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  res.setHeader(REQUEST_HEADER_ID, requestId);

  const startedAt = Date.now();
  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    console.log(
      JSON.stringify({
        level: "info",
        event: "http_request",
        requestId,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs,
        origin: req.get("origin") || null,
      }),
    );
  });

  next();
});

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

function isValidEmail(value) {
  if (typeof value !== "string") return false;
  if (value.length > 320) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

app.post("/api/lead", async (req, res) => {
  const { email, consent } = req.body || {};

  if (!isValidEmail(email)) {
    console.warn(
      JSON.stringify({
        level: "warn",
        event: "lead_rejected",
        reason: "invalid_email",
        email: typeof email === "string" ? email : null,
      }),
    );
    return res.status(400).json({ ok: false, error: "invalid_email" });
  }
  if (consent !== true) {
    console.warn(
      JSON.stringify({
        level: "warn",
        event: "lead_rejected",
        reason: "consent_required",
      }),
    );
    return res.status(400).json({ ok: false, error: "consent_required" });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);

  if (!apiKey || !Number.isInteger(listId)) {
    console.error(
      JSON.stringify({
        level: "error",
        event: "config_missing",
        hasApiKey: Boolean(apiKey),
        hasListId: Number.isInteger(listId),
      }),
    );
    return res.status(500).json({ ok: false, error: "server_misconfigured" });
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    if (response.ok) {
      console.log(
        JSON.stringify({
          level: "info",
          event: "lead_saved",
          email,
          listId,
        }),
      );
      return res.status(200).json({ ok: true });
    }

    if (response.status === 409) {
      console.log(
        JSON.stringify({
          level: "info",
          event: "lead_duplicate",
          email,
          listId,
        }),
      );
      return res.status(409).json({ ok: true, duplicate: true });
    }

    console.error(
      JSON.stringify({
        level: "error",
        event: "brevo_error",
        status: response.status,
      }),
    );
    return res.status(502).json({ ok: false, error: "brevo_error" });
  } catch (_error) {
    console.error(
      JSON.stringify({
        level: "error",
        event: "brevo_unreachable",
      }),
    );
    return res.status(502).json({ ok: false, error: "brevo_unreachable" });
  }
});

app.use((err, _req, res, _next) => {
  if (err && err.message === "Not allowed by CORS") {
    return res.status(403).json({ ok: false, error: "cors_blocked" });
  }
  console.error(
    JSON.stringify({
      level: "error",
      event: "unhandled_error",
      message: err?.message || "unknown",
    }),
  );
  return res.status(500).json({ ok: false, error: "server_error" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Lead API listening on ${port}`);
});
