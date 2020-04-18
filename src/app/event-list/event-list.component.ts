import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
})
export class EventListComponent implements OnInit, AfterContentChecked {

  Event: any = [];
  isLoggedIn = false;
  userId: string;
  userEmail: string;
  form: FormGroup;
  allow = false;
  userAccess: any;
  i = 0;
  j = 1;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private tokenStorageService: TokenStorageService) {
    }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.userId = user.id;
      this.userEmail = user.email;
    }
    this.form = this.fb.group({
      access: this.fb.array([]),
    });
    this.readEvent();
  }

  ngAfterContentChecked() {
    this.i = 0;
    this.j = 1;
  }

  get myAccess() {
    return this.form.get('access') as FormArray;
  }

  // allow access to Edit button in view
  allowAccess() {
    for (const res of this.userAccess) {
      if (res.user === this.userEmail) {
        this.allow = true;
        break;
      } else {
        this.allow = false;
      }
    }
  }

  controls() {
    // slice to only loop over 1 object at once
    this.Event.slice(this.i, this.j).forEach((element) => {
      this.userAccess = element.access;
      this.i = this.i + 1;
      this.j = this.j + 1;
      this.allowAccess();
    });
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
