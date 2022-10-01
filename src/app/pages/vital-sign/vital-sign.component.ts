import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { VitalSign } from 'src/app/model/vitalSign';
import { VitalSignService } from 'src/app/service/vital-sign.service';

@Component({
  selector: 'app-vital-sign',
  templateUrl: './vital-sign.component.html',
  styleUrls: ['./vital-sign.component.css']
})
export class VitalSignComponent implements OnInit {

  displayedColumns: string[] = ['id', 'temperature', 'pulse', 'respiratoryRate', 'actions'];
  dataSource: MatTableDataSource<VitalSign>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private vitalSignService: VitalSignService
  ) { }

  ngOnInit(): void {
    this.vitalSignService.getVitalSignChange().subscribe(data => {
      this.createTable(data);
    });

    this.vitalSignService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2000, verticalPosition: "top", horizontalPosition: "right" });
    });

    this.vitalSignService.findAll().subscribe(data => {
      this.createTable(data);
    });
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(idVitalSign: number){
    this.vitalSignService.delete(idVitalSign).pipe(switchMap( ()=> {
      return this.vitalSignService.findAll();
    }))
    .subscribe(data => {
      this.vitalSignService.setVitalSignChange(data);
      this.vitalSignService.setMessageChange('DELETED!');
    })
    ;
  }

  createTable(vitalSigns: VitalSign[]){
    this.dataSource = new MatTableDataSource(vitalSigns);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  checkChildren(): boolean{
    return this.route.children.length != 0;
  }
}
