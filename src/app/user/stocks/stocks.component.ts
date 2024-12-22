import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Stocks } from '../../../model/Stocks';
import { StocksService } from './stocks.service';
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
import { MatSelectModule } from '@angular/material/select';
import { Company } from '../../../model/Company';
import { WarehouseMap } from '../../../model/WarehouseMap';
import { ProductMap } from '../../../model/ProductMap';
import { StocksDto } from '../../../model/StocksDto';
import { UserDto } from '../../../model/UserDTO';

@Component({
  selector: 'app-stocks',
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.scss',
})
export class StocksComponent {
  data!: Stocks[];
  displayedColumns: string[] = [
    'id',
    'stockName',
    'quantity',
    'sourceCompany',
    'warehouse',
    'product',
    'edit',
  ];
  dataSource = new MatTableDataSource<Stocks>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private stockService: StocksService) {
    this.getAllStocks();
  }

  getAllStocks() {
    this.stockService.getAllStocks().subscribe({
      next: (response) => {
        this.data = response.data as Stocks[];
        this.dataSource = new MatTableDataSource<Stocks>(this.data);
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
      this.getAllStocks();
    });
  }

  openDialogEdit(element: Stocks): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog1, {
      data: element,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getAllStocks();
    });
  }
}

@Component({
  selector: 'create-stocks',
  templateUrl: 'create-stocks.html',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  styleUrl: './create-edit-stocks.component.scss',
})
export class DialogOverviewExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  readonly data = inject(MAT_DIALOG_DATA);

  companies: Company[] = [];
  warehouses: WarehouseMap[] = [];
  products: ProductMap[] = [];
  quantities: any = [];

  createStocksForm!: FormGroup;

  constructor(private stocksService: StocksService) {
    this.getAllCompanies();
    this.getAllWarehouses();
    this.getAllQuantities();
    this.getAllProducts();
    this.createStocksForm = new FormGroup({
      stockName: new FormControl('', Validators.required),
      quantity: new FormGroup({
        value: new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(1),
        ]),
        unit: new FormControl('', Validators.required),
      }),
      sourceCompany: new FormControl('', Validators.required),
      warehouse: new FormControl('', Validators.required),
      product: new FormControl('', Validators.required),
    });
  }

  getAllCompanies() {
    this.stocksService.getAllCompanies().subscribe({
      next: (response) => {
        this.companies = response.data as Company[];
      },
      error: (error) => {
        this.openSnackBar(
          'Please create company and try to create Stocks',
          'Cancel'
        );
        this.onNoClick();
      },
    });
  }

  getAllWarehouses() {
    this.stocksService.getAllWarehouses().subscribe({
      next: (response) => {
        this.warehouses = response.data as WarehouseMap[];
      },
      error: (error) => {
        this.openSnackBar(
          'Please create Warehouse and try to create Stocks',
          'Cancel'
        );
        this.onNoClick();
      },
    });
  }

  getAllProducts() {
    this.stocksService.getAllProducts().subscribe({
      next: (response) => {
        this.products = response.data as ProductMap[];
      },
      error: (error) => {
        this.openSnackBar(
          'Please create Product and try to create Stocks',
          'Cancel'
        );
        this.onNoClick();
      },
    });
  }

  getAllQuantities() {
    this.stocksService.getAllQuantities().subscribe({
      next: (response) => {
        this.quantities = response.data;
      },
      error: (error) => {
        this.openSnackBar('Something went wrong', 'Cancel');
        this.onNoClick();
      },
    });
  }

  get stockName() {
    return this.createStocksForm.get('stockName');
  }

  get quantity() {
    return this.createStocksForm.get('quantity') as FormGroup;
  }

  get sourceCompany() {
    return this.createStocksForm.get('sourceCompany');
  }

  get warehouse() {
    return this.createStocksForm.get('warehouse');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.createStocksForm.valid) {
      const dto = this.createStocksForm.value as StocksDto;
      const stored = localStorage.getItem('Details');
      let userDetails!: UserDto;
      if (stored) {
        userDetails = JSON.parse(stored) as UserDto;
      }
      dto.userDTO = userDetails;
      console.log(dto);
      this.stocksService.createStocks(dto).subscribe({
        next: (response) => {
          this.openSnackBar(response.successMsg, 'Done');
        },
        error: (error) => {
          this.openSnackBar('Error', 'Done');
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
  selector: 'edit-stocks',
  templateUrl: 'edit-stocks.html',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  styleUrl: './create-edit-stocks.component.scss',
})
export class DialogOverviewExampleDialog1 {
  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog1>);
  readonly data = inject(MAT_DIALOG_DATA);

  editStocksForm!: FormGroup;
  companies: Company[] = [];
  warehouses: WarehouseMap[] = [];
  products: ProductMap[] = [];
  quantities: any = [];

  constructor(private stocksService: StocksService) {
    this.getAllCompanies();
    this.getAllWarehouses();
    this.getAllQuantities();
    this.getAllProducts();
    console.log(this.data);
    this.editStocksForm = new FormGroup({
      id: new FormControl(this.data.id),
      stockName: new FormControl(this.data.stockName, Validators.required),
      quantity: new FormGroup({
        value: new FormControl(this.data.quantity.value, [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(1),
        ]),
        unit: new FormControl(this.data.quantity.unit, Validators.required),
      }),
      sourceCompany: new FormControl(
        this.data.sourceCompany,
        Validators.required
      ),
      warehouse: new FormControl(this.data.warehouse, Validators.required),
      product: new FormControl(this.data.product, Validators.required),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getAllQuantities() {
    this.stocksService.getAllQuantities().subscribe({
      next: (response) => {
        this.quantities = response.data;
      },
      error: (error) => {
        this.openSnackBar('Something went wrong', 'Cancel');
        this.onNoClick();
      },
    });
  }

  getAllCompanies() {
    this.stocksService.getAllCompanies().subscribe({
      next: (response) => {
        this.companies = response.data as Company[];
      },
      error: (error) => {
        this.openSnackBar(
          'Please create company and try to create Stocks',
          'Cancel'
        );
        this.onNoClick();
      },
    });
  }

  getAllWarehouses() {
    this.stocksService.getAllWarehouses().subscribe({
      next: (response) => {
        this.warehouses = response.data as WarehouseMap[];
      },
      error: (error) => {
        this.openSnackBar(
          'Please create Warehouse and try to create Stocks',
          'Cancel'
        );
        this.onNoClick();
      },
    });
  }

  getAllProducts() {
    this.stocksService.getAllProducts().subscribe({
      next: (response) => {
        this.products = response.data as ProductMap[];
      },
      error: (error) => {
        this.openSnackBar(
          'Please create Product and try to create Stocks',
          'Cancel'
        );
        this.onNoClick();
      },
    });
  }

  onSubmit(): void {
    if (this.editStocksForm.valid) {
      const dto = this.editStocksForm.value as StocksDto;
      const stored = localStorage.getItem('Details');
      let userDetails!: UserDto;
      if (stored) {
        userDetails = JSON.parse(stored) as UserDto;
      }
      dto.userDTO = userDetails;
      this.stocksService
        .editStocks(dto)
        .subscribe({
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
