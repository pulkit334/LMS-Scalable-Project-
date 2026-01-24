import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { xss } from "express-xss-sanitizer";
import fileUpload from "express-fileupload";
// import requestIp from "request-ip"
// ---- LOCAL IMPORTS ----
import "./schedular/cronejob.js";
import authRoutes from "./routes/authroutes.js";
import connect from "./config/db.js";
import "./config/passport.js";
import adminRoutes from "./routes/AdminRoutes.js";
// ---- APP INIT ----
const app = express();

// ---------- BODY PARSERS ----------
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// ---------- PASSPORT ----------
// app.use(passport.initialize());

// ---------- SECURITY ----------
app.use(helmet());
app.use(xss());
// app.use(requestIp.mw())
// ---------- COOKIES ----------
app.use(cookieParser());

// ---------- CORS ----------
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// ---------- FILE UPLOAD ----------
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  }),
);

// ---------- LOGGER ----------
app.use(morgan("dev"));

// ---------- ROUTES ----------
app.use("/api/v1", authRoutes);
app.use("/api/v2",adminRoutes)
// ---------- ERROR HANDLER ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ---------- SERVER ----------
const PORT = process.env.PORT;

app.listen(PORT, async () => {
  connect();
  console.log(` Server running on port ${PORT}`);
});
// import cluster from "cluster";
// import os from "os";
// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import cors from "cors";
// import morgan from "morgan";
// import helmet from "helmet";
// import cookieParser from "cookie-parser";
// import { xss } from "express-xss-sanitizer";
// import fileUpload from "express-fileupload";
// import passport from "passport";
// import cluster from "cluster";

// // ---- LOCAL IMPORTS ----
// import "./schedular/cronejob.js";
// import authRoutes from "./routes/authroutes.js";
// import connect from "./config/db.js";
// import "./config/passport.js";

// const PORT = process.env.PORT || 5000;
// const WORKERS = 2; //  REALISTIC CORE USAGE

// // ================== CLUSTER ==================
// if (cluster.isPrimary) {
//   console.log(` Master PID: ${process.pid}`);
//   console.log(` Starting ${WORKERS} workers\n`);

//   for (let i = 0; i < WORKERS; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker) => {
//     console.log(` Worker ${worker.process.pid} died. Restarting...`);
//     cluster.fork();
//   });

// } else {
//   // ================== APP ==================
//   const app = express();

//   app.use(express.json());
//   app.use(express.urlencoded({ extended: true }));

//   app.use(passport.initialize());
//   app.use(helmet());
//   app.use(xss());
//   app.use(cookieParser());

//   app.use(
//     cors({
//       origin: "http://localhost:5173",
//       credentials: true,
//     })
//   );

//   app.use(
//     fileUpload({
//       useTempFiles: true,
//       tempFileDir: "/tmp",
//     })
//   );

//   app.use(morgan("dev"));

//   app.use("/api/v1", authRoutes);

//   app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(err.status || 500).json({
//       success: false,
//       message: err.message || "Internal Server Error",
//     });
//   });

//   // IMPORTANT: DB CONNECT PER WORKER
//   app.listen(PORT, async () => {
//     await connect();
//     console.log(
//       ` Worker ${process.pid} listening on port ${PORT}`
//     );
//   });
// }
