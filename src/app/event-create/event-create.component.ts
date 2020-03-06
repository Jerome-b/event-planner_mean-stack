import { Component, OnInit, NgZone } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {

  submitted = false;
  eventForm: FormGroup;
  drinkSizeSelection: any = ['fl.oz', 'L', 'mL'];

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService
  ) {
    this.mainForm();
   }

  ngOnInit() {}

  mainForm() {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      address: ['', [Validators.required]],
      drinkName: ['', [Validators.required]],
      drinkSize: ['', [Validators.required]],
      drinkSizeNumber: ['', [Validators.required]],
      drinkQuantity: ['', [Validators.required]],
      tests: this.fb.array([this.testTask()])
    });
  }

  get testControl() {
    return this.eventForm.get('tests') as FormArray;
  }

  testTask() {
    return this.fb.group({
      test: ['', Validators.required]
    });
  }

  // Choose size with select dropdown
  updateEvent(e) {
    this.eventForm.get('drinkSize').setValue(e, {
      onlySelf: true
    });
  }

  // Getter to access form control
  get myForm() {
    return this.eventForm.controls;
  }

  addtest() {
    this.testControl.push(this.testTask());
  }

  onSubmit() {
    this.submitted = true;
    if (!this.eventForm.valid) {
      return false;
    } else {
      this.apiService.createEvent(this.eventForm.value).subscribe(
        (res) => {
          console.log('Event successfully created!');
          this.ngZone.run(() => this.router.navigateByUrl('/event-list'));
        }, (error) => {
          console.log(error);
        });
      }
    }
}

