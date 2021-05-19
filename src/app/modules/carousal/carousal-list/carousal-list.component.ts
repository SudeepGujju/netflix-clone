import { animate, style, AnimationBuilder } from '@angular/animations';
import { ListKeyManager } from '@angular/cdk/a11y';
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  QueryList,
  Renderer2,
  ViewChild,
  EventEmitter,
  ContentChildren,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { BehaviorSubject, interval, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CarousalCardComponent } from '../carousal-card/carousal-card.component';

enum Direction {
  Left,
  Right,
  Index,
}

type Orientation = 'ltr' | 'rtl';

@Component({
  selector: 'app-carousal-list',
  templateUrl: './carousal-list.component.html',
  styleUrls: ['./carousal-list.component.scss']
})
export class CarousalListComponent implements OnInit, AfterViewInit {
  @ViewChild('carouselContainer')
  private carouselContainer: ElementRef<HTMLDivElement>;
  @ViewChild('carouselList') private carouselList: ElementRef<HTMLElement>;

  @ContentChildren(CarousalCardComponent)
  public slidesList: QueryList<CarousalCardComponent>;

  private slides$ = new BehaviorSubject<number>(null);

  private _loop: boolean = true;
  private loop$ = new Subject<boolean>();

  private _orientation: Orientation = 'ltr';
  private orientation$ = new Subject<Orientation>();

  private _autoplay: boolean = true;
  private autoplay$ = new Subject<boolean>();

  private interval$ = new BehaviorSubject<number>(1000);

  private _maxWidth: string = 'auto';
  private maxWidth$ = new Subject<never>();

  private timer$: Observable<number>;
  private timerStop$ = new Subject<never>();
  private destroy$ = new Subject<never>();

  private playing: boolean = false;
  private listKeyManager: ListKeyManager<CarousalCardComponent>;

  @Input() public showArrows: boolean = true;
  @Input() public showIndicators: boolean = true;
  @Input() public timings: string = '250ms ease-in';
  @Input() public useKeyboard: boolean = true;
  @Input() public color: ThemePalette = 'accent';

  @Input()
  public get loop(): boolean {
    return this._loop;
  }
  public set loop(value: boolean) {
    this.loop$.next(value);
    this._loop = value;
  }
  @Input()
  public get autoplay(): boolean {
    return this._autoplay;
  }
  public set autoplay(value: boolean) {
    this.autoplay$.next(value);
    this._autoplay = value;
  }
  @Input()
  public get orientation(): Orientation {
    return this._orientation;
  }
  public set orientation(value: Orientation) {
    this.orientation$.next(value);
    this._orientation = value;
  }
  @Input()
  public set interval(value: number) {
    this.interval$.next(value);
  }
  @Input() public useMouseWheel: boolean = true;
  @Input()
  public get maxWidth(): string {
    return this._maxWidth;
  }
  public set maxWidth(value: string) {
    this.maxWidth$.next();
    this._maxWidth = value;
  }
  @Input() public maintainAspectRatio = true;
  @Input() public proportion = 25;
  @Input() public slideHeight = '100%';

  @Input()
  public set slides(value: number) {
    this.slides$.next(value);
  }

  @Output()
  public change: EventEmitter<number> = new EventEmitter<number>();

  @HostListener('keyup', ['$event'])
  public onKeyUp(event: KeyboardEvent) {
    if (this.useKeyboard) this.listKeyManager.onKeydown(event);
  }

  @HostListener('mouseenter')
  public onMouseEnter(): void {
    this.stopTimer();
  }

  @HostListener('mouseleave')
  public onMouseLeave(): void {
    this.startTimer(this.autoplay);
  }

  @HostListener('mousewheel', ['$event'])
  public onMouseWheel(event: WheelEvent): void {
    if (this.useMouseWheel) {
      event.preventDefault(); // prevent window to scroll
      const Δ = Math.sign(event.deltaY);

      if (Δ < 0) {
        this.next();
      } else if (Δ > 0) {
        this.previous();
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: Event): void {
    // Reset carousel when window is resized
    // in order to avoid major glitches.
    this.slideTo(0);
  }

  public get currentIndex(): number {
    if (this.listKeyManager) {
      return this.listKeyManager.activeItemIndex;
    }

    return 0;
  }
  public get currentSlide(): CarousalCardComponent {
    if (this.listKeyManager) {
      return this.listKeyManager.activeItem;
    }

    return null;
  }

  constructor(
    private animationBuilder: AnimationBuilder,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId
  ) {}

  ngOnInit(): void {}

  ngAfterContentInit() {
    this.listKeyManager = new ListKeyManager<CarousalCardComponent>(
      this.slidesList
    )
      .withVerticalOrientation(false)
      .withHorizontalOrientation(this.orientation)
      .withWrap(this.loop); //@Loop;

    this.listKeyManager.updateActiveItem(0);

    this.listKeyManager.change
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.playAnimation());
  }

  ngAfterViewInit() {
    this.autoplay$.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.stopTimer();
      this.startTimer(value);
    });

    this.interval$.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.stopTimer();
      this.resetTimer(value);
      this.startTimer(this._autoplay);
    });

    this.maxWidth$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.slideTo(0));

    this.loop$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => this.listKeyManager.withWrap(value));

    this.orientation$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => this.listKeyManager.withHorizontalOrientation(value));

    this.slides$
      .pipe(
        takeUntil(this.destroy$),
        filter(value => value && value < this.slidesList.length)
      )
      .subscribe(value => this.resetSlides(value));
  } //ngAfterViewInit

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  next(): void {
    this.goTo(Direction.Right);
  }

  previous(): void {
    this.goTo(Direction.Left);
  }

  slideTo(index: number): void {
    this.goTo(Direction.Index, index);
  }

  private isVisible(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const elem = this.carouselContainer.nativeElement;
    const docViewTop = window.pageYOffset;
    const docViewBottom = docViewTop + window.innerHeight;
    const elemOffset = elem.getBoundingClientRect();
    const elemTop = docViewTop + elemOffset.top;
    const elemBottom = elemTop + elemOffset.height;

    return elemBottom <= docViewBottom || elemTop >= docViewTop;
  }

  private getOffset(): number {
    const offset = this.listKeyManager.activeItemIndex * this.getWidth();
    const sign = this.orientation === 'rtl' ? 1 : -1;
    return sign * offset;
  }

  private getTranslation(offset: number): string {
    return `translateX(${offset}px)`;
  }

  private getWidth(): number {
    return this.carouselContainer.nativeElement.clientWidth;
  }

  private goTo(direction: Direction, index?: number) {
    if (!this.playing) {
      const rtl = this.orientation === 'rtl';

      switch (direction) {
        case Direction.Left:
          return rtl
            ? this.listKeyManager.setNextItemActive()
            : this.listKeyManager.setPreviousItemActive();
        case Direction.Right:
          return rtl
            ? this.listKeyManager.setPreviousItemActive()
            : this.listKeyManager.setNextItemActive();
        case Direction.Index:
          return this.listKeyManager.setActiveItem(index);
      }
    }
  }

  private playAnimation(): void {
    const translation = this.getTranslation(this.getOffset());
    const factory = this.animationBuilder.build(
      animate(this.timings, style({ transform: translation }))
    );
    const animation = factory.create(this.carouselList.nativeElement);

    animation.onStart(() => (this.playing = true));
    animation.onDone(() => {
      this.change.emit(this.currentIndex);
      this.playing = false;
      this.renderer.setStyle(
        this.carouselList.nativeElement,
        'transform',
        translation
      );
      animation.destroy();
    });
    animation.play();
  }

  private resetSlides(slides: number): void {
    this.slidesList.reset(this.slidesList.toArray().slice(0, slides));
  }

  private resetTimer(value: number): void {
    this.timer$ = interval(value);
  }

  private startTimer(autoplay: boolean): void {
    if (!autoplay) {
      return;
    }

    this.timer$
      .pipe(
        takeUntil(this.timerStop$),
        takeUntil(this.destroy$),
        filter(() => this.isVisible())
      )
      .subscribe(() => {
        this.listKeyManager.withWrap(true).setNextItemActive();
        this.listKeyManager.withWrap(this.loop);
      });
  }

  private stopTimer(): void {
    this.timerStop$.next();
  }
}
