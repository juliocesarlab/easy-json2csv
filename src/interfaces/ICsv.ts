import { headerColumn } from "../types/headerColumn";

export default interface ICsv {
  lineBreak: string;
  columnDelimiter: string;
  value: string;
  header: headerColumn[];
  body: unknown[];
  encoding: string;
}
