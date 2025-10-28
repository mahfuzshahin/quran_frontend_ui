export class News{
  id:number | undefined;
  title:string | undefined;
  content:string | undefined;
  categoryIds:number | undefined;
  tagIds:number | undefined;
  author_id:number | undefined;
  attachment_id:number | undefined;
  status:string | undefined;
  publishAt:string | undefined;
  isFeatured:boolean = false;
  isBreaking:boolean = false;
}
