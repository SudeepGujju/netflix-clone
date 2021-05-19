import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Movie } from '../models/movie';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannerComponent implements OnInit {

  @Input() movie: Movie;

  constructor() {
  }

  ngOnInit(): void {
    // console.log(this.movie)
  }

}
