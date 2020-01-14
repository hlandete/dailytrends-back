import { Module } from "@nestjs/common";
import { ArticlesService } from "./service/articles.service";
import { ArticlesController } from "./articles.controller";
import { ArticlesProvider } from "./article.provider";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [ArticlesController],
  providers: [ArticlesService, ...ArticlesProvider]
})
export class ArticlesModule {}
