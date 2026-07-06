import { Entity, EntityProps } from "../shared/Entity";

 export enum BookStatus {
  PUBLISHED = "PUBLISHED",
  SOLD = "SOLD"
}

export enum BookGenre {
  FANTASY = "FANTASY",
  SCIFI ="SCIFI",
  BIOGRAPHY = "BIOGRAPHY",
  HISTORY = "HISTORY",
  NOVEL = "NOVEL",
}

interface PartialBookProps {
    title: string;
    description: string;
    author:string;
    price: number;
    genre: BookGenre;
    ownerId: number;
    status : BookStatus;
    soldAt: Date | null

}

type BookProps = PartialBookProps & EntityProps;


export class Book extends Entity {
    readonly title: string;
    readonly description: string;
    readonly price: number;
    readonly author: string;
    readonly genre: BookGenre;
    readonly ownerId: number;
    readonly status: BookStatus;
    readonly soldAt:Date | null; 
    
    


    constructor(props:BookProps) {
        super({id: props.id, createdAt: props.createdAt, updatedAt: props.updatedAt})

        this.title = props.title;
        this.description = props.description;
        this.price = props.price;
        this.author = props.author;
        this.genre = props.genre;
        this.status = props.status
        this.ownerId = props.ownerId;
        this.soldAt = props.soldAt;
        
        
    }



}