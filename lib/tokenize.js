/*
 *  lib/tokenize.js
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

const token = {
    EOF: "EOF",
    LITERAL: "LITERAL",
    WORD: "WORD",

    // parsed
    EXPRESSION: "EXPRESSION",
}

const tokenize = (_s, _last_token) => {
    let s = _s.trimStart()
    let last_token = _last_token || {
        remainder: _s,
    }
    
    if (s.length === 0) {
        return {
            token: token.EOF,
            value: null,
            remainder: s,
            position: _last_token.remainder.length - s.length,
        }
    }

    let match

    match = s.match(/^0\b/)
    if (match) {
        return {
            token: token.LITERAL,
            value: 0,
            remainder: s.substring(match[0].length),
        }
    }

    match = s.match(/^[-+]?[0-9]+"."[0-9]+\b/)
    if (match) {
        return {
            token: token.LITERAL,
            value: parseFloat(match[0]),
            remainder: s.substring(match[0].length),
        }
    }

    match = s.match(/^[-+]?[1-9][0-9]*\b/)
    if (match) {
        return {
            token: token.LITERAL,
            value: parseInt(match[0]),
            remainder: s.substring(match[0].length),
        }
    }

    match = s.match(/^\"((\\.|[^"])*)\"/)
    if (match) {
        return {
            token: token.LITERAL,
            value: match[1],
            remainder: s.substring(match[0].length),
        }
    }

    match = s.match(/^\'((\\.|[^'])*)\'/)
    if (match) {
        return {
            token: token.LITERAL,
            value: match[1],
            remainder: s.substring(match[0].length),
        }
    }

    match = s.match(/^[(),]/)
    if (match) {
        return {
            token: match[0],
            value: null,
            remainder: s.substring(match[0].length),
        }
    }

    match = s.match(/^(true|false)/)
    if (match) {
        return {
            token: token.LITERAL,
            value: match[0] === "true",
            remainder: s.substring(match[0].length),
        }
    }

    match = s.match(/^([A-Za-z_][a-zA-Z0-9_]*)/)
    if (match) {
        return {
            token: token.WORD,
            value: match[0],
            remainder: s.substring(match[0].length),
        }
    }

    throw new Error("did not recognize: " + s.substring(0, 10) + "...")
}

/*
let s = `and(is("schema:material", "wikipedia:Gold"), true)`
while (s.length) {
    const t = tokenize(s, 0)

    s = t.remainder
    delete t.remainder
    console.log(t)
}
*/

/**
 */
exports.token = token
exports.tokenize = tokenize
