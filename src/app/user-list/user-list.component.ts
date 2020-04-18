import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  User: any = [];

  constructor(
    private userService: UserService,
    private location: Location
  ) {
    this.readUser();
  }

  ngOnInit() { }


  readUser() {
    this.userService.getUsers().subscribe((data) => {
      this.User = data;
    });
  }

  // back function for back button
  goBack() {
    this.location.back();
  }
}
