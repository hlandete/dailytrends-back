import { Controller, Get, Post } from "@nestjs/common";
import { ArticlesService } from "./service/articles.service";

@Controller("articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get("feed")
  getFeed() {
    return this.articlesService.getFeed();
  }

  @Get("today")
  getToday() {
    return this.articlesService.todayNews();
  }

  @Post("article")
  postArticle(url) {}
}
