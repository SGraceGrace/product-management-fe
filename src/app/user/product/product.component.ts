import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Product } from '../../../model/Product';
import { ProductService } from './product.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductDTO } from '../../../model/ProductDTO';
import { UserDto } from '../../../model/UserDTO';

@Component({
  selector: 'app-product',
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  data!: Product[];
  displayedColumns: string[] = [
    'id',
    'productName',
    'productType',
    'description',
    'price',
    'edit',
  ];
  dataSource = new MatTableDataSource<Product>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private productService: ProductService) {
    this.getAllProduct();
  }

  getAllProduct() {
    this.productService.getAllProduct().subscribe({
      next: (response) => {
        this.data = response.data as Product[];
        this.dataSource = new MatTableDataSource<Product>(this.data);
        this.dataSource.paginator = this.paginator;
      },
    });
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
      this.getAllProduct();
    });
  }

  openDialogEdit(element: Product): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog1, {
      data: element,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getAllProduct();
    });
  }
}
@Component({
  selector: 'create-product',
  templateUrl: 'create-product.html',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  styleUrl: './create-edit-product.component.scss',
})
export class DialogOverviewExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  readonly data = inject(MAT_DIALOG_DATA);

  createProductForm!: FormGroup;

  constructor(private productService: ProductService) {
    this.createProductForm = new FormGroup({
      productName: new FormControl('', Validators.required),
      productType: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
    });
  }

  get productName() {
    return this.createProductForm.get('productName');
  }

  get productType() {
    return this.createProductForm.get('productType');
  }

  get description() {
    return this.createProductForm.get('description');
  }

  get price() {
    return this.createProductForm.get('price');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.createProductForm.valid) {
      const dto = this.createProductForm.value as ProductDTO;
      const stored = localStorage.getItem('Details');
      let userDetails!: UserDto;
      if (stored) {
        userDetails = JSON.parse(stored) as UserDto;
      }
      dto.userDTO = userDetails;
      this.productService.createProduct(dto).subscribe({
        next: (response) => {
          this.openSnackBar(response.successMsg, 'Done');
        },
        error: (error) => {
          this.openSnackBar('Error', 'Cancel');
        },
      });
    }
    this.onNoClick();
  }

  private _snackBar = inject(MatSnackBar);

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}

@Component({
  selector: 'edit-product',
  templateUrl: 'edit-product.html',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  styleUrl: './create-edit-product.component.scss',
})
export class DialogOverviewExampleDialog1 {
  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog1>);
  readonly data = inject(MAT_DIALOG_DATA);

  editProductForm!: FormGroup;

  constructor(private productService: ProductService) {
    this.editProductForm = new FormGroup({
      id: new FormControl(this.data.id),
      productName: new FormControl(
        this.data.productName,
        Validators.required
      ),
      productType: new FormControl(this.data.productType, Validators.required),
      description: new FormControl(this.data.description, Validators.required),
      price: new FormControl(this.data.price, Validators.required),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.editProductForm.valid) {
      const dto = this.editProductForm.value as ProductDTO;
      const stored = localStorage.getItem('Details');
      let userDetails!: UserDto;
      if (stored) {
        userDetails = JSON.parse(stored) as UserDto;
      }
      dto.userDTO = userDetails;
      this.productService.editProduct(dto).subscribe({
        next: (response) => {
          this.openSnackBar(response.successMsg, 'Done');
        },
        error: (error) => {
          this.openSnackBar('Error', 'Cancel');
        },
      });
    }
    this.onNoClick();
  }

  private _snackBar = inject(MatSnackBar);

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
