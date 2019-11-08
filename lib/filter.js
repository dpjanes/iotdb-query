/*
 *  lib/filter.js
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

/**
 */
const filter = _.promise(self => {
    const query = require("..")

    _.promise.validate(self, filter)

    self.jsons = self.jsons.filter(json => query.test(json, self.query))
})

filter.method = "filter"
filter.requires = {
    jsons: _.is.Array,
    query: _.is.Dictionary,
}
filter.accepts = {
}
filter.produces = {
    jsons: _.is.Array,
}

/**
 */
const parameterized = (_jsons, _filter) => _.promise((self, done) => {
    _.promise(self) 
        .add({
            jsons: _jsons || self.jsons || [],
            filter: _filter || self.filter || {},
        })
        .then(filter)
        .end(done, self, "jsons")
})

/**
 *  API
 */
exports.filter = filter
exports.filter.p = parameterized
