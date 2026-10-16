import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REQUEST_HEADER_ID = "x-request-id";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.use((err, _req, res, _next) => {
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
  console.log(`Site server listening on ${port}`);
});
