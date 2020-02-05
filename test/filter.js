/**
 *  test/filter.js
 *
 *  David Janes
 *  IOTDB
 *  2018-11-19
 *
 *  Copyright (2013-2020) David P. Janes
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict"

const _ = require("iotdb-helpers")
const query = require("..")

const assert = require("assert")

const movies = require("./data/movies.json")

/*
let qd = {
    // "info/directors": "Ron Howard",
    // "info/actors": "Morgan Freeman",
    // "year": [ "<=", 2000 ],
    "year": [ "not-in", 2000, 2013 ],
}
*/


describe("filter", function() {
    it("all", function(done) {
        _.promise({
            jsons: movies,
            query: {
            },
        })
            .then(query.filter)
            .make(sd => {
                const got = sd.jsons.length
                const expected = 88

                assert.strictEqual(got, expected)
                assert.ok(_.is.Array.of.Dictionary(sd.jsons))
            })
            .end(done)
    })
    describe("extensions", function() {
        const paramd = {
            extensions: {
                ronhoward: (qvs, rvs, record) => rvs.indexOf("Ron Howard") > -1,
                morganfreeman: (qvs, rvs, record) => 
                    _.d.list(record, "info/actors", []).indexOf("Morgan Freeman") > -1,
            }
        }

        it("row based", function(done) {
            _.promise({
                jsons: movies,
                query: {
                    "info/directors": [ "ronhoward" ],
                },
                query$paramd: paramd,
            })
                .then(query.filter)
                .make(sd => {
                    const got = sd.jsons.length
                    const expected = 1

                    assert.strictEqual(got, expected)
                    assert.ok(_.is.Array.of.Dictionary(sd.jsons))
                })
                .end(done)
        })
        it("record based based", function(done) {
            _.promise({
                jsons: movies,
                query: {
                    "ITDOESNOTMATTER": [ "morganfreeman" ],
                },
                query$paramd: paramd,
            })
                .then(query.filter)
                .make(sd => {
                    const got = sd.jsons.length
                    const expected = 3

                    assert.strictEqual(got, expected)
                    assert.ok(_.is.Array.of.Dictionary(sd.jsons))
                })
                .end(done)
        })
    })
})
