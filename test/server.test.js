const assert = require("node:assert/strict");
const { once } = require("node:events");
const { test } = require("node:test");
const app = require("../index.js");

test("serves current pages and assets without publishing server files", async function(t) {
    const server = app.listen(0, "127.0.0.1");
    t.after(function() { server.closeAllConnections(); server.close(); });
    await once(server, "listening");
    const origin = "http://127.0.0.1:" + server.address().port;
    for (const route of ["/", "/index.html", "/faq.html"]) {
        const response = await fetch(origin + route);
        assert.equal(response.status, 200, route);
        assert.match(response.headers.get("content-type"), /text\/html/);
        assert.match(await response.text(), /<!doctype html>/i);
    }
    for (const route of ["/css/style.css", "/css/faq.css", "/js/faq.js", "/images/logo.png", "/images/favicon.png", "/orar.pdf"]) {
        const response = await fetch(origin + route);
        assert.equal(response.status, 200, route);
        assert.ok((await response.arrayBuffer()).byteLength > 0, route);
    }
    for (const route of ["/index.js", "/package.json", "/.env", "/.git/config", "/missing-page"]) {
        const response = await fetch(origin + route);
        assert.equal(response.status, 404, route);
    }
});
