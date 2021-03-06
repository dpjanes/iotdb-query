/**
 *  test/parse.js
 *
 *  David Janes
 *  IOTDB
 *  2018-09-10
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

const assert = require("assert")

const query = require("..")

                /*
                "date>=2017-01-01",
                "x between 1,2",
                "y in a,b,cde,fg",
                */
describe("parse", function() {
    let self = {}

    describe("untyped", function() {
        it("integers", function() {
            const expected = { 
                a: [ '<', 2 ],
                b: [ '<=', 3 ],
                c: [ '=', 4 ],
                d: [ '!=', -1 ],
                e: [ '>=', -10 ],
                f: [ '>', -99 ]
            }

            const got = query.parse([
                "a<2",
                "b<=3",
                "c=4",
                "d!=-1",
                "e>=-10",
                "f>-99",
            ])

            // console.log(JSON.stringify(got, null, 2))
            // process.exit()

            assert.deepEqual(got, expected)
        })
        it("float", function() {
            const expected = { 
                a: [ '<', 2.1 ],
                b: [ '<=', 3.1 ],
                c: [ '=', 4.1 ],
                d: [ '!=', -1.1 ],
                e: [ '>=', -10.1 ],
                f: [ '>', -99.1 ]
            }

            const got = query.parse([
                "a<2.1",
                "b<=3.1",
                "c=4.1",
                "d!=-1.1",
                "e>=-10.1",
                "f>-99.1",

            ])

            assert.deepEqual(got, expected)
            // console.log(got)
        })
        it("dates", function() {
            const expected = { 
                a: [ '<', '2017-07' ],
                b: [ '<=', '2017-07' ],
                c: [ '=', '1970-01-01' ],
                d: [ '!=', '1999-07' ],
                e: [ '>=', '2017-07' ],
                f: [ '>', '2017-07' ],
            }

            const got = query.parse([
                "a<2017-07",
                "b<=2017-07",
                "c=1970-01-01",
                "d!=1999-07",
                "e>=2017-07",
                "f>2017-07",
            ])

            assert.deepEqual(got, expected)
            // console.log(got)
        })
        it("between/in", function() {
            const expected = { 
                x: [ 'between', 1, 2 ], 
                y: [ 'in', 'a', 'b', 'cde', 'fg' ]
            }

            const got = query.parse([
                "x between 1,2",
                "y in a,b,cde,fg",
            ])

            assert.deepEqual(got, expected)
            // console.log(got)
        })
    })
})
