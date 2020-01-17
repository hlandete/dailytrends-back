import { Connection } from "mongoose";
import { ArticleSchema } from "./schema/articles.schema";

export const ArticlesProvider = [
  {
    provide: "ARTICLE_MODEL",
    useFactory: (connection: Connection) =>
      connection.model("article", ArticleSchema),
    inject: ["DATABASE_CONNECTION"]
  }
];
