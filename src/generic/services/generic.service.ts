import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpMessages } from "../enums/HttpMessages.enum";

@Injectable()
export class GenericService {
  public validURL(url) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator

    let splitted_url = url.split(".");
    if (splitted_url[splitted_url.length - 1] == "html")
      return !!pattern.test(url);
    else return false;
  }

  public httpException(message, status) {
    throw new HttpException(message, status);
  }

  public checkPublisher(url) {
    if (url.includes("elmundo")) {
      return "elmundo";
    } else if (url.includes("elpais")) {
      return "elpais";
    } else {
      this.httpException(
        HttpMessages.NOT_VALID_PUBLISHER,
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
