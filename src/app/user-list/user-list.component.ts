import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[];
  searchCriteria: string;

  constructor(
    private userService: AuthService
  ) { }

  ngOnInit() {
    this.searchCriteria = '';
  }
}
