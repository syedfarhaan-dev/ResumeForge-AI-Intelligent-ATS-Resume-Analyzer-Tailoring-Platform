const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const env = require("./config/env");
const { connectDB } = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const healthRouter = require("./routes/health");
const authRouter = require("./routes/auth");
const resumesRouter = require("./routes/resumes");
const dashboardRouter = require("./routes/dashboard");
const insightsRouter = require("./routes/insights");
const historyRouter = require("./routes/history");
const versionsRouter = require("./routes/versions");

const app = express();

app.set("trust proxy", 1);

app.use(cors({
    origin: env.clientOrigin,
    credentials: true
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

if (!env.isProd) {
    app.use(morgan("dev"));
}

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the AI Resume Roaster API" });
});

app.use("/health", healthRouter);
app.use("/auth", authRouter);
app.use("/resumes", resumesRouter);

app.use("/dashboard", dashboardRouter);
app.use("/insights", insightsRouter);
app.use("/history", historyRouter);
app.use("/versions", versionsRouter);


app.use(notFound);
app.use(errorHandler);

async function start() {
    try {
        await connectDB();

        app.listen(env.port, () => {
            console.log(
                `Server running on http://localhost:${env.port} (${env.nodeEnv})`
            );
        });
    } catch (err) {
        console.error("Failed to start server:", err.message);
        process.exit(1);
    }
}

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});

start();

module.exports = app;