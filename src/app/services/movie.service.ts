import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { base_url, image_base_url, request } from '../constants/url';
import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root',
})
export class MovieService {

  private _genres$: Observable<string[]> = null;

  constructor(private http: HttpClient) {}

  public getBannerMovie() {
    return this.http.get<Movie>(base_url + request.fetchNetflixOriginals).pipe(
      map((data: any) => {
        const result =
          data.results[Math.floor(Math.random() * data.results.length - 1)];

        const movie = new Movie();
        movie.id = result.id;
        movie.name = result.title || result.original_name;
        movie.image = image_base_url + result.backdrop_path;
        movie.desc = result.overview;
        movie.votesAverage = result.vote_average;

        return movie;
      })
    );
  } //getBannerMovie

  public getBannerMovies() {

    return this.http
      .get<Movie[]>(base_url + request.fetchNetflixOriginals)
      .pipe(
        map( (data: any) => data.results ),
        map( (moviesList: any) => {
          let randomNumbers = [];
          while (randomNumbers.length < 5) {
            var r = Math.floor(Math.random() * moviesList.length);
            if (randomNumbers.indexOf(r) === -1) randomNumbers.push(r);
          }

          return randomNumbers.map((number) => {
            const result = moviesList[number];

            const movie = new Movie();
            movie.id = result.id;
            movie.name = result.title || result.original_name;
            movie.image = image_base_url + result.backdrop_path;
            movie.desc = result.overview;
            movie.votesAverage = result.vote_average;

            return movie;
          });
        })
      );
  } //getBannerMovie

  public getMoviesByCategory(url: string) {
    return this.http.get<Movie[]>(url).pipe(
      map((data: any) => {
        return data.results.map((result: any) => {//.slice(0, 2)
          const movie = new Movie();
          movie.id = result.id;
          movie.name = result.title || result.original_name;
          movie.image = image_base_url + result.backdrop_path; //poster_path
          movie.desc = result.overview;
          movie.genreIDs = result.genre_ids;
          movie.votesAverage = result.vote_average;

          return movie;
        });
      })
    );
  } //getBannerMovie

  private getMovieGenresList(){

    if(this._genres$ == null){

      this._genres$ = this.http.get(base_url + request.fetchMoviesGenres).pipe(
        shareReplay(1),
        map( (data: any) => {
          return data.genres;
        })
      )
    }

    return this._genres$;

  }//getMovieGeneresList

  public getGenereName(generIDs: number[]){

    return this.getMovieGenresList().pipe(
        map( (genres: any) => {
          let genreIndexes = generIDs.map( (id) => {
            return genres.findIndex( (genre: any) => genre.id == id );
          }).filter( x => x >= 0 );

          return genreIndexes.map( (genreIndex: number) => { return genres[genreIndex].name });
        })
      );

  }

  private getTvGenresList(){
    return this.http.get(base_url + request.fetchTvGenres).pipe(
      map( (data: any) => {
        return data.genres;
      })
    )
  }//getTvGeneresList
}
