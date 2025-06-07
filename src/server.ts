import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "node:fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8000;
const app = express();

// ✅ Debug: Log incoming origins (optional, can be removed in prod)
app.use((req, res, next) => {
  console.log("🔍 Incoming origin:", req.headers.origin);
  next();
});

// ✅ Updated CORS setup
const allowedOrigins = [
  "https://auth-api-v1-tau.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://your-frontend.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow requests with no origin (e.g., curl or server-side)
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"], // ✅ Added OPTIONS
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Explicit headers
  })
);

// ✅ Preflight handler
app.options("*", cors());

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Route Loader
const loadRoutes = async () => {
  const routesPath = path.join(__dirname, "routes");
  const routeFiles = fs
    .readdirSync(routesPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  await Promise.all(
    routeFiles.map(async (file) => {
      try {
        const filePath = path.join(routesPath, file);
        const route = await import(pathToFileURL(filePath).href);
        app.use("/api/v1", route.default);
        console.log(`✅ Loaded /api/v1 from ${file}`);
      } catch (error) {
        console.error("❌ Failed to load route file:", error);
      }
    })
  );
};

// Server Starter
const startServer = async () => {
  await loadRoutes();

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
};

startServer();
