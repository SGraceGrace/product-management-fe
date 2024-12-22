import { Component, inject, ViewChild } from '@angular/core';
import { SourceCompany } from '../../../model/SourceCompany';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CompanyService } from './company.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-company',
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent {
  data!: SourceCompany[];
  displayedColumns: string[] = [
    'id',
    'companyName',
    'phoneNo',
    'city',
    'state',
    'country',
    'status',
    'edit',
  ];
  dataSource = new MatTableDataSource<SourceCompany>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private companyService: CompanyService) {
    this.getAllCompanies();
  }

  getAllCompanies() {
    this.companyService.getAllCompany().subscribe({
      next: (response) => {
        this.data = response.data as SourceCompany[];
        this.dataSource = new MatTableDataSource<SourceCompany>(this.data);
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  readonly dialog = inject(MatDialog);

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => { 
      this.getAllCompanies();
    });
  }

  openDialogEdit(element: SourceCompany): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog1, {
      data: element,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getAllCompanies();
    });
  }
}
@Component({
  selector: 'create-company',
  templateUrl: 'create-company.html',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  styleUrl: './create-edit-company.component.scss',
})
export class DialogOverviewExampleDialog {

  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  readonly data = inject(MAT_DIALOG_DATA);

  createCompanyForm!: FormGroup;
  
  constructor(private companyService: CompanyService) {
    this.createCompanyForm = new FormGroup({
      companyName: new FormControl('', Validators.required),
      phoneNo: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required)
      });
  }

  get companyName() {
    return this.createCompanyForm.get('companyName');
  }

  get phoneNo() {
    return this.createCompanyForm.get('phoneNo');
  }

  get city() {
    return this.createCompanyForm.get('city');
  }

  get state() {
    return this.createCompanyForm.get('state');
  }

  get country() {
    return this.createCompanyForm.get('country');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if(this.createCompanyForm.valid) {
      this.companyService.createCompany(this.createCompanyForm.value as SourceCompany).subscribe({
        next: (response) => {
          this.openSnackBar(response.successMsg, 'Done');
        }
      })
    }
    this.onNoClick();
  }

  private _snackBar = inject(MatSnackBar);
  
    openSnackBar(message: string, action: string) {
      this._snackBar.open(message, action);
    }
}

@Component({
  selector: 'edit-company',
  templateUrl: 'edit-company.html',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  styleUrl: './create-edit-company.component.scss',
})
export class DialogOverviewExampleDialog1 {

  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog1>);
  readonly data = inject(MAT_DIALOG_DATA);

  statuses:any = [
    {value: 'ACTIVE', viewValue: 'ACTIVE'},
    {value: 'IN_ACTIVE', viewValue: 'IN_ACTIVE'}
  ];

  editCompanyForm!: FormGroup;
  
  constructor(private companyService: CompanyService) {
    this.editCompanyForm = new FormGroup({
      id: new FormControl(this.data.id),
      companyName: new FormControl(this.data.companyName, Validators.required),
      phoneNo: new FormControl(this.data.phoneNo, Validators.required),
      city: new FormControl(this.data.city, Validators.required),
      state: new FormControl(this.data.state, Validators.required),
      country: new FormControl(this.data.country, Validators.required),
      status: new FormControl(this.data.status, Validators.required)
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if(this.editCompanyForm.valid) {
      this.companyService.editCompany(this.editCompanyForm.value as SourceCompany).subscribe({
        next: (response) => {
          this.openSnackBar(response.successMsg, 'Done');
        },
        error: (error) => {
          this.openSnackBar('Error', 'Cancel');
        }
      })
    }
    this.onNoClick();
  }

  private _snackBar = inject(MatSnackBar);
  
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
