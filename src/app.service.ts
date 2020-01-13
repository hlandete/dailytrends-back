import { Injectable } from "@nestjs/common";
const cheerio = require("cheerio");
const axios = require("axios");
interface Article {
  title: string;
  body: string;
  source: string;
  image: string;
  publisher: string;
}

@Injectable()
export class AppService {
  async getNewsElMundo() {
    const response = [];

    const urls = await this.getCoverNewsURL("https://www.elmundo.es/");

    const articles = await this.getArticlesData(urls);

    articles.forEach((article, index) => {
      const item: Article = {
        title: "",
        body: "",
        source: "",
        image: "",
        publisher: ""
      };

      const $ = cheerio.load(article.data);

      item.source = urls[index];
      item.title = $("article")
        .find("h1")
        .text() as string;

      item.publisher = $("article")
        .find(".ue-c-article__byline")
        .text() as string;

      item.image = $("article")
        .find("img")
        .attr("src") as string;

      item.body = $("article")
        .find(".ue-c-article__body")
        .text() as string;

      response.push(item);

      console.log(response);
    });
    return response;
  }

  async getNewsElPais() {
    const response = [];

    const urls = await this.getCoverNewsURL("https://www.elpais.com/");

    const articles = await this.getArticlesData(urls);

    articles.forEach((article, index) => {
      const item: Article = {
        title: "",
        body: "",
        source: "",
        image: "",
        publisher: ""
      };

      const $ = cheerio.load(article.data);

      item.source = urls[index];
      item.title = $("article")
        .find("h1")
        .text() as string;

      item.publisher = $("article")
        .find(".autor-nombre a")
        .text() as string;

      item.image = $("figure")
        .find("img")
        .first()
        .attr("src") as string;

      item.body = $("article")
        .find(".articulo-cuerpo")
        .text() as string;

      response.push(item);

      console.log(response);
    });
    return response;
  }

  async getCoverNewsURL(website) {
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

  getArticlesData(urls) {
    const articles_promises = [];
    urls.forEach(async url => {
      articles_promises.push(axios.get(url));
    });

    return Promise.all(articles_promises);
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
}
