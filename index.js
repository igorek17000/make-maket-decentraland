import express from "express";

import bodyParser from "body-parser";
import cors from "cors";
// Import the functions you need from the SDKs you need
import path from "path";
const app = express();
// const router = express.Router();
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import router from "./router.js";
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 3001;

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "./frontend/build")));

// Handle GET requests to /api route
app.use("/api", router);
// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./frontend/build", "index.html"));
});
// respond with "hello world" when a GET request is made to the homepage

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
