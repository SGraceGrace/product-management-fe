import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Warehouse } from '../../../model/Warehouse';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WarehouseService } from './warehouse.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-warehouse',
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.scss',
})
export class WarehouseComponent {
  data!: Warehouse[];
  displayedColumns: string[] = [
    'id',
    'warehouseName',
    'manager',
    'phoneNo',
    'city',
    'state',
    'country',
    'status',
    'edit',
  ];
  dataSource = new MatTableDataSource<Warehouse>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private warehouseService: WarehouseService) {
    this.getAllWarehouses();
  }

  getAllWarehouses() {
    this.warehouseService.getAllWarehouse().subscribe({
      next: (response) => {
        this.data = response.data as Warehouse[];
        this.dataSource = new MatTableDataSource<Warehouse>(this.data);
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
      this.getAllWarehouses();
    });
  }

  openDialogEdit(element: Warehouse): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog1, {
      data: element,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getAllWarehouses();
    });
  }
}
@Component({
  selector: 'create-warehouse',
  templateUrl: 'create-warehouse.html',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  styleUrl: './create-edit-warehouse.component.scss',
})
export class DialogOverviewExampleDialog {

  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  readonly data = inject(MAT_DIALOG_DATA);

  createWarehouseForm!: FormGroup;
  
  constructor(private warehouseService: WarehouseService) {
    this.createWarehouseForm = new FormGroup({
      warehouseName: new FormControl('', Validators.required),
      manager: new FormControl('', Validators.required),
      phoneNo: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required)
      });
  }

  get warehouseName() {
    return this.createWarehouseForm.get('warehouseName');
  }

  get manager() {
    return this.createWarehouseForm.get('manager');
  }

  get phoneNo() {
    return this.createWarehouseForm.get('phoneNo');
  }

  get city() {
    return this.createWarehouseForm.get('city');
  }

  get state() {
    return this.createWarehouseForm.get('state');
  }

  get country() {
    return this.createWarehouseForm.get('country');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if(this.createWarehouseForm.valid) {
      this.warehouseService.createWarehouse(this.createWarehouseForm.value as Warehouse).subscribe({
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
  selector: 'edit-warehouse',
  templateUrl: 'edit-warehouse.html',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  styleUrl: './create-edit-warehouse.component.scss',
})
export class DialogOverviewExampleDialog1 {

  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog1>);
  readonly data = inject(MAT_DIALOG_DATA);

  statuses:any = [
    {value: 'ACTIVE', viewValue: 'ACTIVE'},
    {value: 'IN_ACTIVE', viewValue: 'IN_ACTIVE'}
  ];

  editWarehouseForm!: FormGroup;
  
  constructor(private warehouseService: WarehouseService) {
    this.editWarehouseForm = new FormGroup({
      id: new FormControl(this.data.id),
      warehouseName: new FormControl(this.data.warehouseName, Validators.required),
      manager: new FormControl(this.data.manager, Validators.required),
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
    if(this.editWarehouseForm.valid) {
      this.warehouseService.editWarehouse(this.editWarehouseForm.value as Warehouse).subscribe({
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