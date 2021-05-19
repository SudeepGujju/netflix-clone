import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public isScrolled: Boolean = false;
  //@ts-ignore
  private scrollSubscription: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.scrollSubscription = fromEvent(window, 'scroll').subscribe( ($event) => {
      if(window.pageYOffset > 40){
          this.isScrolled = true;
      }else{
        this.isScrolled = false;
      }

    });
  }

  ngOnDestroy(){
    this.scrollSubscription.unsubscribe()
  }

}
