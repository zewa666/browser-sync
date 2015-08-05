"use strict";

var browserSync = require("../../../../index");
var assert      = require("chai").assert;
var Immutable   = require("immutable");
var request     = require("supertest");
var testUtils   = require("../../../protractor/utils");

describe("E2E options test - Disable browser cache", function () {

    it("Adds the middleware for the server", function (done) {

        browserSync.reset();
        browserSync({
            server:   {
                baseDir: "test/fixtures"
            },
            open:     false,
            logLevel: "silent",
            disableBrowserCache: true
        }, function (err, bs) {
            request(bs.server)
                .get("/")
                .set("accept", "text/html")
                .expect(200)
                .end(function (err, res) {
                    assert.ok(res.headers["pragma"]);
                    assert.equal(res.headers["pragma"], "no-cache");
                    assert.equal(res.headers["expires"], "0");
                    assert.equal(res.headers["cache-control"], "no-cache, no-store, must-revalidate");
                    done();
                });
        });
    });
    it("Removes the middleware for server", function (done) {

        browserSync.reset();
        browserSync({
            server:   {
                baseDir: "test/fixtures"
            },
            open:     false,
            logLevel: "silent",
            disableBrowserCache: true
        }, function (err, bs) {
            request(bs.server)
                .get("/")
                .set("accept", "text/html")
                .expect(200)
                .end(function (err, res) {
                    assert.ok(res.headers["pragma"]);
                    assert.equal(res.headers["pragma"], "no-cache");
                    assert.equal(res.headers["expires"], "0");
                    assert.equal(res.headers["cache-control"], "no-cache, no-store, must-revalidate");

                    bs.removeDisableBrowserCacheMiddleware();
                    request(bs.server)
                        .get("/")
                        .set("accept", "text/html")
                        .expect(200)
                        .end(function (err, res) {
                            assert.isUndefined(res.headers["pragma"]);
                            assert.isUndefined(res.headers["expires"]);
                            done();
                        });
                });
        });
    });
    it("Adds the middleware for the Proxy", function (done) {

        browserSync.reset();

        var app = testUtils.getApp(Immutable.Map({scheme: "http"}));

        app.server.listen();

        var config = {
            proxy: {
                target: "http://localhost:" + app.server.address().port
            },
            open: false,
            logLevel: "silent",
            disableBrowserCache: true
        };

        browserSync(config, function (err, bs) {

            request(bs.options.getIn(["urls", "local"]))
                .get("/")
                .set("accept", "text/html")
                .end(function (err, res) {
                    assert.equal(res.headers["pragma"], "no-cache");
                    assert.equal(res.headers["expires"], "0");
                    assert.equal(res.headers["cache-control"], "no-cache, no-store, must-revalidate");
                    app.server.close();
                    done();
                });
        });
    });

    it("Removes the middleware for proxy", function (done) {

        browserSync.reset();

        var app = testUtils.getApp(Immutable.Map({scheme: "http"}));

        app.server.listen();

        var config = {
            proxy: {
                target: "http://localhost:" + app.server.address().port
            },
            open: false,
            logLevel: "silent",
            disableBrowserCache: true
        };

        browserSync(config, function (err, bs) {

            request(bs.options.getIn(["urls", "local"]))
                .get("/")
                .set("accept", "text/html")
                .end(function (err, res) {

                    assert.equal(res.headers["pragma"], "no-cache");
                    assert.equal(res.headers["expires"], "0");
                    assert.equal(res.headers["cache-control"], "no-cache, no-store, must-revalidate");

                    bs.removeDisableBrowserCacheMiddleware();

                    request(bs.options.getIn(["urls", "local"]))
                        .get("/")
                        .set("accept", "text/html")
                        .end(function (err, res) {
                            assert.isUndefined(res.headers["pragma"]);
                            assert.isUndefined(res.headers["expires"]);
                            assert.isUndefined(res.headers["cache-control"]);
                            app.server.close();
                            done();
                        });
                });
        });
    });
});
