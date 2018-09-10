/*
 *  lib/parse.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-09-10
 *
 *  Copyright [2013-2018] [David P. Janes]
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

/**
 */
const parse = (vs, types) => {
    const method = "parse"

    let query = {
    }

    const _coerce = (key, value) => {
        if (types && types[key]) {
            switch (types[key]) {
            case "int":
            case "integer":
                return parseInt(value)

            case "number":
            case "float":
                return parseFloat(value)

            default:
                return value
            }
        } else if (value.match(/^[-+]?[0-9]+$/)) {
            return parseInt(value)
        } else if (value.match(/^[-+]?[0-9]*\.?[0-9]+$/)) {
            return parseFloat(value)
        } else {
            return value
        }
    }

    vs.forEach(v => {
        if (v.startsWith("{")) {
            query = Object.assign({}, query, JSON.parse(v))
            return
        }

        const match = v.match(/^([-$A-Za-z0-9_]+)\s*(<=|<|=|!=|>=|>|in|eq|ne|between)\s*(.*)$/)
        assert(match, `${method}: did not understand "${v}"`)

        const key = match[1]
        const operator = match[2]
        switch (operator) {
        case "in":
        case "between":
            const values = match[3]
                .split(",")
                .map(value => _coerce(key, value))
            values.unshift(operator)
            query[key] = values
            break

        default:
            query[key] = [ operator, _coerce(key, match[3]) ]
            break
        }
    })

    return query
}

/**
 *  API
 */
exports.parse = parse


/*
console.log(parse([ 
    "number<=0",
]))
console.log(parse([ 
    "number<0",
    "date>=2017-01-01",
    "value!=3.14",
    "x between 1,2",
    "y in a,b,cde,fg",
]))
*/
