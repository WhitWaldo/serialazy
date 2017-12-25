import { deflate, inflate } from '../../serialazy';
import Constructable from '../../types/constructable';
import { JsonMap } from '../../types/json_type';

/** JSON serializer for serializables */
export default <TOriginal>(type: Constructable.Default<TOriginal>) => ({
    type,
    down: (value: TOriginal) => deflate(value),
    up: (value: JsonMap) => inflate(type, value)
});