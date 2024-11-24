import { Directive, ElementRef, inject, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';

@Directive({
  selector: '[tfInput]',
  host: {
    '(focus)': '_focusChanged(true)',
    '(blur)': '_focusChanged(false)'
  },
  standalone: true
})
export class InputDirective implements OnDestroy {

  ngControl: NgControl = inject(NgControl);
  stateChange$ = new Subject<void>();
  private elementRef: ElementRef<HTMLInputElement> = inject(ElementRef);
  private _isFocused = false;

  get isFocused() {
    return this._isFocused;
  }

  get isFieldEmpty() {
    return !!this.elementRef.nativeElement.value;
  }

  constructor() { }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.stateChange$.complete();
  }

  _focusChanged(isFocused: boolean) {
    if (this._isFocused === isFocused) return;
    this._isFocused = isFocused;
    this.stateChange$.next();
  }

  // wire label inside form input component.
  setIDAttribute(ID: string): void {
    this.elementRef.nativeElement.id = ID;
  }

}
