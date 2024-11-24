import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChild, inject, InjectionToken, Input, OnDestroy } from '@angular/core';
import { SuffixDirective, TF_SUFFIX } from '../../directives/suffix.directive';
import { InputDirective } from '../../directives/input.directive';
import { BehaviorSubject, Subscription } from 'rxjs';

let TF_INPUT_INSTANCE_COUNTER = new InjectionToken<BehaviorSubject<number>>('instance counter');

@Component({
  selector: 'tf-form-input',
  standalone: true,
  imports: [CommonModule],
  host: {
    '[class.tf-form-input--suffix]': '_hasSuffix',
    '[class.tf-form-input--awaiting]': '!_isLabelFloated',
    '[class.tf-form-input--invalid]': 'isInvalid',
    '(click)': 'focusField()'
  },
  providers: [
    { provide: TF_INPUT_INSTANCE_COUNTER, useValue: new BehaviorSubject<number>(0) }
  ],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss'
})
export class FormInputComponent implements AfterContentInit, OnDestroy {
  @Input() name = '';

  @ContentChild(TF_SUFFIX) suffix?: SuffixDirective;
  @ContentChild(InputDirective) _control?: InputDirective;

  counter$ = inject(TF_INPUT_INSTANCE_COUNTER);
  instanceIndex = 0;
  labelInputIDPrefix = 'tf-form-input';

  _stateChangeSubscription?: Subscription;
  _hasSuffix = false;
  _isLabelFloated = false;

  get isInvalid() {
    const control = this._control?.ngControl;
    return control?.invalid && (control?.touched || control.dirty)
  }

  constructor() {
    return;
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.instanceIndex = this.counter$.value;
    this.counter$.next(this.instanceIndex + 1);
  }

  ngAfterContentInit(): void {
    this._hasSuffix = !!this.suffix;
    this.setInputElementIDInDirective();
    this._stateChangeSubscription = this._control?.stateChange$.subscribe({
      next: () => {
        this._isLabelFloated = !!this._control?.isFocused || !!this._control?.isFieldEmpty;
      }
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this._stateChangeSubscription?.unsubscribe();
  }

  focusField() {
    this._control?.changeFocus(true)
  }

  setInputElementIDInDirective() {
    this._control?.setIDAttribute(`${this.labelInputIDPrefix}-${this.instanceIndex}`);
  }
}
