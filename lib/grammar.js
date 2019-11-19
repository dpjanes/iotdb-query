/*
 *  lib/grammar.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-11-19
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
const errors = require("iotdb-errors")

const assert = require("assert")

const _expect = (stream, token) => {
    assert.ok(stream)
    assert.ok(token)

    const current = stream.tokens[stream.position]
    if (!current) {
        throw new Error(`expected "${token}" not EOF`)
    }

    if (current.token !== token) {
        throw new Error(`position ${current.position}: expected "${token}" not "${current.token}"`)
    }

    stream.position++

    return current
}

const _peek = (stream) => {
    const current = stream.tokens[stream.position]
    if (!current) {
        throw new Error(`expected anything but EOF`)
    }

    return current
}

const _pop = (stream) => {
    const current = stream.tokens[stream.position]
    if (!current) {
        throw new Error(`expected anything but EOF`)
    }

    stream.position++

    return current
}

const _pop_expression = (stream) => {
    const query = require("..")

    const expression = {
        token: query.token.EXPRESSION,
        name: null,
        params: [],
    }

    expression.name = _expect(stream, query.token.WORD).value
    _expect(stream, "(")

    let expect_comma = false
    while (true) {
        const next = _peek(stream)
        if (next === ")") {
            break
        }

        if (next.token === ",") {
            if (!expect_comma) {
                throw new Error(`position ${next.position}: was not expecting to see a comma here`)
            }

            _pop(stream)
            expect_comma = false
        } else if (next.token === query.token.LITERAL) {
            expression.params.push(_pop(stream))
            expect_comma = true
        } else if (next.token === query.token.WORD) {
            expression.params.push(_pop_expression(stream))
            expect_comma = true
        } else if (next.token === ")") {
            break
        } else {
            throw new Error(`position ${next.position}: didn't expect to get here: ${next.token}`)
        }
    }

    _expect(stream, ")")

    return expression
}

/**
 */
const grammar = s => {
    const query = require("..")

    // make a token stream
    const stream = {
        position: 0,
        tokens: [],
    }

    let last
    while (true) {
        const t = query.tokenize(s, last)

        if (t.token === query.token.EOF) {
            break
        }

        stream.tokens.push(t)
        last = t
    }

    stream.tokens.forEach(t => {
        delete t.remainder
        t.original = s
    })

    return _pop_expression(stream)
}

/*
let s = grammar(`and(is("schema:material", "wikipedia:Gold"), true)`)
// let s = grammar(`is("schema:material", "wikipedia:Gold"))`)
console.log("RESULT")
console.log(JSON.stringify(s, null, 2))
*/

/**
 */
exports.grammar = grammar
