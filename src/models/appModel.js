import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DataSchema = new Schema({
  id: { type: Number },
  cast: [CastSchema],
});

const CastSchema = new Schema({
  id: { type: Number },
  name: { type: String },
  birthday: { type: Date },
});

export default DataSchema;
