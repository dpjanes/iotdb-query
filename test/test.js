/**
 *  test/test.js
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

const record_a = {
    "name": "Freddy Jones",
    "hobbies": [ "skiing", "sailing", ],
    "age": 27,
}

describe("test:", function() {
    describe("special:", function() {
        it("empty query", function() {
            const qd = {}
            const got = query.test(record_a, qd)
            const expected = true

            assert.strictEqual(got, expected)
        })
    })
    describe("strings:", function() {
        it("exact match", function() {
            const qd = {
                name: "Freddy Jones",
            }
            const got = query.test(record_a, qd)
            const expected = true

            assert.strictEqual(got, expected)
        })
        it("not match", function() {
            const qd = {
                name: "Jon Jones",
            }
            const got = query.test(record_a, qd)
            const expected = false

            assert.strictEqual(got, expected)
        })
        it("in", function() {
            const qd = {
                name: [ "in", "Jon Jones", "Freddy Jones", ],
            }
            const got = query.test(record_a, qd)
            const expected = true

            assert.strictEqual(got, expected)
        })
    })
})
