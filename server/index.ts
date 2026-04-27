import "dotenv/config"
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
app.use(express.static(STATIC_DIR))

app.use("/api", routes);

app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server is running at http://${SERVER}:${PORT}`);
});