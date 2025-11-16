import {Ayat} from "./ayat";
import {Tag} from "./tag";

export class Keyword{
  ayat_id:number | undefined;
  tag_id:number | undefined;
  ayat:Ayat = new Ayat();
  tag:Tag = new Tag();
}
