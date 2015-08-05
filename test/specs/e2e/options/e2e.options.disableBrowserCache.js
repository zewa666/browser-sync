"use strict";

var browserSync = require("../../../../index");
var assert      = require("chai").assert;
var request     = require("supertest");

describe("E2E options test - Disable browser cache", function () {

    it.only("Adds the middleware for the server", function (done) {
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
                    console.log(res.headers);
                    assert.ok(res.headers['pragma']);
                    //assert.include(res.text, instance.options.get("snippet"));
                    done();
                });
        });
    });
});
