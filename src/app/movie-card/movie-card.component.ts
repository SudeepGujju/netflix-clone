import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Movie } from '../models/movie';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  host:{
    'class': 'movie-card'
  },
  animations:[
    trigger('fade', [
      transition( 'void => *', [
        style({opacity: 0}),
        animate(500, style({opacity: 1}))
      ])
    ])
  ]
})
export class MovieCardComponent implements OnInit {

  @Input() movie: Movie;

  @HostListener('mouseenter', ['$event'])
  private mouseEnter(event){
    this.isActive = true;
  }

  @HostListener('mouseleave', ['$event'])
  private mouseLeave(event){
    this.isActive = false;
  }

  public isActive: boolean = false;
  public height: string = '';
  public generes$: Observable<string[]> = null;

  constructor(private el: ElementRef, private movieSrvc: MovieService) { }

  ngOnInit(): void {
    this.generes$ = this.movieSrvc.getGenereName(this.movie.genreIDs);

    this.height = this.el.nativeElement.clientHeight+"px";
  }

}
