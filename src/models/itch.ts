export interface IItchAssetData {
  authors: IItchAssetAuthor[];
  id: number;
  cover_image: string;
  tags: string[];
  price: string;
  links: IItchAssetLinks;
  original_price: string;
  title: string;
  sale: IItchAssetSale;
}

export interface IItchAssetSale {
  title: string;
  id: number;
  end_date: string;
  rate: number;
}

export interface IItchAssetLinks {
  self: string;
  devlog: string;
  comments: string;
}

export interface IItchAssetAuthor {
  name: string;
  url: string;
}