import { deflate, inflate, Serialize } from './@lib/serialazy';

import chai = require('chai');
const { expect } = chai;

// *** Class definition
class Book {

    // "Serialize" decorator can accept options:
    // * `optional` allows property to be `undefined` (default: `false`)
    // * `nullable` allows property to be `null (default: `false`)
    // * `name` allows to override property name
    @Serialize({ optional: true }) public isbn: string;

    @Serialize({ name: 'summary' }) public description: string;

}

// *** Create instance
const book = Object.assign(new Book(), {
    description: 'Descriptive text',
    // Note that "isbn" is undefined and it won't throw during deserialization because `optional: true`
});

// *** Serialize
const serialized = deflate(book);

expect(serialized).to.deep.equal({
    summary: 'Descriptive text' // note that "description" is mapped to "summary" in serialized object
});

// *** Deserialize
const deserialized = inflate(Book, serialized);

expect(deserialized instanceof Book).to.equal(true);
expect(deserialized).to.deep.equal(book);
