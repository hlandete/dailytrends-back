import * as mongoose from "mongoose";

const Source = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true }
  },
  { _id: false }
);

export const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: false },
  image: { type: String, required: false },
  source: { type: Source, required: true },
  publisher: { type: String, required: false }
});
