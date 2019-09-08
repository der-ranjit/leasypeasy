export namespace Common {
    export function createUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
}