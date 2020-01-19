import { Injectable, HttpStatus } from "@nestjs/common";
import { Article } from "../interface/articles.interface";
import { GenericService } from "../../generic/services/generic.service";

const webscraper = require("web-scraper-js");
const cheerio = require("cheerio");
const axios = require("axios");

const scrapTags = {
  elmundo: {
    title: "h1",
    author: ".ue-c-article__byline-name",
    body: ".ue-l-article__body",
    image: [".ue-c-article__media--image", "src"]
  },
  elpais: {
    title: "h1",
    author: "autor-nombre a",
    body: ".articulo__contenedor",
    image: ["article > img", "src"]
  }
};

const newArticle = {
  title: "",
  body: "",
  source: "",
  image: "",
  publisher: "",
  author: ""
};

@Injectable()
export class ScrapperService {
  constructor(private readonly genericService: GenericService) {}

  async scrappCoverArticleUrls(website: string, amount: number) {
    const urls: string[] = [];
    const res = await axios.get(website);

    const cover_html = res.data;

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

  async srapArticle(url): Promise<Article> {
    let publisher = this.genericService.checkPublisher(url);
    let result = await webscraper.scrape({
      url: url,
      tags: {
        text: {
          title: scrapTags[publisher].title,
          author: scrapTags[publisher].author,
          body: scrapTags[publisher].body
        },
        attribute: {
          image: scrapTags[publisher].image
        }
      }
    });

    result.source = url;
    result.publisher = publisher;

    return this.parseToArticle(result);
  }

  parseToArticle(scrappedArticle): Article {
    let article: Article = Object.assign({}, newArticle);

    article.title = scrappedArticle.title.find(
      element => typeof element !== "undefined"
    );
    article.body = scrappedArticle.body.find(
      element => typeof element !== "undefined"
    );
    article.image = scrappedArticle.image.find(
      element => typeof element !== "undefined"
    );
    article.author = scrappedArticle.author.find(
      element => typeof element !== "undefined"
    );
    article.publisher = scrappedArticle.publisher;
    article.source = scrappedArticle.source;

    return article; //this.removeUndefined(article);
  }

  removeUndefined(article) {
    Object.keys(article).forEach(function(key) {
      if (typeof article[key] === "undefined") {
        article[key] = "unknown";
      }
    });

    return article;
  }
}
