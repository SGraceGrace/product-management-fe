import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { passwordsMatchValidator } from '../shared/passwordcheck.directive';
import { SignupDto } from '../../model/SignupDTO';
import { SignupService } from './signup.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent {
  constructor(private signupService: SignupService, private router: Router) {}

  profileForm = new FormGroup(
    {
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.email, Validators.required]),
      phoneNo: new FormControl('', Validators.required),
      userName: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{8,20}$'
        ),
      ]),
      cpassword: new FormControl('', Validators.required),
    },
    { validators: passwordsMatchValidator }
  );

  onSubmit() {
    if (this.profileForm.valid) {
      const dto: SignupDto = this.profileForm.value as SignupDto;

      this.signupService.signup(dto).subscribe({
        next: (response) => {
          Swal.fire({
            title: response.message || 'Welcome',
            text: response.successMsg || 'Successfully Created an account',
            icon: 'success',
          }).then(() => {
            localStorage.setItem('Name', dto.userName);
            localStorage.setItem('LoggedIn', 'true');
            localStorage.setItem('Details', JSON.stringify(response.data));
            this.router.navigate(['/user']);
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: error.error.errorMsg || 'Account creation Failed',
            text:
              error.error.message ||
              'Account creation Failed, please try again.',
          }).then(() => {
            if (this.profileForm) {
              this.profileForm.reset();
            }
          });
        },
      });
    }
  }

  get name() {
    return this.profileForm.get('name');
  }

  get email() {
    return this.profileForm.get('email');
  }

  get phoneNo() {
    return this.profileForm.get('phoneNo');
  }

  get userName() {
    return this.profileForm.get('userName');
  }

  get password() {
    return this.profileForm.get('password');
  }

  get cpassword() {
    return this.profileForm.get('cpassword');
  }
}
