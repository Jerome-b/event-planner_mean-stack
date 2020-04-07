import { Component, OnInit, NgZone } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
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

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService,
    public fb2: FormBuilder,
    public fb3: FormBuilder,
    public fb4: FormBuilder,
    private tokenStorage: TokenStorageService,
  ) {
    this.mainForm();
  }

  ngOnInit() { }

  mainForm() {
    this.isLoggedIn = !!this.tokenStorage.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorage.getUser();
      this.userId = user.id;
    }
    this.eventForm = this.fb.group({
      user: [this.userId],
      name: ['', [Validators.required]],
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      address: ['', [Validators.required]],
      description: ['', [Validators.required]],
      drink: this.fb.array([this.fb2.group({
        drinkName: ['', [Validators.required]],
        drinkSize: ['fl.oz', [Validators.required]],
        drinkSizeNumber: ['', [Validators.required]],
        drinkQuantity: ['', [Validators.required]],
      })]),
      food: this.fb.array([this.fb3.group({
        foodName: ['', [Validators.required]],
        foodSize: ['', [Validators.required]],
        foodSizeNumber: ['', [Validators.required]],
        foodQuantity: ['', [Validators.required]]
      })]),
      object: this.fb.array([this.fb4.group({
        objectName: ['', [Validators.required]],
        objectQuantity: ['', [Validators.required]]
      })]),
    });
  }

  // Getter to access form control
  get myForm() {
    return this.eventForm.controls;
  }

  get drinkForm() {
    return this.eventForm.get('drink') as FormArray;
  }

  get foodForm() {
    return this.eventForm.get('food') as FormArray;
  }

  get objectForm() {
    return this.eventForm.get('object') as FormArray;
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
      foodSize: '',
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
    const arrayControl = this.eventForm.controls.drink as FormArray;
    arrayControl.removeAt(index);
  }

  delFood(index: number) {
    const arrayControl = this.eventForm.controls.food as FormArray;
    arrayControl.removeAt(index);
  }

  delObject(index: number) {
    const arrayControl = this.eventForm.controls.object as FormArray;
    arrayControl.removeAt(index);
  }

  addNewUnit() {

  }

  onSubmit() {
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

