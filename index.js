const express = require("express");
const path = require("node:path");

const app = express();

// Publish only the existing assets, not the repository or server source.
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.get(["/", "/index.html"], function(req, res) {
    res.sendFile("index.html", { root: __dirname });
});

app.get("/faq.html", function(req, res) {
    res.sendFile("faq.html", { root: __dirname });
});

app.get("/orar.pdf", function(req, res) {
    res.sendFile("orar.pdf", { root: __dirname });
});

if (require.main === module) {
    app.listen(process.env.PORT || 8080);
}

module.exports = app;
