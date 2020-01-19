import { Document } from "mongoose";

export interface Article extends Document {
  title: string;
  body: string;
  source: string;
  image: string;
  publisher: string;
  author: string;
}
