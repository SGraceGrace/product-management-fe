import { Component, inject, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { UserDto } from '../../../model/UserDTO';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ProfileDto } from '../../../model/ProfileDTO';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
  MatDialogActions,
} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { SharedService } from '../../shared-service/shared.service';

@Component({
  selector: 'app-profile',
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  constructor(private profileService: ProfileService, private router: Router, private sharedService: SharedService) {}

  user!: ProfileDto;
  isAdmin: boolean = false;
  isManager: boolean = false;
  isStaff: boolean = false;

  admin =
    'Has full control over the system, including managing users, configuring settings, monitoring inventory, and generating reports.';
  manager =
    'Oversees inventory operations, manages stock levels, supervises staff activities, and ensures inventory processes run smoothly.';
  staff =
    'Handles day-to-day inventory tasks such as adding stock, updating product details, processing orders, and reporting low stock items.';

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    const stored = localStorage.getItem('Details');
    let userDetails!: UserDto;
    if (stored) {
      userDetails = JSON.parse(stored) as UserDto;
    }
    this.profileService.getUser(userDetails).subscribe({
      next: (response) => {
        this.user = response.data as ProfileDto;
        this.isAdmin = this.user.role === 'ADMIN';
        this.isManager = this.user.role === 'MANAGER';
        this.isStaff = this.user.role === 'STAFF';
      },
    });
  }

  delete() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.profileService.deleteUser(this.user).subscribe({
          next: (response) => {
            Swal.fire({
              title: 'Deleted!',
              text: response.successMsg || 'Successfully Deleted profile.',
              icon: 'success',
            }).then(() => {
              this.sharedService.logout();
              this.router.navigate(['/login']);
            })
          }
        });
      }
    });
  }

  dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(DialogDataExampleDialog, {
      data: {
        id: this.user.id,
        name: this.user.name,
        email: this.user.email,
        username: this.user.userName,
        phoneno: this.user.phoneNo,
        role: this.user.role,
        password: this.user.password,
        status: this.user.status,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getProfile();
    });
  }
}

@Component({
  selector: 'edit-dialog',
  templateUrl: 'edit-dialog.html',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
  ],
  styleUrl: './profile.component.scss',
})
export class DialogDataExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogDataExampleDialog>);
  data = inject(MAT_DIALOG_DATA);

  editForm: FormGroup;

  constructor(private profileService: ProfileService) {
    this.editForm = new FormGroup({
      id: new FormControl(this.data.id),
      name: new FormControl(this.data.name),
      email: new FormControl(this.data.email),
      userName: new FormControl(this.data.username),
      phoneNo: new FormControl(this.data.phoneno),
      role: new FormControl(this.data.role),
      password: new FormControl(this.data.password),
      status: new FormControl(this.data.status),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave() {
    if (this.editForm.valid) {
      const dto: ProfileDto = this.editForm.value as ProfileDto;
      this.profileService.editUser(dto).subscribe({
        next: (response) => {
          Swal.fire({
            title: response.message || 'Welcome',
            text: response.successMsg || 'Successfully Created an account',
            icon: 'success',
          }).then(() => {
            localStorage.setItem('Name', dto.userName);
            localStorage.setItem('LoggedIn', 'true');
            localStorage.setItem('Details', JSON.stringify(response.data));
            this.onNoClick();
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
        }
      });
    }
  }
}
