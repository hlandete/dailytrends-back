import {
  Controller,
  Get,
  Post,
  Res,
  HttpStatus,
  Body,
  Patch,
  Delete
} from "@nestjs/common";
import { ArticlesService } from "./service/articles.service";
import { Id } from "../generic/decorators/params.decorators";
import { HttpMessages } from "../generic/enums/HttpMessages.enum";

@Controller("articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  getUserFeed(@Res() res) {
    this.articlesService
      .getFeed()
      .then(data => {
        res.status(HttpStatus.OK).json(data);
      })
      .catch(error => {
        if (error.status) {
          res.status(error.status).json(error);
        } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
      });
  }

  @Get("today")
  getTodayArticles(@Res() res) {
    return this.articlesService
      .todayNews()
      .then(lastNews => {
        res.status(HttpStatus.OK).json({
          lastNews
        });
      })
      .catch(error => {
        if (error.status) {
          res.status(error.status).json(error);
        } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
      });
  }

  @Get(":id")
  getSingleArticle(@Res() res, @Id() id) {
    return this.articlesService
      .findById(id)
      .then(article => {
        res.status(HttpStatus.OK).json(article);
      })
      .catch(error => {
        if (error.status) {
          res.status(error.status).json(error);
        } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
      });
  }

  @Post()
  postArticle(@Res() res, @Body() body) {
    return this.articlesService
      .postArticle(body.url)
      .then(data => {
        res.status(HttpStatus.OK).json(data);
      })
      .catch(error => {
        if (error.status) {
          res.status(error.status).json(error);
        } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
      });
  }

  @Patch(":id")
  updateArticle(@Res() res, @Id() id, @Body() body) {
    return this.articlesService
      .update(id, body)
      .then(data => {
        res.status(HttpStatus.OK).json(data);
      })
      .catch(error => {
        if (error.status) {
          res.status(error.status).json(error);
        } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
      });
  }

  @Delete(":id")
  deleteArticle(@Res() res, @Id() id) {
    return this.articlesService
      .delete(id)
      .then(data => {
        res.status(HttpStatus.OK).json(data);
      })
      .catch(error => {
        if (error.status) {
          res.status(error.status).json(error);
        } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
      });
  }
}
