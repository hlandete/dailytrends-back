import { Document } from "mongoose";

export interface Article extends Document {
  title: string;
  body: string;
  source: {
    url: string;
    name: string;
  };
  image: string;
  publisher: string;
}
