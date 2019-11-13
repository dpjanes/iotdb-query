const _ = require("iotdb-helpers")
const query = require("..")
const movies = require("./movies.json")

let qd = {
    // "info/directors": "Ron Howard",
    "info/actors": "Morgan Freeman",
    // "year": [ "<=", 2000 ],
    "year": [ "in", 2000, 2013 ],
}

_.promise({
    jsons: movies,
    query: qd,
})
    .then(query.filter)
    .make(sd => {
        console.log(JSON.stringify(sd.jsons, null, 2))
    })
    .catch(error => {
        console.log("#", _.error.messsage(error))
    })
