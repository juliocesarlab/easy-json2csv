import { promises as fs } from "fs";
import { ReadableOptions, Stream } from "stream";
import ICsv from "./interfaces/ICsv";
import { bodyColumn } from "./types/bodyColumn";
import { headerColumn } from "./types/headerColumn";
import { writeAsStreamOptions } from "./types/writeAsStreamOptions";

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

  async write(folderPath = "./", fileName = "file.csv") {
    const folderExists = await fs
      .opendir(folderPath)
      .then(() => true)
      .catch(() => false);

    if (!folderExists) {
      await fs.mkdir(folderPath, { recursive: true });
    }

    await fs.writeFile(
      `${folderPath}${fileName}`,
      this.value,
      this.encoding as fs.CreateWriteStreamOptions
    );

    return this;
  }

  async writeAsStream(options: writeAsStreamOptions): Promise<Stream> {
    const { encoding, hasSpecialChars } = options;

    if (hasSpecialChars) {
      await this.addSpecialCharsSupport();
    }

    const stream = await this.getStream(encoding);

    return stream;
  }

  private async getStream(encoding: string = "latin1"): Promise<Stream> {
    const stream = Stream.Readable.from(this.value, {
      encoding: encoding ?? "latin1",
    } as ReadableOptions);

    return stream;
  }

  private async addSpecialCharsSupport() {
    const BOM = "\ufeff";
    this.value = `${BOM}${this.value}`;
  }

  private normalizeColumnValue(columnValue: unknown): unknown {
    if (typeof columnValue !== "string") return columnValue;

    return columnValue
      .toString()
      .replace(/(\r\n|\n|\r)/gm, "")
      .replace(/(",")/g, " ")
      .replace(/(".")/g, "");
  }
}
