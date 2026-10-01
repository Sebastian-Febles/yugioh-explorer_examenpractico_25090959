import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from './card.model';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  template: `
    <a class="tarjeta" [routerLink]="['/carta', card.id]">
      <img [src]="card.card_images[0].image_url_small" [alt]="card.name" />
      <h3>{{ card.name }}</h3>
      <p>Tipo: {{ card.type }}</p>
      @if (card.attribute) {
        <p>Atributo: {{ card.attribute }}</p>
      }
      @if (card.level !== undefined) {
        <p>Nivel: {{ card.level }}</p>
      }
      @if (card.atk !== undefined) {
        <p>ATK: {{ card.atk }}</p>
      }
      @if (card.def !== undefined) {
        <p>DEF: {{ card.def }}</p>
      }
    </a>
  `,
})
export class CardComponent {
  @Input({ required: true }) card!: Card;
}
