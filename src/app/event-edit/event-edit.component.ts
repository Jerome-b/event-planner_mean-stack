import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../_services/api.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Event } from '../models/event';


@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    public fb2: FormBuilder,
    public fb3: FormBuilder,
    public fb4: FormBuilder,
    private actRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) { }

  submitted = false;
  editForm: FormGroup;
  drinkSizeSelection: any = ['fl.oz', 'L', 'mL', 'gal'];
  foodSizeSelection: any = ['lbs', 'kg', 'g', 'oz', 'qt'];
  event: Event;

  ngOnInit() {
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.getEvent(id);
    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      address: ['', [Validators.required]],
      description: ['', [Validators.required]],
      drink: this.fb.array([]),
      food: this.fb.array([]),
      object: this.fb.array([]),
    });
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

  getEvent(id) {
    this.apiService.getEvent(id).subscribe({
      next: (event: Event) => {
        this.event = event;
        this.displayEvent(event);
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

  // Retrieve the 3 form group: drink, food and object
  setFormgroup() {
    const control = this.editForm.get('drink') as FormArray;
    const control2 = this.editForm.get('food') as FormArray;
    const control3 = this.editForm.get('object') as FormArray;
    this.event.drink.forEach(test => {
      control.push(this.fb.group(test));
    });
    this.event.food.forEach(test => {
      control2.push(this.fb.group(test));
    });
    this.event.object.forEach(test => {
      control3.push(this.fb.group(test));
    });
  }

  // Display the event form to edit
  displayEvent(event: Event): void {
    this.editForm.patchValue({
      name: event.name,
      date: event.date,
      time: event.time,
      address: event.address,
      description: event.description,
    });

    this.setFormgroup();
  }

  onSubmit() {
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
