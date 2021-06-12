import { AbstractControl } from "@angular/forms";

export class CustomValidator {
  static passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get("password").value; // get password from password form control
    const confirmPassword: string = control.get("confirmPassword").value; // get password from confirmPassword form control

    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword formcontrol
      control.get("confirmPassword").setErrors({ NoPassswordMatch: true });
    }
  }
}
