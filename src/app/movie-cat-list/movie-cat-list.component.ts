import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-movie-cat-list',
  templateUrl: './movie-cat-list.component.html',
  styleUrls: ['./movie-cat-list.component.scss']
})
export class MovieCatListComponent implements OnInit {

  @Input() title: string;
  @Input() url: string ;
  public movies$: Observable<Movie[]>;

  constructor(private movieSrvc: MovieService){}

  ngOnInit(): void {

    this.movies$ = this.movieSrvc.getMoviesByCategory(this.url);

  }

}
