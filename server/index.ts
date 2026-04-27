import "dotenv/config"
import path from "path";
import express from "express";
import routes from "./routes/index"
import { errorHandler } from "./middlewares/error-handler.middleware";

const PORT = process.env.PORT || 5000;
const SERVER = process.env.SERVER ?? "localhost"
const STATIC_DIR = process.env.STATIC_DIR ?? "fitlytics/dist"


const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }
    next();
});

app.use(express.json());

// Resolve the absolute path to the static directory
const staticPath = path.isAbsolute(STATIC_DIR)
    ? STATIC_DIR
    : path.join(__dirname, "..", STATIC_DIR);

app.use(express.static(staticPath));

app.use("/api", routes);

app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
});

app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server is running at http://${SERVER}:${PORT}`);
});