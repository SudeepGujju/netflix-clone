import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from './modules/material.module';
import { BannerComponent } from './banner/banner.component';
import { HttpClientModule } from '@angular/common/http';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { MovieCatListComponent } from './movie-cat-list/movie-cat-list.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { CarousalModule } from './modules/carousal/carousal.module';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BannerComponent,
    MovieCardComponent,
    MovieCatListComponent,
    TruncatePipe,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    AppRoutingModule,
    CarousalModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
