import { Routes } from '@angular/router';
import { SearchComponent } from './search.component';
import { CardDetailComponent } from './card-detail.component';
import { BlueEyesComponent } from './blue-eyes.component';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'carta/:id', component: CardDetailComponent },
  { path: 'blue-eyes', component: BlueEyesComponent },
  { path: '**', redirectTo: '' },
];
