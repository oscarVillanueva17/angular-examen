import { Routes } from '@angular/router';
import { DependenciasComponent } from './components/dependencias/dependencias.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dependencias', pathMatch: 'full' },
    { path: 'dependencias', component: DependenciasComponent }
];
