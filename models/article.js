const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { Schema, model } = require("mongoose");

const articleschema = new Schema({
  title: { type: String },
  description: { type: String },
  body: { type: String },
  tags: [{ type: String }],
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

articleschema.plugin(mongooseAggregatePaginate);

module.exports = model("article", articleschema);
