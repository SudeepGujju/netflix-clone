import { Component, OnInit } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { Movie } from '../models/movie';
import { base_url, request } from '../constants/url';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public bannerMovies$: Observable<Movie[]>;
  public categoryList: {title: string, url: string}[];

  constructor(private movieSrvc: MovieService){
  }

  ngOnInit(){

    this.bannerMovies$ = this.movieSrvc.getBannerMovies().pipe(take(1));

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
