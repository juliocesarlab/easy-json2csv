import * as fs from "fs";
import ICsv from "./interfaces/ICsv";
import { bodyColumn } from "./types/bodyColumn";
import { headerColumn } from "./types/headerColumn";

export class CSV implements ICsv {
  lineBreak: string;
  columnDelimiter: string;
  value: string;
  header: headerColumn[];
  body: bodyColumn[];
  encoding: string;

  constructor(columnDelimiter = ";", lineBreak = "\n", encoding = "latin1") {
    this.lineBreak = lineBreak;
    this.columnDelimiter = columnDelimiter;
    this.value = "";
    this.encoding = encoding;
    this.body = [];
    this.header = [];
  }

  setEncoding(encoding: string) {
    if (!encoding)
      throw new Error("You must provide a encoding when calling this method");
    this.encoding = encoding;
    return this;
  }

  setHeader(header: headerColumn[]) {
    if (!header) throw new Error("You must provide a header object first");

    this.header = header;

    this.value = this.header
      .map((c) => c.columnName)
      .join(this.columnDelimiter)
      .concat(this.lineBreak);

    return this;
  }

  setBody(body: bodyColumn[]) {
    if (!this.header)
      throw new Error("You must set a header before calling this method");

    body.forEach((line) => {
      for (let i = 0; i < this.header.length; i++) {
        const columnValue = line[this.header[i]?.refersTo];

        if (!columnValue) {
          this.value += `  ${this.columnDelimiter}`;
          continue;
        }

        this.value += `${this.normalizeColumnValue(columnValue)} ${
          this.columnDelimiter
        }`;
      }
      this.value += this.lineBreak;
    });
    return this;
  }

  private normalizeColumnValue(columnValue: string): string {
    return columnValue
      .toString()
      .replace(/(\r\n|\n|\r)/gm, "")
      .replace(/(",")/g, " ")
      .replace(/(".")/g, "");
  }

  write(path = "./", fileName = "file.csv") {
    fs.writeFile(
      `${path}${fileName}`,
      this.value,
      this.encoding as fs.WriteFileOptions,
      (err) => console.log(err)
    );
  }
}
