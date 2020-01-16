import { Injectable } from "@nestjs/common";
import { Article } from "../interface/articles.interface";
import { GenericService } from "../../generic/services/generic.service";

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
export class ScrapperService {
  constructor(private readonly genericService: GenericService) {}
  async scrappCoverArticleUrls(website: string, amount: number) {
    const urls: string[] = [];
    const res = await axios.get(website);

    const cover_html = res.data;
    // console.log(html);

    const $ = cheerio.load(cover_html);

    $("article").each((index, article) => {
      if (urls.length < amount) {
        const article_url = $(article)
          .find("a")
          .first()
          .attr("href");
        if (this.genericService.validURL(article_url)) {
          urls.push(article_url);
        }
      } else {
        return true;
      }
    });
    return urls;
  }

  scrapArticleElmundo(article, url): Article {
    let scrappedArticle: Article = Object.assign({}, newArticle);
    const $ = cheerio.load(article.data);

    scrappedArticle.source.url = url;
    scrappedArticle.source.name = "elmundo";
    scrappedArticle.title = $("article")
      .find("h1")
      .text() as string;

    scrappedArticle.publisher = $("article")
      .find(".ue-c-article__byline-name a")
      .text() as string;

    scrappedArticle.image = $("article")
      .find("figure img")
      .attr("src") as string;

    scrappedArticle.body = $("article")
      .find(".ue-c-article__standfirst")
      .text();

    return scrappedArticle;
  }

  scrapArticleElPais(article, url) {
    let scrappedArticle: Article = Object.assign({}, newArticle);
    const $ = cheerio.load(article.data);

    scrappedArticle.source.url = url;
    scrappedArticle.source.name = "elpais";
    scrappedArticle.title = $("article")
      .find("h1")
      .text() as string;

    scrappedArticle.publisher = $("article")
      .find(".autor-nombre a")
      .text() as string;

    scrappedArticle.image = $("figure")
      .find("img")
      .first()
      .attr("src") as string;

    scrappedArticle.body = $("article")
      .find(".articulo-cuerpo")
      .text() as string;

    return scrappedArticle;
  }
}
