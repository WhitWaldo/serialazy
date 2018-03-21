import chai = require('chai');

import { deflate, Serialize } from './@lib/serialazy';

const { expect } = chai;

describe.skip('custom type serializer', () => {

    @Serialize.Type({
        down: (val: Point) => `(${val.x},${val.y})`,
        up: (val) => {
            const match = val.match(/^\((\d)+,(\d)+\)$/);
            expect(match).to.not.equal(null);
            const [, xStr, yStr] = match;
            return Object.assign(new Point(), { x: Number.parseInt(xStr), y: Number.parseInt(yStr) });
        }
    })
    class Point {
        public x: number;
        public y: number;
    }

    it('is able to serialize a type instance', () => {
        const point = Object.assign(new Point(), { x: 2, y: 3 });
        const serialized = deflate(point);
        expect(serialized).to.equal('(2,3)');
    });

    // it('is able to deserialize a type instance', () => {
    //     const serialized = '(4,5)';
    //     const point = inflate(Point, serialized);
    //     expect(point).to.deep.equal({ x: 4, y: 5 });
    // });


    // What to do with property serializers ???

});
