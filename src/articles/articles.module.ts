import { Module } from "@nestjs/common";
import { ArticlesService } from "./service/articles.service";
import { ArticlesController } from "./articles.controller";
import { ArticlesProvider } from "./article.provider";
import { DatabaseModule } from "../database/database.module";
import { ScrapperService } from "./service/scrapper.service";
import { GenericService } from "../generic/services/generic.service";

@Module({
  imports: [DatabaseModule],
  controllers: [ArticlesController],
  providers: [
    ArticlesService,
    ScrapperService,
    GenericService,
    ...ArticlesProvider
  ]
})
export class ArticlesModule {}
