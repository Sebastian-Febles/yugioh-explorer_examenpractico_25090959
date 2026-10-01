import { Component, computed, inject, signal } from '@angular/core';
import { Card, Estado } from './card.model';
import { CardComponent } from './card.component';
import { YugiohService } from './yugioh.service';

@Component({
  selector: 'app-blue-eyes',
  imports: [CardComponent],
  template: `
    <h2>Blue-Eyes Collection</h2>

    @switch (estado()) {
      @case ('cargando') {
        <p class="aviso">Cargando...</p>
      }
      @case ('vacio') {
        <p class="aviso">No se encontraron cartas Blue-Eyes.</p>
      }
      @case ('error') {
        <p class="aviso error">Ocurrió un error al consultar la API.</p>
      }
      @case ('exito') {
        <label>Expansión:</label>
        <select #lista (change)="elegir(lista.value)">
          <option value="">Todas las expansiones</option>
          @for (expansion of expansiones(); track expansion) {
            <option [value]="expansion">{{ expansion }}</option>
          }
        </select>
        <p>Cartas mostradas: {{ filtradas().length }}</p>

        <div class="lista">
          @for (carta of filtradas(); track carta.id) {
            <app-card [card]="carta" />
          }
        </div>
      }
    }
  `,
})
export class BlueEyesComponent {
  private servicio = inject(YugiohService);

  estado = signal<Estado>('cargando');
  cartas = signal<Card[]>([]);
  seleccion = signal('');

  expansiones = computed(() => {
    const nombres = this.cartas().flatMap((carta) =>
      (carta.card_sets ?? []).map((set) => set.set_name)
    );
    return [...new Set(nombres)].sort();
  });

  filtradas = computed(() => {
    if (this.seleccion() === '') {
      return this.cartas();
    }
    return this.cartas().filter((carta) =>
      (carta.card_sets ?? []).some((set) => set.set_name === this.seleccion())
    );
  });

  constructor() {
    this.servicio.obtenerBlueEyes().subscribe({
      next: (cartas) => {
        this.cartas.set(cartas);
        this.estado.set(cartas.length === 0 ? 'vacio' : 'exito');
      },
      error: () => this.estado.set('error'),
    });
  }

  elegir(expansion: string) {
    this.seleccion.set(expansion);
  }
}
