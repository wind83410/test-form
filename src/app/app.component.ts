import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormInputComponent } from './components/form-input/form-input.component';
import { SuffixDirective } from './directives/suffix.directive';
import { InputDirective } from './directives/input.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, FormInputComponent, SuffixDirective, InputDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'test-form';

  isPasswordUnveiled = false;
  attemptedToSubmit = false;

  constructor(
    private formBuilder: FormBuilder
  ) {
    return;
  }

  signInForm = this.formBuilder.group({
    firstName: this.formBuilder.control<string>('', { validators: Validators.required, updateOn: 'submit'}),
    lastName: this.formBuilder.control<string>('', { validators: Validators.required, updateOn: 'submit'}),
    email: this.formBuilder.control<string>('', { validators: [Validators.required, Validators.email], updateOn: 'submit'}),
    password: this.formBuilder.control<string>('', { validators: [Validators.required, Validators.minLength(8), Validators.pattern(/[0-9]+/)]}),
    agreedPolicy: this.formBuilder.control(false, { validators: Validators.requiredTrue, updateOn: 'submit'})
  });

  onFormSubmit() {
    this.signInForm.markAllAsTouched();
    this.attemptedToSubmit = true;
  }

  hideMessageOrNot(): boolean {
    if (!this.attemptedToSubmit) return true;
    return this.signInForm.valid || (this.signInForm.untouched && this.signInForm.pristine);
  }
}
