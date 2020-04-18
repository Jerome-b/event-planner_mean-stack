import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../_services/api.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Event } from '../models/event';
import { TokenStorageService } from '../_services/token-storage.service';



@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {

  userId: string;
  isLoggedIn = false;
  accessAllowed = false;
  func: any;
  disabledd = false;
  clicked = true;
  drinkLength: any;
  foodLength: any;
  objectLength: any;

  constructor(
    public fb: FormBuilder,
    public fb2: FormBuilder,
    public fb3: FormBuilder,
    public fb4: FormBuilder,
    private actRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private tokenStorageService: TokenStorageService,
  ) { }

  submitted = false;
  editForm: FormGroup;
  drinkSizeSelection: any = ['fl.oz', 'L', 'mL', 'gal'];
  foodSizeSelection: any = ['lbs', 'kg', 'g', 'oz', 'qt'];
  event: Event;

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.getEvent(id);
    this.editForm = this.fb.group({
      owner: [''],
      name: [{value: '', disabled: this.disabledd}, [Validators.required]],
      date: [{value: '', disabled: this.disabledd}, [Validators.required]],
      time: ['', [Validators.required]],
      address: [{value: '', disabled: this.disabledd}, [Validators.required]],
      description: [{value: '', disabled: this.disabledd}, [Validators.required]],
      drink: this.fb.array([]),
      food: this.fb.array([]),
      object: this.fb.array([]),
      access: this.fb.array([]),
    });
  }

  // Get owner value for ngIf comparison in view
  get owner() {
    return this.editForm.controls.owner.value;
  }

  get name() {
    return this.editForm.value.name;
  }

  // Get user id value for ngIf comparison in view
  get idUser() {
    const user = this.tokenStorageService.getUser();
    this.userId = user.id;
    return this.userId;
  }

  // Getter to access form control
  get myForm() {
    return this.editForm.controls;
  }

  get drinkForm() {
    return this.editForm.get('drink') as FormArray;
  }

  get foodForm() {
    return this.editForm.get('food') as FormArray;
  }

  get objectForm() {
    return this.editForm.get('object') as FormArray;
  }

  get accessForm() {
    return this.editForm.get('access') as FormArray;
  }

  getEvent(id) {
    this.apiService.getEvent(id).subscribe({
      next: (event: Event) => {
        this.event = event;
        this.displayEvent(event);
        this.disable();
        this.length();
        let i: any;
        // allow access only for invited users
        for (i = 0; i < this.accessForm.length; i++) {
          const control = this.accessForm.controls[i].get('user');
          if (this.userId === control.value) {
            this.accessAllowed = true;
          }
        }
    }});
  }

  getEventbis(id) {
    this.apiService.getEvent(id).subscribe({
      next: (event: Event) => {
        this.event = event;
    }});
  }

  // Add form group dynamically
  addDrink() {
    this.drinkForm.push(this.fb2.group({
      drinkName: '',
      drinkSize: '',
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

  length() {
    this.drinkLength = this.drinkForm.length;
    this.foodLength = this.foodForm.length;
    this.objectLength = this.objectForm.length;
  }

  changepage() {
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.router.navigateByUrl('/event-edit/' + id + '/access');
  }

  // Delete form group dynamically
  delDrink(index: number) {
    const arrayControl = this.editForm.controls.drink as FormArray;
    arrayControl.removeAt(index);
  }

  delFood(index: number) {
    const arrayControl = this.editForm.controls.food as FormArray;
    arrayControl.removeAt(index);
  }

  delObject(index: number) {
    const arrayControl = this.editForm.controls.object as FormArray;
    arrayControl.removeAt(index);
  }

  // prevent edit from non-owner
  disable() {
    if (this.userId !== this.owner) {
      this.disabledd = true;
    }
  }

  // Display the event form to edit
  displayEvent(event: Event): void {
    this.editForm.patchValue({
      owner: event.owner,
      name: event.name,
      date: event.date,
      time: event.time,
      address: event.address,
      description: event.description,
    });

    this.setFormgroup();
  }

  // Retrieve the form group: drink, food, object and access
  setFormgroup() {
    const control = this.editForm.get('drink') as FormArray;
    const control2 = this.editForm.get('food') as FormArray;
    const control3 = this.editForm.get('object') as FormArray;
    const control4 = this.editForm.get('access') as FormArray;
    this.event.drink.forEach(a => {
      control.push(this.fb.group(a));
    });
    this.event.food.forEach(a => {
      control2.push(this.fb.group(a));
    });
    this.event.object.forEach(a => {
      control3.push(this.fb.group(a));
    });
    this.event.access.forEach(a => {
      control4.push(this.fb.group(a));
    });
  }

  onSubmit() {
    // owner value remains the same
    this.editForm.controls.owner = this.editForm.controls.owner.value;
    this.submitted = true;
    if (!this.editForm.valid) {
      return false;
    } else {
      if (window.confirm('Are you sure?')) {
        const id = this.actRoute.snapshot.paramMap.get('id');
        this.apiService.updateEvent(id, this.editForm.value)
          .subscribe(res => {
            this.router.navigateByUrl('/event-list');
            console.log('Content updated successfully!');
          }, (error) => {
            console.log(error);
          });
      }
    }
  }

}
