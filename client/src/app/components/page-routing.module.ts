import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FuncionariosComponent } from './pages/funcionarios/funcionarios.component';
import { ContenidosComponent } from './pages/contenidos/contenidos.component';

const routes: Routes = [
  { path: '', component: FuncionariosComponent },
  { path: 'funcionarios', component: FuncionariosComponent },
  { path: 'contenidos', component: ContenidosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageRoutingModule {}
