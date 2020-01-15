import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as helmet from "helmet";
import { config } from "./config/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");
  app.use(helmet());
  app.enableCors();

  await app.listen(config.port);

  console.log("Listening on: " + config.port);
}
bootstrap();
