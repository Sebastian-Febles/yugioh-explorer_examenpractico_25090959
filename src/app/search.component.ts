import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { Card, Estado } from './card.model';
import { CardComponent } from './card.component';
import { YugiohService } from './yugioh.service';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule, CardComponent],
  template: `
    <h2>Buscador de cartas</h2>
    <input type="text" [formControl]="busqueda" placeholder="Ejemplo: Dark Magician" />

    @switch (estado()) {
      @case ('inicio') {
        <p class="aviso">Escribe el nombre de una carta para buscar.</p>
      }
      @case ('cargando') {
        <p class="aviso">Cargando...</p>
      }
      @case ('vacio') {
        <p class="aviso">No se encontraron cartas.</p>
      }
      @case ('error') {
        <p class="aviso error">Ocurrió un error al consultar la API. Intenta de nuevo.</p>
      }
      @case ('exito') {
        <div class="lista">
          @for (carta of cartas(); track carta.id) {
            <app-card [card]="carta" />
          }
        </div>
      }
    }
  `,
})
export class SearchComponent {
  private servicio = inject(YugiohService);

  busqueda = new FormControl('', { nonNullable: true });
  estado = signal<Estado>('inicio');
  cartas = signal<Card[]>([]);

  constructor() {
    this.busqueda.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter((texto) => texto.trim() !== ''),
        tap(() => this.estado.set('cargando')),
        switchMap((texto) =>
          this.servicio.buscarPorNombre(texto.trim()).pipe(
            catchError(() => of(null))
          )
        )
      )
      .subscribe((resultado) => {
        if (resultado === null) {
          this.estado.set('error');
        } else if (resultado.length === 0) {
          this.estado.set('vacio');
        } else {
          this.cartas.set(resultado);
          this.estado.set('exito');
        }
      });
  }
}
