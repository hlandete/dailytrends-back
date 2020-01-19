import * as mongoose from "mongoose";

export const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  image: { type: String, required: false },
  source: { type: String, required: true },
  publisher: { type: String, required: true },
  author: { type: String, required: false }
});
