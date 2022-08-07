const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { Schema, model } = require("mongoose");

const eventschema = new Schema({
  title: { type: String },
  description: { type: String },
  visibility: { type: String, default: "public" },
  time_restricted: { type: Boolean, default: false },
  start_at: { type: Date, default: Date.now },
  end_at: { type: Date, default: Date.now },
  finished: { type: Boolean, default: false },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

eventschema.plugin(mongooseAggregatePaginate);

module.exports = model("event", eventschema);
