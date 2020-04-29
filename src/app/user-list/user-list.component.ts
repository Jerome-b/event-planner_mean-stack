import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { UserService } from '../_services/user.service';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, AfterViewInit {

  User: any = [];
  User2: any = [];
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['username',  'email'];


  constructor(
    private userService: UserService,
    private location: Location
  ) {
  }

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() { }

  ngAfterViewInit() {
    this.readUser();
  }

  readUser() {
    this.userService.getUsers3().subscribe((data) => {
      this.User = new MatTableDataSource<any>(data);
      this.User.sort = this.sort;
      this.User.sortingDataAccessor = (data2, sortUsername) => data2[sortUsername].toLocaleLowerCase();
    });
  }

  // back function for back button
  goBack() {
    this.location.back();
  }
}
