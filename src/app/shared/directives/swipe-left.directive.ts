import { Directive, EventEmitter, HostListener, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[swipeLeft]'
})
export class SwipeLeftDirective {
  @Output() swipeLeft = new EventEmitter();

  private startX: number = 0;
  private startY: number = 0;
  private isSwiping: boolean = false;
  private element!: HTMLElement;
  swipeDirection:any = null;
  previousX: number = 0;

  constructor(private renderer: Renderer2) { }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].pageX;
    this.startY = event.touches[0].pageY;
    this.isSwiping = true;
    this.element = event.target as HTMLElement;
    this.swipeDirection = null;
    this.previousX = this.startX;
  }

  @HostListener('touchend', ['$event'])
onTouchEnd(event: TouchEvent) {
  if (this.isSwiping) {
    const endX = event.changedTouches[0].pageX;
    const deltaX = endX - this.startX;
    if (deltaX < 0 && this.swipeDirection === 'left') { // swipe left
      this.swipeLeft.emit();
      this.animateSwipe();
    } else if (deltaX > 0 && this.swipeDirection === 'right') { // swipe right
      this.renderer.setStyle(this.element, 'transform', `translateX(0px)`); // bring it to 0 position
    }
    this.isSwiping = false;
  }
}

@HostListener('touchmove', ['$event'])
onTouchMove(event: TouchEvent) {
  if (this.isSwiping) {
    const currentX = event.touches[0].pageX;
    const deltaX = currentX - this.previousX;
    this.previousX = currentX;

    if (deltaX > 0) {
      this.swipeDirection = 'right';
    } else if (deltaX < 0) {
      this.swipeDirection = 'left';
    }

    if (this.swipeDirection === 'left') {
      console.log('swiping left')
      event.preventDefault();
      this.renderer.setStyle(this.element, 'transform', `translateX(${currentX - this.startX}px)`);
    } else if (this.swipeDirection === 'right') {
      console.log('swiping right, but preventing it')
      event.preventDefault();
      // Prevent swiping to the right by keeping the transform at 0
      this.renderer.setStyle(this.element, 'transform', `translateX(0px)`);
    }
  }
}

  private animateSwipe() {
    this.renderer.setStyle(this.element, 'transition', 'transform 0.3s ease-out');
    this.renderer.setStyle(this.element, 'transform', `translateX(-100%)`);
  }
  // Incase if needed to reset the position
  private resetSwipe() {
    this.renderer.setStyle(this.element, 'transition', 'transform 0.3s ease-out');
    this.renderer.setStyle(this.element, 'transform', `translateX(0)`);
  }
}