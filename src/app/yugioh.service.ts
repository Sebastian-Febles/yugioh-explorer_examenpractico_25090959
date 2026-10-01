import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Card, CardResponse } from './card.model';

@Injectable({ providedIn: 'root' })
export class YugiohService {
  private http = inject(HttpClient);
  private url = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

  private pedir(params: Record<string, string>): Observable<Card[]> {
    return this.http.get<CardResponse>(this.url, { params }).pipe(
      map((respuesta) => respuesta.data),
      catchError((error) => (error.status === 400 ? of([]) : throwError(() => error)))
    );
  }

  buscarPorNombre(nombre: string): Observable<Card[]> {
    return this.pedir({ fname: nombre });
  }

  obtenerPorId(id: string): Observable<Card[]> {
    return this.pedir({ id });
  }

  obtenerBlueEyes(): Observable<Card[]> {
    return this.pedir({ archetype: 'Blue-Eyes' });
  }
}
