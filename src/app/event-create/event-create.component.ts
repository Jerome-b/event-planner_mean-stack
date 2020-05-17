import { Component, OnInit, NgZone } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TokenStorageService } from '../_services/token-storage.service';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class EventCreateComponent implements OnInit {

  submitted = false;
  eventForm: FormGroup;
  drinkSizeSelection: any = ['fl.oz', 'L', 'mL', 'gal'];
  foodSizeSelection: any = ['lbs', 'kg', 'g', 'oz', 'qt'];
  time: string;
  drink: FormArray;
  food: FormArray;
  object: FormArray;
  isLoggedIn = false;
  userId: string;
  userEmail: string;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService,
    public fb2: FormBuilder,
    public fb3: FormBuilder,
    public fb4: FormBuilder,
    public fb5: FormBuilder,
    private tokenStorageService: TokenStorageService,
    private location: Location,
  ) {
    this.mainForm();
  }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
  }

  mainForm() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.userId = user.id;
      this.userEmail = user.email;
    }
    this.eventForm = this.fb.group({
      owner: [this.userId, [Validators.nullValidator]],
      name: ['', [Validators.required]],
      date: new FormControl(moment()),
      time: ['', [Validators.required]],
      address: ['', [Validators.required]],
      description: ['', [Validators.required]],
      drinkNeeded: this.fb.array([this.fb2.group({
        drinkName: ['', [Validators.required]],
        drinkSize: ['fl.oz', [Validators.required]],
        drinkSizeNumber: ['', [Validators.required]],
        drinkQuantity: ['', [Validators.required]],
      })]),
      drinkAdded: this.fb.array([]),
      foodNeeded: this.fb.array([this.fb3.group({
        foodName: ['', [Validators.required]],
        foodSize: ['lbs', [Validators.required]],
        foodSizeNumber: ['', [Validators.required]],
        foodQuantity: ['', [Validators.required]]
      })]),
      foodAdded: this.fb.array([]),
      objectNeeded: this.fb.array([this.fb4.group({
        objectName: ['', [Validators.required]],
        objectQuantity: ['', [Validators.required]]
      })]),
      objectAdded: this.fb.array([]),
      access: this.fb.array([this.fb5.group({
        user: [this.userEmail, [Validators.nullValidator]],
      })]),
    });
  }

  // Getter to access form control
  get myForm() {
    return this.eventForm.controls;
  }

  get drinkForm() {
    return this.eventForm.get('drinkNeeded') as FormArray;
  }

  get foodForm() {
    return this.eventForm.get('foodNeeded') as FormArray;
  }

  get objectForm() {
    return this.eventForm.get('objectNeeded') as FormArray;
  }

  // Add form group dynamically
  addDrink() {
    this.drinkForm.push(this.fb2.group({
      drinkName: '',
      drinkSize: 'fl.oz',
      drinkSizeNumber: '',
      drinkQuantity: '',
    }));
  }

  addFood() {
    this.foodForm.push(this.fb3.group({
      foodName: '',
      foodSize: 'lbs',
      foodSizeNumber: '',
      foodQuantity: '',
    }));
  }

  addObject() {
    this.objectForm.push(this.fb4.group({
      objectName: '',
      objectQuantity: '',
    }));
  }

  // Delete form group dynamically
  delDrink(index: number) {
    const arrayControl = this.eventForm.controls.drinkNeeded as FormArray;
    arrayControl.removeAt(index);
  }

  delFood(index: number) {
    const arrayControl = this.eventForm.controls.foodNeeded as FormArray;
    arrayControl.removeAt(index);
  }

  delObject(index: number) {
    const arrayControl = this.eventForm.controls.objectNeeded as FormArray;
    arrayControl.removeAt(index);
  }

  // back function for back button
  goBack() {
    this.location.back();
  }


  onSubmit() {
    this.eventForm.patchValue({
      owner: this.userId,
    });
    this.submitted = true;
    if (!this.eventForm.valid) {
      return false;
    } else {
      this.apiService.createEvent(this.eventForm.value).subscribe(
        () => {
          console.log('Event successfully created!');
          this.ngZone.run(() => this.router.navigateByUrl('/event-list'));
        }, (error) => {
          console.log(error);
        });
      }
    }
}

