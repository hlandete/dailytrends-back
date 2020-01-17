import { Module, Global } from "@nestjs/common";
import { databaseProviders } from "./database";

@Global()
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders]
})
export class DatabaseModule {}
