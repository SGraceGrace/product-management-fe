import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from './user.service';
import { CommonModule } from '@angular/common';
import { SharedService } from '../shared-service/shared.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Product } from '../../model/Product';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-user',
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  userData: string | null = null;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getName();
  }

  getName() {
    this.sharedService.getName().subscribe((name) => {
      this.userData = name;
    });
  }

  logout() {
    this.sharedService.logout();
    this.router.navigate(['/login']);
  }

  products!: Product[];

  generate() {
    this.userService.getAllProducts().subscribe({
      next: (response) => {
        this.products = response.data as Product[];
        this.openDialog();
      },
    });
  }

  generateExcel() {
    this.userService.generateProduct().subscribe({
      next: (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventory.xlsx';
        a.click();
      },
    });
  }

  readonly dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(DialogElementsExampleDialog, {
      data: this.products,
    });
  }
}
@Component({
  selector: 'dialog',
  templateUrl: 'dialog.html',
  imports: [
    MatDialogTitle,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './user.component.scss',
})
export class DialogElementsExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogElementsExampleDialog>);
  readonly data = inject(MAT_DIALOG_DATA);

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

  constructor(private userService: UserService) {
    this.dataSource = new MatTableDataSource<Product>(this.data);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  generateQR(productId: number) {
    this.userService.generateQrCode(productId).subscribe({
      next: (response) => {
        this.openDialog(response.data as string);
      },
    });
  }

  readonly dialog = inject(MatDialog);

  openDialog(base64QRCode: string) {
    this.dialog.open(DialogElementsExampleDialog1, {
      data: { qrCode: base64QRCode },
    });
  }
}
@Component({
  selector: 'image',
  templateUrl: 'image.html',
  imports: [
    MatDialogClose,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './user.component.scss',
})
export class DialogElementsExampleDialog1 {
  readonly dialogRef = inject(MatDialogRef<DialogElementsExampleDialog1>);
  readonly data = inject(MAT_DIALOG_DATA);
}
