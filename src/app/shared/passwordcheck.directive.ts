import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordsMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const cpassword = control.get('cpassword');

  if (!password || !cpassword) {
    return null;
  }

  return password.value === cpassword.value ? null : { passwordsMismatch: true };
};
