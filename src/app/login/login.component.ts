import { ChangeDetectionStrategy, Component } from '@angular/core';
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
import { LoginService } from './login.service';
import { LoginDTO } from '../../model/LoginDTO';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
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
  providers: [LoginService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  constructor(private loginService: LoginService, private router: Router) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    userName: new FormControl('', Validators.required),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{8,20}$'),
    ]),
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const dto: LoginDTO = this.loginForm.value as LoginDTO;

      this.loginService.login(dto).subscribe({
        next: (response) => {
          Swal.fire({
            title: response.message || 'Welcome',
            text: response.successMsg || 'Successfully Logged In',
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
            title: error.error.errorMsg || 'Login Failed',
            text:
              error.error.message || 'Invalid credentials, please try again.',
          }).then(() => {
            if (this.loginForm) {
              this.loginForm.reset();
            }
          });
        },
      });
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get userName() {
    return this.loginForm.get('userName');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
