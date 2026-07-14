export interface Dependencia {
    id?: number;
    nombre: string;
    direccion?: string;
    telefono?: string;
    correo: string;
    activo?: boolean;
    fechaRegistro?: string;
    fechaActualizacion?: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}
