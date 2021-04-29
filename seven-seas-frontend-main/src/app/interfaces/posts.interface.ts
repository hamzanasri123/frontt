import { User } from "./users.interface";

export class Post {
  _id: string;
  content: string;
  author: User;
  attachment: string;
  attachmentType: string;
  position: any;
  country: any;
  equipments: any[];
  createdAt: any;
  updatedAt: any;
  reacts: Reaction[];
  comments: number;
  tags: string[];
}

export class Reaction {
  author: User;
  reactType: string;
}

export class Comment {
  _id: string;
  content: string;
  author: User;
  post: any;
  event: any;
  createdAt: any;
}

export class Notification {
  _id: string;
  content: string;
  link: string;
  type: any;
  sender: any;
  createdAt: any;
  targetId: any;
  url: string;
  is_read: boolean;
}

export type Coords = { lat: number; lng: number };
