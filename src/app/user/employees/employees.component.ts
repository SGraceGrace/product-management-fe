import { Component, inject, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { Users } from '../../../model/Users';
import { EmployeesService } from './employees.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditRoleDto } from '../../../model/EditRole';

@Component({
  selector: 'app-employees',
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent {
  data!: Users[];
  displayedColumns: string[] = ['id', 'name', 'email', 'phoneNo', 'userName', 'role', 'status', 'edit'];
  dataSource = new MatTableDataSource<Users>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private employeeService: EmployeesService) {
    this.getAllUsers();
  }

  getAllUsers() {
    this.employeeService.getAllUsers().subscribe({
      next: (response) => {
        this.data = response.data as Users[];
        this.dataSource = new MatTableDataSource<Users>(this.data);
        this.dataSource.paginator = this.paginator;
      }
    })
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  readonly dialog = inject(MatDialog);

  openDialog(id: number, role: string): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: {id: id, role: role},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllUsers();
    });
  }
}

@Component({
  selector: 'edit-user',
  templateUrl: 'edit-user.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatSelectModule
  ],
  styleUrl: './employees.component.scss'
})
export class DialogOverviewExampleDialog {

  constructor(private employeeService: EmployeesService) {}

  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  readonly data = inject(MAT_DIALOG_DATA);

  roles:any = [
    {value: 'ADMIN', viewValue: 'ADMIN'},
    {value: 'MANAGER', viewValue: 'MANAGER'},
    {value: 'STAFF', viewValue: 'STAFF'},
  ];
  
  role: string = this.data.role;

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.data.roles = this.role;
    this.employeeService.editRole(this.data as EditRoleDto).subscribe({
      next: (response) => {
        this.openSnackBar('Success', 'Done');
      },
      error: (error) => {
        this.openSnackBar('Error', 'Done');
      }
    })
    this.onNoClick();
  }

  private _snackBar = inject(MatSnackBar);

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}