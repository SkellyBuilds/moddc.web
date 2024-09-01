const { model, Schema } = require("mongoose");

module.exports = model("accounts", new Schema({
   connections: { type: Array, default: []},
   acType: {type: String, default: "labrinth"},
   id: {type: Number},
   username: {type: String},
   metadata: {type: Array, default: []},
   projects: {type: Array, default: []}, // just slugs
   acToken: {type: String}
}));