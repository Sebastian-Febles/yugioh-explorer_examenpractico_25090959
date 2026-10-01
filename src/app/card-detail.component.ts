import { Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Card, Estado } from './card.model';
import { YugiohService } from './yugioh.service';

@Component({
  selector: 'app-card-detail',
  template: `
    <button class="volver" (click)="volver()">Volver</button>

    @switch (estado()) {
      @case ('cargando') {
        <p class="aviso">Cargando...</p>
      }
      @case ('vacio') {
        <p class="aviso">No se encontró la carta.</p>
      }
      @case ('error') {
        <p class="aviso error">Ocurrió un error al consultar la API.</p>
      }
      @case ('exito') {
        @if (carta(); as c) {
          <div class="detalle">
            <img [src]="c.card_images[0].image_url" [alt]="c.name" />
            <div>
              <h2>{{ c.name }}</h2>
              <p>Tipo: {{ c.type }}</p>
              @if (c.attribute) {
                <p>Atributo: {{ c.attribute }}</p>
              }
              @if (c.level !== undefined) {
                <p>Nivel: {{ c.level }}</p>
              }
              @if (c.atk !== undefined) {
                <p>ATK: {{ c.atk }}</p>
              }
              @if (c.def !== undefined) {
                <p>DEF: {{ c.def }}</p>
              }
              @if (c.archetype) {
                <p>Arquetipo: {{ c.archetype }}</p>
              }
              <p>Descripción: {{ c.desc }}</p>
            </div>
          </div>

          @if (c.card_sets && c.card_sets.length > 0) {
            <h3>Impresiones</h3>
            <table>
              <tr>
                <th>Expansión</th>
                <th>Código</th>
                <th>Rareza</th>
                <th>Precio</th>
              </tr>
              @for (set of c.card_sets; track $index) {
                <tr>
                  <td>{{ set.set_name }}</td>
                  <td>{{ set.set_code }}</td>
                  <td>{{ set.set_rarity }}</td>
                  <td>$ {{ set.set_price }}</td>
                </tr>
              }
            </table>
          }
        }
      }
    }
  `,
})
export class CardDetailComponent {
  private servicio = inject(YugiohService);
  private ruta = inject(ActivatedRoute);
  private location = inject(Location);

  estado = signal<Estado>('cargando');
  carta = signal<Card | null>(null);

  constructor() {
    const id = this.ruta.snapshot.paramMap.get('id') ?? '';

    this.servicio.obtenerPorId(id).subscribe({
      next: (cartas) => {
        if (cartas.length === 0) {
          this.estado.set('vacio');
        } else {
          this.carta.set(cartas[0]);
          this.estado.set('exito');
        }
      },
      error: () => this.estado.set('error'),
    });
  }

  volver() {
    this.location.back();
  }
}
