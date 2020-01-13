import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("elmundo")
  getNewsElMundo() {
    return this.appService.getNewsElMundo();
  }

  @Get("elpais")
  getNewsElPais() {
    return this.appService.getNewsElPais();
  }
}
