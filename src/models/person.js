"strict mode";

const mongoose = require("mongoose");

const personSchema = new mongoose.Schema(
  {
    personId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    sex: { type: String },
    friendList: { type: [{ type: String }], default: [], required: true },
  },
  {
    timestamps: true,
    collection: "persons",
  }
);

module.exports = mongoose.model("Person", personSchema);
