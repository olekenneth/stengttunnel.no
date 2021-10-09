export interface IRoad {
  roadName: string;
  urlFriendly: string;
  url: string;
  messages: IMessage[];
  status: "green" | "yellow" | "red";
  statusMessage: string;
  statusCode: 10 | 20 | 30;
}

export enum ISource {
  UserReported = "Brukerskapt melding",
  StatensVegvesen = "Statens Vegvesen",
}

interface IMessage {
  source: ISource;
  type: string;
  validFrom: string;
  validTo: string;
  message: string;
}

export interface IRoadStatus {
  messages: IMessage[];
  status: "green" | "yellow" | "red";
  statusMessage: string;
  statusCode: 10 | 20 | 30;
}

export interface IGPS {
  lat: number;
  lon: number;
}

export type IFavorite = string;
