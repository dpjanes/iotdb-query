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
        it("dictionary query", function() {
            const qd = {
                name: {},
            }
            try {
                const got = query.test(record_a, qd)
                assert.ok(false, "did not excpect to get here")
            } catch (x) {
            }
        })
        it("no such query", function() {
            const qd = {
                name: [ "blarg", 21 ],
            }
            try {
                const got = query.test(record_a, qd)
                assert.ok(false, "did not excpect to get here")
            } catch (x) {
            }
        })
    })
    describe("strings:", function() {
        it("exact - yes", function() {
            const qd = {
                name: "Freddy Jones",
            }
            const got = query.test(record_a, qd)
            const expected = true

            assert.strictEqual(got, expected)
        })
        it("exact - no", function() {
            const qd = {
                name: "Jon Jones",
            }
            const got = query.test(record_a, qd)
            const expected = false

            assert.strictEqual(got, expected)
        })
        it("in - yes", function() {
            const qd = {
                name: [ "in", "Jon Jones", "Freddy Jones", ],
            }
            const got = query.test(record_a, qd)
            const expected = true

            assert.strictEqual(got, expected)
        })
        it("in - no", function() {
            const qd = {
                name: [ "in", "A", "B", "C" ],
            }
            const got = query.test(record_a, qd)
            const expected = false

            assert.strictEqual(got, expected)
        })
        it("not-in - yes", function() {
            const qd = {
                name: [ "not-in", "A", "B", "C" ],
            }
            const got = query.test(record_a, qd)
            const expected = true

            assert.strictEqual(got, expected)
        })
        it("not-in - no", function() {
            const qd = {
                name: [ "not-in", "Jon Jones", "Freddy Jones", ],
            }
            const got = query.test(record_a, qd)
            const expected = false

            assert.strictEqual(got, expected)
        })
        it("startswith - yes", function() {
            const qd = {
                name: [ "startswith", "A", "B", "C", "D", "E", "F" ],
            }
            const got = query.test(record_a, qd)
            const expected = true

            assert.strictEqual(got, expected)
        })
        it("startswith - no", function() {
            const qd = {
                name: [ "startswith", "G", "H", "I", "J", "K", "L" ],
            }
            const got = query.test(record_a, qd)
            const expected = false

            assert.strictEqual(got, expected)
        })
        it("= - yes", function() {
            const qd = {
                name: [ "=", "Freddy Jones", "A" ],
            }
            const got = query.test(record_a, qd)
            const expected = true

            assert.strictEqual(got, expected)
        })
        it("= - no", function() {
            const qd = {
                name: [ "=", "Jon Jones", "B", ]
            }
            const got = query.test(record_a, qd)
            const expected = false

            assert.strictEqual(got, expected)
        })
        it(">= - yes", function() {
            const qd = {
                name: [ ">=", "Freddy Jones", "A" ],
            }
            const got = query.test(record_a, qd)
            const expected = true

            assert.strictEqual(got, expected)
        })
        it(">= - no", function() {
            const qd = {
                name: [ ">=", "Jon Jones", "K", ]
            }
            const got = query.test(record_a, qd)
            const expected = false

            assert.strictEqual(got, expected)
        })
        it("<= - yes", function() {
            const qd = {
                name: [ "<=", "Freddy Jones", "F", ],
            }
            const got = query.test(record_a, qd)
            const expected = true

            assert.strictEqual(got, expected)
        })
        it("<= - no", function() {
            const qd = {
                name: [ "<=", "Abby Jones", "A", ]
            }
            const got = query.test(record_a, qd)
            const expected = false

            assert.strictEqual(got, expected)
        })

        it("> - yes", function() {
            const qd = {
                name: [ ">", "A" ],
            }
            const got = query.test(record_a, qd)
            const expected = true

            assert.strictEqual(got, expected)
        })
        it("> - no", function() {
            const qd = {
                name: [ ">", "K", ]
            }
            const got = query.test(record_a, qd)
            const expected = false

            assert.strictEqual(got, expected)
        })
        it("< - yes", function() {
            const qd = {
                name: [ "<", "G", ],
            }
            const got = query.test(record_a, qd)
            const expected = true

            assert.strictEqual(got, expected)
        })
        it("< - no", function() {
            const qd = {
                name: [ "<", "A", ]
            }
            const got = query.test(record_a, qd)
            const expected = false

            assert.strictEqual(got, expected)
        })

        it("any - yes", function() {
            const qd = {
                name: [ "any" ],
            }
            const got = query.test(record_a, qd)
            const expected = true

            assert.strictEqual(got, expected)
        })
        it("any - no", function() {
            const qd = {
                doesNotExist: [ "any" ],
            }
            const got = query.test(record_a, qd)
            const expected = false

            assert.strictEqual(got, expected)
        })

        it("* - yes", function() {
            const qd = {
                name: "*",
            }
            const got = query.test(record_a, qd)
            const expected = true

            assert.strictEqual(got, expected)
        })
        it("* - no", function() {
            const qd = {
                doesNotExist: "*",
            }
            const got = query.test(record_a, qd)
            const expected = false

            assert.strictEqual(got, expected)
        })
    })
    describe("extensions", function() {
        const paramd = {
            extensions: {
                blarg: (qvs, rvs) => qvs.length && (rvs.indexOf(qvs[0]) !== -1),
            }
        }
        it("blarg - no name", function() {
            const qd = {
                name: [ "blarg", 21 ],
            }
            const rd = {
            }
            const got = query.test(rd, qd, paramd)
            const expected = false

            assert.strictEqual(got, expected)
        })
        it("blarg - name is 22", function() {
            const qd = {
                name: [ "blarg", 21 ],
            }
            const rd = {
                name: 22,
            }
            const got = query.test(rd, qd, paramd)
            const expected = false

            assert.strictEqual(got, expected)
        })
        it("blarg - name is 21", function() {
            const qd = {
                name: [ "blarg", 21 ],
            }
            const rd = {
                name: 21,
            }
            const got = query.test(rd, qd, paramd)
            const expected = true

            assert.strictEqual(got, expected)
        })
    })
})
