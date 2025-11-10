import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NotificationComponent } from './components/notification/notification.component';
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { HighlightDirective } from './directives/highlight.directive';
import { HomeComponent } from './components/home/home.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    NotificationComponent,
    CurrencyFormatPipe,
    TruncatePipe,
    HighlightDirective,
    HomeComponent,
    NotfoundComponent,
    AboutComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    NotificationComponent,
    CurrencyFormatPipe,
    TruncatePipe,
    HighlightDirective,
    NotfoundComponent,
    RouterModule
  ]
})
export class SharedModule { }
