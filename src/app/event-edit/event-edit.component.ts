import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../_services/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Event } from '../models/event';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {

  submitted = false;
  editForm: FormGroup;
  eventData: Event[];
  drinkSize: any = ['fl.oz', 'L', 'mL'];

  constructor(
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.updateEvent();
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.getEvent(id);
    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      address: ['', [Validators.required]],
      drinkName: ['', [Validators.required]],
      drinkSize: ['', [Validators.required]]
    });
  }

  // Choose options with select-dropdown
  updateProfile(e) {
    this.editForm.get('drinkSize').setValue(e, {
      onlySelf: true
    });
  }

  // Getter to access form control
  get myForm() {
    return this.editForm.controls;
  }

  getEvent(id) {
    this.apiService.getEvent(id).subscribe(data => {
      this.editForm.setValue({
        name: data.name,
        description: data.description,
        address: data.address,
        drinkName: data.drinkName,
        drinkSize: data.drinkSize
      });
    });
  }

  updateEvent() {
    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      address: ['', [Validators.required]],
      drinkName: ['', [Validators.required]],
      drinkSize: ['', [Validators.required]]
    });
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
