import { Entity, EntityProps } from "../shared/Entity";

import { Book } from "../book/Book";


interface PartialUserProps {

    email: string;
    password:string;
    books: Book;

}

type UserProps = PartialUserProps & EntityProps;

export class User extends Entity {

    readonly email: string;
    readonly password: string;
    readonly books : Book

    constructor(props: UserProps) {
        super({id: props.id, createdAt: props.createdAt})

        this.email = props.email,
        this.password = props.password,
        this.books = props.books


    }
    
    

}