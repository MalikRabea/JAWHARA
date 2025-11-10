import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChecklayoutComponent } from './checklayout/checklayout.component';

const routes: Routes = [
  { path: '', component: ChecklayoutComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }
