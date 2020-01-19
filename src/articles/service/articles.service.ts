import { Injectable, Inject, HttpStatus } from "@nestjs/common";
import { Article } from "../interface/articles.interface";
import { Model } from "mongoose";
import { HttpMessages } from "../../generic/enums/HttpMessages.enum";
import { ScrapperService } from "./scrapper.service";
import { GenericService } from "../../generic/services/generic.service";

const axios = require("axios");
const articlesNumber = 5;
@Injectable()
export class ArticlesService {
  constructor(
    @Inject("ARTICLE_MODEL")
    private readonly articlesModel: Model<Article> | any,
    private readonly scrapperService: ScrapperService,
    private readonly genericService: GenericService
  ) {}

  async todayNews() {
    try {
      await this.getCoverArticles("https://www.elmundo.es/", articlesNumber);
      await this.getCoverArticles("https://elpais.com/", articlesNumber);
      return HttpStatus.OK;
    } catch (error) {
      throw error;
    }
  }
  private async create(article: Article): Promise<Article> {
    const articleModel = new this.articlesModel(article);
    let exists = await this.find(article);
    if (!exists) {
      return articleModel.save();
    } else {
      this.genericService.httpException(
        HttpMessages.DUPLICATED_ARTICLE,
        HttpStatus.OK
      );
    }
  }

  private async find(article: Article): Promise<Article> {
    let query = { ["source"]: article.source };
    return await this.articlesModel.findOne(query).exec();
  }

  public async update(id, newData) {
    let article = await this.articlesModel.findOne({ _id: id });
    newData = newData.body;
    if (article) {
      Object.keys(newData).forEach(function(key) {
        article[key] = newData[key];
      });

      return await article.save();
    } else {
      this.genericService.httpException(
        HttpMessages.ARTICLE_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }
  }

  public async delete(id: String): Promise<any> {
    let article = await this.articlesModel.findOne({ _id: id });
    try {
      return article.delete();
    } catch (error) {
      this.genericService.httpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findById(id): Promise<Article> {
    return await this.articlesModel.findOne({ _id: id }).exec();
  }

  async postArticle(url: string): Promise<Article> {
    if (this.genericService.validURL(url)) {
      let articleToCreate: Article = await this.scrapperService.srapArticle(
        url
      );

      return this.create(articleToCreate);
    } else {
      this.genericService.httpException(
        HttpMessages.URL_NOT_VALID,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async getFeed() {
    return await this.articlesModel.find().exec();
  }

  async getCoverArticles(url, amount) {
    const urls = await this.scrapperService.scrappCoverArticleUrls(url, amount);

    let urls_promises = urls.map(url => {
      return this.scrapperService.srapArticle(url).then(article => {
        return this.create(article);
      });
    });

    return Promise.all(urls_promises);
  }

  getMultipleArticlesHtml(urls) {
    const articles_promises = [];
    urls.forEach(async url => {
      articles_promises.push(axios.get(url));
    });

    return Promise.all(articles_promises);
  }
}
