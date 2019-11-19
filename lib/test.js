/*
 *  lib/test.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-10-08
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

const test = (record, qd) => {
    let is_match = true

    _.mapObject(qd, (qvalues, qkeypath) => {
        const rvalues = _.d.list(record, qkeypath, null) || []

        if (_.is.Array(qvalues)) {
            const head = qvalues[0]
            const tails = qvalues.slice(1)

            switch (head) {
            case ">":
                is_match &= !!tails.find(tail => rvalues.find(rvalue => rvalue > tail))
                break

            case ">=":
                is_match &= !!tails.find(tail => rvalues.find(rvalue => rvalue >= tail))
                break
                
            case "<":
                is_match &= !!tails.find(tail => rvalues.find(rvalue => rvalue < tail))
                break
                
            case "<=":
                is_match &= !!tails.find(tail => rvalues.find(rvalue => rvalue <= tail))
                break
                
            case "=":
                is_match &= !!tails.find(tail => rvalues.find(rvalue => rvalue === tail))
                break
                
            case "in":
                rvalues.forEach(rvalue => {
                    is_match &= tails.indexOf(rvalue) !== -1
                })
                break

            case "not-in":
                rvalues.forEach(rvalue => {
                    is_match &= tails.indexOf(rvalue) === -1
                })
                break

            case "any":
                is_match &= rvalues.length > 0
                break
                
            case "startswith":
            case "startsWith":
                /*
                console.log("Q.1", tails)
                console.log("Q.2", rvalues)
                console.log("Q.3", !!tails.find(tail => rvalues.find(rvalue => rvalue.startsWith(tail))))
                */
                is_match &= !!tails.find(tail => rvalues.find(rvalue => rvalue.startsWith(tail)))
                break
                
            default:
                throw new errors.NotAppropriate(`unknown operator: ${head}`)
            }
        } else if (_.is.Dictionary(qvalues)) {
            throw new errors.NotAppropriate("did not expect a Dictionary")
        } else {
            is_match &= rvalues.indexOf(qvalues) !== -1
        }
    })

    return !!is_match
}

/**
 *  API
 */
exports.test = test
