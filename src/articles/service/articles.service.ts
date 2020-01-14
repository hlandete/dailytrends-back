import { Injectable, HttpException, Inject } from "@nestjs/common";
import { Article } from "../interface/articles.interface";
import { Model } from "mongoose";
const cheerio = require("cheerio");
const axios = require("axios");

let newArticle = {
  title: "",
  body: "",
  source: {
    url: "",
    name: ""
  },
  image: "",
  publisher: ""
};
@Injectable()
export class ArticlesService {
  constructor(
    @Inject("ARTICLE_MODEL")
    private readonly articlesModel: Model<Article> | any
  ) {}

  todayNews() {
    try {
      this.getCoverElMundo();
      this.getCoverElPais();
    } catch (error) {
      console.log(error);
    }
  }
  async getCoverElMundo() {
    let articleToCreate: Article;

    const urls = await this.getCoverNewsURLs("https://www.elmundo.es/");

    const articles = await this.getArticlesHtml(urls);

    articles.forEach(async (articleHTML, index) => {
      let articleToCreate: Article = this.getSingleArticleElMundo(
        articleHTML,
        urls[index]
      );

      this.save(articleToCreate);
    });
  }

  getSingleArticleElMundo(article, url): Article {
    let single_article: Article = {
      title: "",
      body: "",
      source: {
        url: "",
        name: ""
      },
      image: "",
      publisher: ""
    };
    const $ = cheerio.load(article.data);

    single_article.source.url = url;
    single_article.source.name = "elmundo";
    single_article.title = $("article")
      .find("h1")
      .text() as string;

    single_article.publisher = $("article")
      .find(".ue-c-article__byline-name a")
      .text() as string;

    single_article.image = $("article")
      .find("figure img")
      .attr("src") as string;

    single_article.body = $("article")
      .find(".ue-c-article__standfirst")
      .text();

    return single_article;
  }

  async getCoverElPais() {
    let articleToCreate: Article;

    const urls = await this.getCoverNewsURLs("https://elpais.com/");

    const articles = await this.getArticlesHtml(urls);

    articles.forEach(async (articleHTML, index) => {
      let articleToCreate: Article = this.getSingleArticleElMundo(
        articleHTML,
        urls[index]
      );

      this.save(articleToCreate);
    });
  }

  async getCoverNewsURLs(website) {
    const urls: string[] = [];
    const res = await axios.get(website);

    const cover_html = res.data;
    // console.log(html);

    const $ = cheerio.load(cover_html);

    $("article").each((index, article) => {
      if (urls.length < 5) {
        const article_url = $(article)
          .find("a")
          .first()
          .attr("href");
        if (this.validURL(article_url)) {
          urls.push(article_url);
        }
      } else {
        return true;
      }
    });
    return urls;
  }

  getSingleArticleElPais(article, url) {
    let single_article: Article = {
      title: "",
      body: "",
      source: {
        url: "",
        name: ""
      },
      image: "",
      publisher: ""
    };
    const $ = cheerio.load(article.data);

    single_article.source.url = url;
    single_article.source.name = "elpais";
    single_article.title = $("article")
      .find("h1")
      .text() as string;

    single_article.publisher = $("article")
      .find(".autor-nombre a")
      .text() as string;

    single_article.image = $("figure")
      .find("img")
      .first()
      .attr("src") as string;

    single_article.body = $("article")
      .find(".articulo-cuerpo")
      .text() as string;

    return single_article;
  }

  getArticlesHtml(urls) {
    const articles_promises = [];
    urls.forEach(async url => {
      articles_promises.push(axios.get(url));
    });

    return Promise.all(articles_promises);
  }

  async getUserArticle(url: string) {
    let response = [];
    const articles = await this.getArticlesHtml([url]);

    articles.forEach((article, index) => {
      if (url.includes("elmundo")) {
        response.push(this.getSingleArticleElMundo(article, url));
      } else if (url.includes("elpais")) {
        response.push(this.getSingleArticleElPais(article, url));
      } else {
        throw HttpException;
      }
    });
    return response;
  }

  validURL(str) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  }

  async find(article): Promise<Article> {
    let query = { "source.url": article.source.url };
    return this.articlesModel
      .findOne({
        "source.url": article.source.url
      })
      .exec();
  }

  async save(article) {
    let exists = await this.find(article);
    const newArticle = new this.articlesModel(article as Article);
    if (!exists) {
      return newArticle.save();
    }
  }
  delete(article) {}

  async getFeed() {
    return await this.articlesModel.find().exec();
  }
}
