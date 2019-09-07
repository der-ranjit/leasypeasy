export interface GameObject {
    id: string;
    update(delta: number): void;
    destroy(): void;
}
export function isGameObject(object: any): object is GameObject {
    return (object as GameObject).destroy !== undefined;
} 