
export interface SuperLinea {
    id: number;
    denominacion: string;
    observacion?: string | null;
    lineas?: any[];
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    sistema?: number;
}