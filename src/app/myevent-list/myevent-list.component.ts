import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-myevent-list',
  templateUrl: './myevent-list.component.html',
  styleUrls: ['./myevent-list.component.css']
})
export class MyeventListComponent implements OnInit {

  Event: any = [];
  isLoggedIn = false;
  userId: string;

  constructor(
    private apiService: ApiService,
    private tokenStorageService: TokenStorageService
    ) {
      this.readEvent();
    }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.userId = user.id;
    }
  }

  readEvent() {
    this.apiService.getEvents().subscribe((data) => {
      this.Event = data;
    });
  }

  removeEvent(event, index) {
    if (window.confirm('Are you sure?')) {
      this.apiService.deleteEvent(event._id).subscribe((data) => {
        this.Event.splice(index, 1);
      });
    }
  }
}
