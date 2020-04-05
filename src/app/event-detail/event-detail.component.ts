import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../_services/api.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Event } from '../models/event';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) { }

  submitted = false;
  detailForm: FormGroup;
  drinkSizeSelection: any = ['fl.oz', 'L', 'mL', 'gal'];
  foodSizeSelection: any = ['lbs', 'kg', 'g', 'oz', 'qt'];
  event: Event;

  ngOnInit() {
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.getEvent(id);
    this.detailForm = this.fb.group({
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
    return this.detailForm.controls;
  }

  get drinkForm() {
    return this.detailForm.get('drink') as FormArray;
  }

  get foodForm() {
    return this.detailForm.get('food') as FormArray;
  }

  get objectForm() {
    return this.detailForm.get('object') as FormArray;
  }

  // Get name value
  get name() {
    return this.detailForm.value.name;
  }

  getEvent(id) {
    this.apiService.getEvent(id).subscribe({
      next: (event: Event) => {
        this.event = event;
        this.displayEvent(event);
    }});
  }

  // Retrieve the 3 form group: drink, food and object
  setFormgroup() {
    const control = this.detailForm.get('drink') as FormArray;
    const control2 = this.detailForm.get('food') as FormArray;
    const control3 = this.detailForm.get('object') as FormArray;
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
    this.detailForm.patchValue({
      name: event.name,
      date: event.date,
      time: event.time,
      address: event.address,
      description: event.description,
    });

    this.setFormgroup();
  }
}
