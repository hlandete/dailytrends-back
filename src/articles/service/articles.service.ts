import { Injectable, Inject, HttpStatus } from "@nestjs/common";
import { Article } from "../interface/articles.interface";
import { Model } from "mongoose";
import { HttpMessages } from "../../generic/enums/HttpMessages.enum";
import { ScrapperService } from "./scrapper.service";
import { GenericService } from "../../generic/services/generic.service";

const axios = require("axios");

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
      await this.getCoverElMundo();
      await this.getCoverElPais();

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
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private async find(article: Article): Promise<Article> {
    let query = { ["source.url"]: article.source.url };
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
      const articleHTML = await axios.get(url);

      let articleToCreate: Article;

      if (url.includes("elmundo")) {
        articleToCreate = this.scrapperService.scrapArticleElmundo(
          articleHTML,
          url
        );
      } else if (url.includes("elpais")) {
        articleToCreate = this.scrapperService.scrapArticleElPais(
          articleHTML,
          url
        );
      } else {
        this.genericService.httpException(
          HttpMessages.NOT_VALID_NEWSPAPPER,
          HttpStatus.BAD_REQUEST
        );
      }

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

  async getCoverElMundo() {
    const urls = await this.scrapperService.scrappCoverArticleUrls(
      "https://www.elmundo.es/",
      5
    );

    const articles = await this.getMultipleArticlesHtml(urls);

    return articles.map(async (articleHTML, index) => {
      let articleToCreate: Article = this.scrapperService.scrapArticleElmundo(
        articleHTML,
        urls[index]
      );

      return this.create(articleToCreate);
    });
  }

  async getCoverElPais() {
    const urls = await this.scrapperService.scrappCoverArticleUrls(
      "https://elpais.com/",
      5
    );

    const articles = await this.getMultipleArticlesHtml(urls);

    return articles.map(async (articleHTML, index) => {
      let articleToCreate: Article = this.scrapperService.scrapArticleElPais(
        articleHTML,
        urls[index]
      );

      return this.create(articleToCreate);
    });
  }

  getMultipleArticlesHtml(urls) {
    const articles_promises = [];
    urls.forEach(async url => {
      articles_promises.push(axios.get(url));
    });

    return Promise.all(articles_promises);
  }
}
