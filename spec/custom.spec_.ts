import chai = require('chai');

import Jsonify from '../src/jsonify';
import Serialize from '../src/serialize';

const { expect } = chai;

class Author {

    @Serialize()
    public name: string;

    public books: Array<Book>;

}

class Book {

    @Serialize({ nullable: true })
    public author: Author;

    @Serialize.Custom({ down: (val: Date) => val.toISOString(), up: (val) => new Date(val) })
    public releaseDate: Date;

    @Serialize()
    public title: string;

    @Serialize.Custom({
        down: (val: Map<number, string>) => Array.from(val).map(([page, title]) => ({ page, title })),
        up: (val) => new Map(val.map<[number, string]>(ch => [ch.page, ch.title])),
    })
    public contents: Map<number, string>;

}

describe('custom serializers', () => {

    it('works', () => {

        const book = new Book();
        const jsonObj = Jsonify.toJsonObject(book);

        const bookObj = Jsonify.fromJsonObject(Book, jsonObj);

    });

});
