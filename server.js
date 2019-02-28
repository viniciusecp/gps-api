const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");

// Iniciando o App
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

// Rotas
app.use("/api", require("./src/routes"));

app.listen(3000);

console.log("API rodando na porta 3000");
