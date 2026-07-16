import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dependencia, PageResponse } from '../models/dependencia.model';

@Injectable({ providedIn: 'root' })
export class DependenciaService {
    private http = inject(HttpClient);
    private url = 'http://localhost:8080/api/dependencias';
    private urlDependenciasConteo = 'http://localhost:8080/api/dependencias/total'

    listar(filters: any, page = 0, size = 10): Observable<PageResponse<Dependencia>> {
        let params = new HttpParams().set('page', page).set('size', size);
        Object.entries(filters).forEach(([k, v]) => v != null && v !== '' && (params = params.set(k, String(v))));
        return this.http.get<PageResponse<Dependencia>>(this.url, { params });
    }

    obtenerTotales(): Observable<{ activas: number, inactivas: number }> {
        return this.http.get<{ activas: number, inactivas: number }>(this.urlDependenciasConteo);
    }

    crear(d: Dependencia) { return this.http.post<Dependencia>(this.url, d); }
    actualizar(id: number, d: Dependencia) { return this.http.put<Dependencia>(`${this.url}/${id}`, d); }
    eliminar(id: number) { return this.http.delete(`${this.url}/${id}`); }
    toggle(id: number) { return this.http.patch<Dependencia>(`${this.url}/${id}/toggle`, {}); }
}