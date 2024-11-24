import { Directive, InjectionToken } from '@angular/core';

export const TF_SUFFIX = new InjectionToken('input suffix');

@Directive({
  selector: '[tfSuffix]',
  standalone: true,
  providers: [{
    provide: TF_SUFFIX,
    useExisting: SuffixDirective
  }]
})
export class SuffixDirective {
}
