import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { ArticlesModule } from "./articles/articles.module";

@Module({
  imports: [ArticlesModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
