import * as fs from "fs";

export default class CSV {
  constructor(columnDelimiter = ";", lineBreak = "\n", encoding = "latin1") {
    this.lineBreak = lineBreak;
    this.columnDelimiter = columnDelimiter;
    this.value = "";
    this.header = null;
    this.body = null;
    this.encoding = encoding;
  }

  setEncoding(encoding) {
    if (!encoding)
      throw new Error("You must provide a encoding when calling this method");
    this.encoding = encoding;
    return this;
  }

  setHeader(header) {
    if (!header) throw new Error("You must provide a header object first");

    this.header = header;

    this.value = this.header
      .map((c) => c.columnName)
      .join(this.columnDelimiter)
      .concat(this.lineBreak);

    return this;
  }

  setBody(body) {
    if (!this.header)
      throw new Error("You must set a header before calling this method");

    body.forEach((line) => {
      for (let i = 0; i < this.header.length; i++) {
        const columnValue = line[this.header[i]?.refersTo];

        if (!columnValue) {
          this.value += `  ${this.columnDelimiter}`;
          continue;
        }

        this.value += `${columnValue} ${this.columnDelimiter}`;
      }
      this.value += this.lineBreak;
    });
    return this;
  }

  write(path = "./", fileName = "file.csv") {
    fs.writeFile(`${path}${fileName}`, this.value, this.encoding, (err) =>
      console.log(err)
    );
  }
}
