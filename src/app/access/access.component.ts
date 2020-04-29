import { Component, OnInit, AfterContentChecked, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, AfterViewChecked, AfterContentInit, OnChanges} from '@angular/core';
import { UserService } from '../_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../_services/api.service';
import { Location } from '@angular/common';
import { Event } from '../models/event';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { TokenStorageService } from '../_services/token-storage.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.css'],
})
export class AccessComponent implements OnInit, AfterContentChecked, AfterViewInit {

  sort;
  userId: string;
  loggedEmail: string;
  User: any = [];
  User2: any = [];
  userEmail: any = [];
  event: Event;
  accessExist = false;
  isLoggedIn = false;
  accessButton = false;
  blabla: any;
  userAccess: any;
  i = 0;
  j = 1;
  displayedColumns: string[] = ['username',  'invite'];

  constructor(
    private userService: UserService,
    private location: Location,
    public fb: FormBuilder,
    public fb1: FormBuilder,
    private actRoute: ActivatedRoute,
    private apiService: ApiService,
    private tokenStorageService: TokenStorageService,
  ) { }

  @ViewChild(MatSort, {static: false}) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.User2.sort = this.sort;
    }
  }

  accessForm: FormGroup;
  submitted = false;

  public doFilter = (value: string) => {
    this.User2.filter = value.trim().toLocaleLowerCase();
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    const id = this.actRoute.snapshot.paramMap.get('id');
    const user = this.tokenStorageService.getUser();
    this.loggedEmail = user.email;
    this.getEvent(id);
    this.accessForm = this.fb.group({
      owner: [''],
      access: this.fb.array([]),
    });
  }

  ngAfterViewInit() {
    this.readUser();
    this.readUser2();
  }

  ngAfterContentChecked() {
    this.i = 0;
    this.j = 1;
  }

  get myAccess() {
    return this.accessForm.get('access') as FormArray;
  }

  get owner() {
    return this.accessForm.controls.owner.value;
  }

  getEvent(id) {
    this.apiService.getEvent(id).subscribe({
      next: (event: Event) => {
        this.event = event;
        this.getAccess();
        this.displayEvent(event);
        }
    });
  }

  displayEvent(event: Event): void {
    this.accessForm.patchValue({
      owner: event.owner,
    });

  }

  // getEvent without getAccess for giveAccess()
  getEventbis(id) {
    this.apiService.getEvent(id).subscribe({
      next: (event: Event) => {
        this.event = event;
        }
    });
  }

  // get the access array
  getAccess(): void {
    const control = this.accessForm.get('access') as FormArray;
    this.event.access.forEach(a => {
      control.push(this.fb.group(a));
    });
  }

  // get all users from db
  readUser() {
    this.userService.getUsers().subscribe((data) => {
      this.User = data;
      this.userEmail = this.User.map(res => res.email);
    });
  }

  readUser2() {
    this.userService.getUsers2().subscribe((data) => {
      this.User2 = new MatTableDataSource<any>(data);
      this.User2.sort = this.sort;
      this.User2.sortingDataAccessor = (data2, sortUsername) => data2[sortUsername].toLocaleLowerCase();
    });
  }


  // check if user already has access to the current event
  buttonAccess() {
    for ( let i = 0; i < this.event.access.length; i++) {
      const result = ( (this.accessForm.get('access') as FormArray).controls[i].get('user') as FormArray).value;
      if (result === this.userAccess) {
        this.accessButton = true;
        break;
      }
    }
  }

  controls() {
    this.accessButton = false;
    // slice to only loop over 1 object at once
    this.User.slice(this.i, this.j).forEach((user) => {
      this.userAccess = user.email;
      this.i = this.i + 1;
      this.j = this.j + 1;
      for ( let i = 0; i < this.event.access.length; i++) {
        const result = ( (this.accessForm.get('access') as FormArray).controls[i].get('user') as FormArray).value;
        if (result === this.userAccess) {
          this.accessButton = true;
          break;
        }
      }
    });
  }

  // back function for back button
  goBack() {
    this.location.back();
  }

  // give access to the user
  giveAccess(index) {
    // call the service again to update
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.getEventbis(id);
    // if the user has already access, no action performed
    for ( let i = 0; i < this.event.access.length; i++) {
      const result = ( (this.accessForm.get('access') as FormArray).controls[i].get('user') as FormArray).value;
      if (result === this.userEmail[index]) {
        this.accessExist = false;
        console.log('User already has access!');
        break;
      } else {
        this.accessExist = true;
      }
    }
    if (this.accessExist) {
      this.myAccess.push(this.fb.group({
      user: this.userEmail[index]
      }));
      this.apiService.updateEvent(id, this.accessForm.value)
        .subscribe(res => {
          console.log('Access given successfully!');
      });
    }
  }

  removeAccess(index) {
    // call the service again to update
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.getEventbis(id);
    // if the user has already access, no action performed
    for ( let i = 0; i < this.event.access.length; i++) {
      const result = ( (this.accessForm.get('access') as FormArray).controls[i].get('user') as FormArray).value;
      if (result === this.userEmail[index]) {
        this.myAccess.removeAt(this.myAccess.value.findIndex(access => access.user === result));
        this.apiService.updateEvent(id, this.accessForm.value)
        .subscribe(res => {
          console.log('Access removed!');
      });
        break;
      }
    }
  }

  onSubmit() {
    // owner value remains the same
    this.accessForm.controls.owner = this.accessForm.controls.owner.value;
    this.submitted = true;
    if (!this.accessForm.valid) {
      return false;
    } else {
        const id = this.actRoute.snapshot.paramMap.get('id');
        this.apiService.updateEvent(id, this.accessForm.value)
          .subscribe(res => {
            console.log('Access given successfully!');
          }, (error) => {
            console.log(error);
          });
    }
  }
}
