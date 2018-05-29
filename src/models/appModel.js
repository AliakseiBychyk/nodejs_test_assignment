import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CastSchema = new Schema({
  id: { type: Number },
  name: { type: String },
  birthday: { type: String },
});

const DataSchema = new Schema({
  id: { type: Number },
  name: { type: String },
  cast: [CastSchema],
});


export default DataSchema;
