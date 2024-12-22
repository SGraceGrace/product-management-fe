import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AuditLogs } from '../../../model/AuditLogs';
import { DashboardService } from './dashboard.service';
import { CountDTO } from '../../../model/CountsDTO';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  imports: [MatTableModule, MatPaginatorModule, CommonModule, MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  data!: AuditLogs[];
  counts!: CountDTO[];
  displayedColumns: string[] = ['id', 'action', 'entity', 'entityId', 'user'];
  dataSource = new MatTableDataSource<AuditLogs>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dashboardService: DashboardService) {
    this.getAllCounts();
    this.getAllAuditLogs();
  }

  getAllAuditLogs() {
    this.dashboardService.getAllAuditLogs().subscribe({
      next: (response) => {
        this.data = response.data as AuditLogs[];
        this.dataSource = new MatTableDataSource<AuditLogs>(this.data);
        this.dataSource.paginator = this.paginator;
      },
    });
  }

  getAllCounts() {
    this.dashboardService.getAllCounts().subscribe({
      next: (response) => {
        this.counts = response.data as CountDTO[];
      }
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
