import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-movie-cat-list',
  templateUrl: './movie-cat-list.component.html',
  styleUrls: ['./movie-cat-list.component.scss'],
  animations:[
    trigger('fadeInOutLeft', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateX(-100%)'}),
        animate('400ms 250ms cubic-bezier(.42,0,.58,1)')
      ]),
      transition(':leave', [
        animate('400ms 0s cubic-bezier(.42,0,.58,1)', style({opacity: 0, transform: 'translateX(-100%)'}))
      ])
    ]),
    trigger('fadeInOutRight', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateX(+100%)'}),
        animate('250ms 0s cubic-bezier(.42,0,.58,1)')
      ]),
      transition(':leave', [
        animate('250ms 0s cubic-bezier(.42,0,.58,1)', style({opacity: 0, transform: 'translateX(+500%)'}))
      ])
    ])
  ]
})
export class MovieCatListComponent implements OnInit {

  @Input() title: string;
  @Input() url: string ;
  public movies$: Observable<Movie[]>;

  public isListHovered: boolean = false;
  public showExploreAll: boolean = false;

  constructor(private movieSrvc: MovieService){}

  ngOnInit(): void {

    this.movies$ = this.movieSrvc.getMoviesByCategory(this.url);

  }

}
