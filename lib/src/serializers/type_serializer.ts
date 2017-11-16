import Constructable from '../types/constructable';
import JsonType from '../types/json_type';
import Provider from '../types/provider';
import BooleanSerializer from './boolean_serializer';
import Metadata from './metadata';
import NumberSerializer from './number_serializer';
import SerializableSerializer from './serializable_serializer';
import StringSerializer from './string_serializer';

/** Generic type serializer */
interface TypeSerializer<TSerialized, TOriginal> {
    /** Serialization function */
    down: (value: TOriginal) => TSerialized;
    /** Deserialization function */
    up: (value: TSerialized) => TOriginal;
}

namespace TypeSerializer {

    /** Creates a provider function. When called it tries to pick a default serializer for given property based on its type */
    export function getProviderFor(target: Object, propertyName: string): Provider<TypeSerializer<JsonType, any>> {
        return () => createFor(target, propertyName);
    }

    /** Factory method tries to pick a default serializer for given property based on its type */
    export function createFor(target: Object, propertyName: string): TypeSerializer<JsonType, any> {

        const ctor: Constructable<any> = Reflect.getMetadata('design:type', target, propertyName);

        if (ctor === undefined) {
            throw new Error('Unable to fetch type information. Hint: Enable TS options: "emitDecoratorMetadata" and "experimentalDecorators"');
        }

        if (ctor === String) {
            return new StringSerializer();
        } else if (ctor === Number) {
            return new NumberSerializer();
        } else if (ctor === Boolean) {
            return new BooleanSerializer();
        } else if (ctor.prototype && Metadata.getFor(ctor.prototype)) { // Serializable
            return new SerializableSerializer(ctor);
        } else {
            const className = target.constructor.name;
            throw new Error(
                `No default serializer for property: "${className}.${propertyName}" ('design:type': "${ctor.name}"). ` +
                'Hint: Use serializable type or provide a custom serializer. You may be affected by this issue: https://github.com/Microsoft/TypeScript/issues/18995. Try to specify property type explicitely.'
            );
        }

    }

}

export default TypeSerializer;
