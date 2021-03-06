import { deflate, inflate, Serialize } from './@lib/serialazy';

import chai = require('chai');
const { expect } = chai;

// *** Class definitions

@Serialize.Type({
    down: (point: Point) => [point.x, point.y],
    up: (tuple) => Object.assign(new Point(), { x: tuple[0], y: tuple[1] })
})
class Point {
    public x: number;
    public y: number;
}

class Shape {
    @Serialize() public position: Point;
}

class Circle extends Shape { // inherits props & serializers from Shape
    @Serialize() public radius: number;
}

// *** Create instance
const circle = Object.assign(new Circle(), {
    position: Object.assign(new Point(), { x: 23, y: 34 }),
    radius: 11
});

// *** Serialize
const serialized = deflate(circle);

expect(serialized).to.deep.equal({
    position: [23, 34],
    radius: 11
});

// *** Deserialize
const deserialized = inflate(Circle, serialized);

expect(deserialized instanceof Circle).to.equal(true);
expect(deserialized).to.deep.equal(circle);
