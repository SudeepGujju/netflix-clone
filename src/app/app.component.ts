import { Component } from '@angular/core';
import { Movie } from './models/movie';
import { MovieService } from './services/movie.service';
import { base_url, request } from './constants/url';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'Netflix Clone';

  public bannerMovies$: Observable<Movie[]>;
  public categoryList: {title: string, url: string}[];

  constructor(private movieSrvc: MovieService){
  }

  ngOnInit(){

    this.bannerMovies$ = this.movieSrvc.getBannerMovies();

    this.categoryList = [

      {title: "Trending Now", url: base_url+request.fetchTrending},
      {title: "Top Rated", url: base_url+request.fetchTopRated},
      {title: "Action Movies", url: base_url+request.fetchActionMovies},
      {title: "Comedy Movies", url: base_url+request.fetchComedyMovies},
      {title: "Horror Movies", url: base_url+request.fetchHorrorMovies},
      {title: "Romance Movies", url: base_url+request.fetchRomanceMovies},
      {title: "Documentaries", url: base_url+request.fetchDocumentaries}
    ];

  }
}
