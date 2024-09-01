const { model, Schema } = require("mongoose");

module.exports = model("projects", new Schema({
   slug: {type: String},
   type: {type: String}, 
   id: {type: String},
   title: {type: String},
   description: {type: String},
   versions: {type: Array},
   DCVers: {type: Array},
   status: {type: Number},
   members: {type: Array}
}));