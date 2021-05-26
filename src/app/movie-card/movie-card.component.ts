import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Movie } from '../models/movie';
import { MovieService } from '../services/movie.service';
import movieTrailer from 'movie-trailer';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  host:{
    'class': 'movie-card'
  },
  animations:[
    trigger('fadeIn', [
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

    this.timerID = setTimeout( () => { this.showTrailer=true; }, 2000 );
  }

  @HostListener('mouseleave', ['$event'])
  private mouseLeave(event){

    this.showTrailer=false;
    this.isActive = false;

    clearTimeout(this.timerID);
  }

  public isActive: boolean = false;
  public showTrailer: boolean = false;
  public timerID: any = null;
  public height: string = '';
  public generes$: Observable<string[]> = null;
  public trailerUrl: SafeResourceUrl = null;

  constructor(private el: ElementRef, private movieSrvc: MovieService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {

    this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube-nocookie.com/embed/N9HkhRPhTJ8?controls=0&autoplay=1');

    this.generes$ = this.movieSrvc.getGenereName(this.movie.genreIDs).pipe(shareReplay(1));

    movieTrailer(null ,{tmdbId: this.movie.id, id: true}).then( (videoId: string) => {

      if(videoId){
        this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube-nocookie.com/embed/'+videoId+'?controls=0&autoplay=1');
      }

    });

    this.height = this.el.nativeElement.clientHeight+"px";
  }

}
