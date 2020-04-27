import { Component, OnInit, AfterContentChecked, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../_services/api.service';
import { FormGroup, FormBuilder, Validators, FormArray, Form } from '@angular/forms';
import { Event } from '../models/event';
import { TokenStorageService } from '../_services/token-storage.service';


@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
})
export class EventDetailComponent implements OnInit {

  drink: any;
  food: any;
  isLoggedIn = false;
  userId: any;
  userEmail: string;
  accessAllowed = false;
  finalResult: any;
  duplication = false;
  empty: any;
  i = 0;
  j = 0;
  upperCase: any;
  upperCase2: any;

// object for computation
  //////// drink ////////
  addedDrinkQuantity: any;
  addedDrinkQuantity2: any;
  addedDrinkName: any;
  addedDrinkName2: any;
  addedDrinkSize: any;
  addedDrinkSizeNumber: any;
  addedDrinkSize2: any;
  addedDrinkSizeNumber2: any;
  neededDrinkName: any;
  neededDrinkSizeNumber: any;
  neededDrinkSize: any;
  neededDrinkQuantity: any;

  //////// food ////////
  addedFoodQuantity: any;
  addedFoodQuantity2: any;
  addedFoodName: any;
  addedFoodName2: any;
  addedFoodSize: any;
  addedFoodSizeNumber: any;
  addedFoodSize2: any;
  addedFoodSizeNumber2: any;
  neededFoodName: any;
  neededFoodSizeNumber: any;
  neededFoodSize: any;
  neededFoodQuantity: any;

  //////// object ////////
  addedObjectQuantity: any;
  addedObjectQuantity2: any;
  addedObjectName: any;
  addedObjectName2: any;
  addedObjectSize: any;
  addedObjectSizeNumber: any;
  addedObjectSize2: any;
  addedObjectSizeNumber2: any;
  neededObjectName: any;
  neededObjectSizeNumber: any;
  neededObjectSize: any;
  neededObjectQuantity: any;

  constructor(
    public fb: FormBuilder,
    public fb2: FormBuilder,
    private actRoute: ActivatedRoute,
    private apiService: ApiService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
  ) { }

  submitted = false;
  detailForm: FormGroup;
  drinkSizeSelection: any = ['fl.oz', 'L', 'mL', 'gal'];
  foodSizeSelection: any = ['lbs', 'kg', 'g', 'oz', 'qt'];
  event: Event;

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    const id = this.actRoute.snapshot.paramMap.get('id');
    const user = this.tokenStorageService.getUser();
    this.userEmail = user.email;
    this.getEvent(id);
    this.detailForm = this.fb.group({
      name: [{value: '', disabled: true}, [Validators.required]],
      date: [{value: '', disabled: true}, [Validators.required]],
      time: ['', [Validators.required]],
      address: ['', [Validators.required]],
      description: [{value: '', disabled: true}, [Validators.required]],
      drinkNeeded: this.fb.array([]),
      drinkAdded: this.fb.array([]),
      foodNeeded: this.fb.array([]),
      foodAdded: this.fb.array([]),
      objectNeeded: this.fb.array([]),
      objectAdded: this.fb.array([]),
      access: this.fb.array([]),
    });
  }

  // Getter to access form control
  get myForm() {
    return this.detailForm.controls;
  }

  get drinkForm() {
    return this.detailForm.get('drinkNeeded') as FormArray;
  }

  get drinkBroughtForm() {
    return this.detailForm.get('drinkAdded') as FormArray;
  }

  get foodForm() {
    return this.detailForm.get('foodNeeded') as FormArray;
  }

  get foodBroughtForm() {
    return this.detailForm.get('foodAdded') as FormArray;
  }

  get objectForm() {
    return this.detailForm.get('objectNeeded') as FormArray;
  }

  get objectBroughtForm() {
    return this.detailForm.get('objectAdded') as FormArray;
  }

  get accessForm() {
    return this.detailForm.get('access') as FormArray;
  }

  // Get name value
  get name() {
    return this.detailForm.controls.name.value;
  }

  get date() {
    return this.detailForm.controls.date.value;
  }

  get address() {
    return this.detailForm.controls.address.value;
  }

  getEvent(id) {
      this.apiService.getEvent(id).subscribe({
        next: (event: Event) => {
          this.event = event;
          this.displayEvent(event);
          let i: any;
          for (i = 0; i < this.accessForm.length; i++) {
            const control = this.accessForm.controls[i].get('user');
            if (this.userEmail === control.value) {
              this.accessAllowed = true;
            }
          }
      }});
    }

    // Retrieve the 3 form group: drink, food and object
  setFormgroup() {
      const control = this.detailForm.get('drinkNeeded') as FormArray;
      const control2 = this.detailForm.get('foodNeeded') as FormArray;
      const control3 = this.detailForm.get('objectNeeded') as FormArray;
      const control4 = this.detailForm.get('access') as FormArray;
      const control5 = this.detailForm.get('drinkAdded') as FormArray;
      const control6 = this.detailForm.get('foodAdded') as FormArray;
      const control7 = this.detailForm.get('objectAdded') as FormArray;
      this.event.drinkNeeded.forEach(a => {
        control.push(this.fb.group(a));
      });
      this.event.foodNeeded.forEach(a => {
        control2.push(this.fb.group(a));
      });
      this.event.objectNeeded.forEach(a => {
        control3.push(this.fb.group(a));
      });
      this.event.access.forEach(a => {
        control4.push(this.fb.group(a));
      });
      this.event.drinkAdded.forEach(a => {
        control5.push(this.fb.group(a));
      });
      this.event.foodAdded.forEach(a => {
        control6.push(this.fb.group(a));
      });
      this.event.objectAdded.forEach(a => {
        control7.push(this.fb.group(a));
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

  accessEdit() {
      const id = this.actRoute.snapshot.paramMap.get('id');
      this.router.navigateByUrl('/event-edit/' + id);
    }

  /////////////////// return form value ////////////////////////////

  //// needed by owner ////
  ////// drink ////////
  drinkName(index) {
        const result = ( (this.detailForm.get('drinkNeeded') as FormArray).controls[index].get('drinkName') as FormArray).value;
        return result;
    }

  drinkSize(index) {
      const result = ( (this.detailForm.get('drinkNeeded') as FormArray).controls[index].get('drinkSizeNumber') as FormArray).value;
      const result2 = ( (this.detailForm.get('drinkNeeded') as FormArray).controls[index].get('drinkSize') as FormArray).value;
      return [result + result2];
    }

  drinkQuantity(index) {
        const result = ( (this.detailForm.get('drinkNeeded') as FormArray).controls[index].get('drinkQuantity') as FormArray).value;
        return result;
    }

  ////// food ////////
  foodName(index) {
      const result = ( (this.detailForm.get('foodNeeded') as FormArray).controls[index].get('foodName') as FormArray).value;
      return result;
    }

  foodSize(index) {
      const result = ( (this.detailForm.get('foodNeeded') as FormArray).controls[index].get('foodSizeNumber') as FormArray).value;
      const result2 = ( (this.detailForm.get('foodNeeded') as FormArray).controls[index].get('foodSize') as FormArray).value;
      return [result + result2];
    }

  foodQuantity(index) {
        const result = ( (this.detailForm.get('foodNeeded') as FormArray).controls[index].get('foodQuantity') as FormArray).value;
        return result;
    }

  ////// object ////////
  objectName(index) {
      const result = ( (this.detailForm.get('objectNeeded') as FormArray).controls[index].get('objectName') as FormArray).value;
      return result;
    }

  objectQuantity(index) {
        const result = ( (this.detailForm.get('objectNeeded') as FormArray).controls[index].get('objectQuantity') as FormArray).value;
        return result;
    }

  //// brought by guests ////
  ////// drink ////////
  drinkBroughtName(index) {
      const result = ( (this.detailForm.get('drinkAdded') as FormArray).controls[index].get('drinkName') as FormArray).value;
      return result;
    }

  drinkBroughtSize(index) {
    const result = ( (this.detailForm.get('drinkAdded') as FormArray).controls[index].get('drinkSizeNumber') as FormArray).value;
    const result2 = ( (this.detailForm.get('drinkAdded') as FormArray).controls[index].get('drinkSize') as FormArray).value;
    return [result + result2];
    }

  drinkBroughtQuantity(index) {
      const result = ( (this.detailForm.get('drinkAdded') as FormArray).controls[index].get('drinkQuantity') as FormArray).value;
      return result;
    }

    ////// food ////////
  foodBroughtName(index) {
    const result = ( (this.detailForm.get('foodAdded') as FormArray).controls[index].get('foodName') as FormArray).value;
    return result;
    }

  foodBroughtSize(index) {
    const result = ( (this.detailForm.get('foodAdded') as FormArray).controls[index].get('foodSizeNumber') as FormArray).value;
    const result2 = ( (this.detailForm.get('foodAdded') as FormArray).controls[index].get('foodSize') as FormArray).value;
    return [result + result2];
    }

  foodBroughtQuantity(index) {
      const result = ( (this.detailForm.get('foodAdded') as FormArray).controls[index].get('foodQuantity') as FormArray).value;
      return result;
    }

    ////// object ////////
  objectBroughtName(index) {
    const result = ( (this.detailForm.get('objectAdded') as FormArray).controls[index].get('objectName') as FormArray).value;
    return result;
    }

  objectBroughtQuantity(index) {
      const result = ( (this.detailForm.get('objectAdded') as FormArray).controls[index].get('objectQuantity') as FormArray).value;
      return result;
    }
  ///////////////////////////////////////////////

  /// computation for REMAINING items needed


/////////////////////////////// DRINK ///////////////////////////////
  drinkRealtimeNeed(index) {
    this.duplication = false;
    for (this.i = 0; this.i < index; this.i++) {
      this.addedDrinkName = ((this.detailForm.get('drinkAdded') as FormArray).controls[index].get('drinkName') as FormArray).value;
      this.addedDrinkName2 = ((this.detailForm.get('drinkAdded') as FormArray).controls[this.i].get('drinkName') as FormArray).value;
      this.addedDrinkSizeNumber = ((this.detailForm.get('drinkAdded') as FormArray).controls[index].get('drinkSizeNumber') as FormArray).value;
      this.addedDrinkSize = ((this.detailForm.get('drinkAdded') as FormArray).controls[index].get('drinkSize') as FormArray).value;
      this.addedDrinkSizeNumber2 = ((this.detailForm.get('drinkAdded') as FormArray).controls[this.i].get('drinkSizeNumber') as FormArray).value;
      this.addedDrinkSize2 = ((this.detailForm.get('drinkAdded') as FormArray).controls[this.i].get('drinkSize') as FormArray).value;
      this.upperCase = this.addedDrinkName.toUpperCase();
      this.upperCase2 = this.addedDrinkName2.toUpperCase();
      if (this.upperCase === this.upperCase2 &&
          this.addedDrinkSizeNumber === this.addedDrinkSizeNumber2 &&
          this.addedDrinkSize === this.addedDrinkSize2 ) {
        this.duplication = true;
        return null;
      }
    }

    if (!this.duplication) {
      this.finalResult = 0;
      for (this.i = index + 1; this.i < this.event.drinkAdded.length; this.i++) {
        this.addedDrinkName = ((this.detailForm.get('drinkAdded') as FormArray).controls[index].get('drinkName') as FormArray).value;
        this.upperCase = this.addedDrinkName.toUpperCase();
        this.addedDrinkSizeNumber = ((this.detailForm.get('drinkAdded') as FormArray).controls[index].get('drinkSizeNumber') as FormArray).value;
        this.addedDrinkSize = ((this.detailForm.get('drinkAdded') as FormArray).controls[index].get('drinkSize') as FormArray).value;
        this.addedDrinkName2 = ((this.detailForm.get('drinkAdded') as FormArray).controls[this.i].get('drinkName') as FormArray).value;
        this.upperCase2 = this.addedDrinkName2.toUpperCase();
        this.addedDrinkQuantity2 = ((this.detailForm.get('drinkAdded') as FormArray).controls[this.i].get('drinkQuantity') as FormArray).value;
        this.addedDrinkSizeNumber2 = ((this.detailForm.get('drinkAdded') as FormArray).controls[this.i].get('drinkSizeNumber') as FormArray).value;
        this.addedDrinkSize2 = ((this.detailForm.get('drinkAdded') as FormArray).controls[this.i].get('drinkSize') as FormArray).value;
        if (  this.upperCase === this.upperCase2  &&
              this.addedDrinkSizeNumber === this.addedDrinkSizeNumber2 &&
              this.addedDrinkSize === this.addedDrinkSize2 ) {
          this.finalResult = this.addedDrinkQuantity2 + this.finalResult || 0;
          return;
        }
      }

      let nonExistantNeededDrink = 0;
      for (this.j = index - index; this.j < this.event.drinkNeeded.length; this.j++) {
        this.addedDrinkName = ((this.detailForm.get('drinkAdded') as FormArray).controls[index].get('drinkName') as FormArray).value;
        this.upperCase = this.addedDrinkName.toUpperCase();
        this.addedDrinkSizeNumber = ((this.detailForm.get('drinkAdded') as FormArray).controls[index].get('drinkSizeNumber') as FormArray).value;
        this.addedDrinkSize = ((this.detailForm.get('drinkAdded') as FormArray).controls[index].get('drinkSize') as FormArray).value;
        this.addedDrinkQuantity = ((this.detailForm.get('drinkAdded') as FormArray).controls[index].get('drinkQuantity') as FormArray).value;
        this.neededDrinkName = ((this.detailForm.get('drinkNeeded') as FormArray).controls[this.j].get('drinkName') as FormArray).value;
        this.upperCase2 = this.neededDrinkName.toUpperCase();
        this.neededDrinkSizeNumber = ((this.detailForm.get('drinkNeeded') as FormArray).controls[this.j].get('drinkSizeNumber') as FormArray).value;
        this.neededDrinkSize = ((this.detailForm.get('drinkNeeded') as FormArray).controls[this.j].get('drinkSize') as FormArray).value;
        this.neededDrinkQuantity = ((this.detailForm.get('drinkNeeded') as FormArray).controls[this.j].get('drinkQuantity') as FormArray).value;
        if (this.upperCase === this.upperCase2 &&
            this.addedDrinkSize === this.neededDrinkSize &&
            this.addedDrinkSizeNumber === this.neededDrinkSizeNumber) {
          this.finalResult = this.neededDrinkQuantity - (this.finalResult + this.addedDrinkQuantity);
          break;
          } else {
            nonExistantNeededDrink = nonExistantNeededDrink + 1;
          }
        if (this.j === (this.event.drinkNeeded.length - 1) && nonExistantNeededDrink === this.j + 1) {
          this.finalResult = 0 - this.addedDrinkQuantity;
          return;
        }
      }
    }
  }

  nonBroughtNeededDrink(index) {
    this.duplication = false;
    let nonExistantBroughtDrink = 0;
    if  ( this.event.drinkAdded.length === 0) {
      this.neededDrinkName = ((this.detailForm.get('drinkNeeded') as FormArray).controls[index].get('drinkName') as FormArray).value;
      this.neededDrinkQuantity = ((this.detailForm.get('drinkNeeded') as FormArray).controls[index].get('drinkQuantity') as FormArray).value;
      this.neededDrinkSizeNumber = ((this.detailForm.get('drinkNeeded') as FormArray).controls[index].get('drinkSizeNumber') as FormArray).value;
      this.neededDrinkSize = ((this.detailForm.get('drinkNeeded') as FormArray).controls[index].get('drinkSize') as FormArray).value;
    }
    for (let i = 0; i < this.event.drinkAdded.length; i++ ) {
      this.neededDrinkName = ((this.detailForm.get('drinkNeeded') as FormArray).controls[index].get('drinkName') as FormArray).value;
      this.upperCase = this.neededDrinkName.toUpperCase();
      this.neededDrinkSizeNumber = ((this.detailForm.get('drinkNeeded') as FormArray).controls[index].get('drinkSizeNumber') as FormArray).value;
      this.neededDrinkSize = ((this.detailForm.get('drinkNeeded') as FormArray).controls[index].get('drinkSize') as FormArray).value;
      this.neededDrinkQuantity = ((this.detailForm.get('drinkNeeded') as FormArray).controls[index].get('drinkQuantity') as FormArray).value;
      this.addedDrinkName = ((this.detailForm.get('drinkAdded') as FormArray).controls[i].get('drinkName') as FormArray).value;
      this.upperCase2 = this.addedDrinkName.toUpperCase();
      this.addedDrinkSizeNumber = ((this.detailForm.get('drinkAdded') as FormArray).controls[i].get('drinkSizeNumber') as FormArray).value;
      this.addedDrinkSize = ((this.detailForm.get('drinkAdded') as FormArray).controls[i].get('drinkSize') as FormArray).value;
      this.addedDrinkQuantity = ((this.detailForm.get('drinkAdded') as FormArray).controls[i].get('drinkQuantity') as FormArray).value;
      if (this.upperCase === this.upperCase2 &&
          this.neededDrinkSize === this.addedDrinkSize &&
          this.neededDrinkSizeNumber === this.addedDrinkSizeNumber) {
            this.duplication = true;
            return null;
          } else {
            nonExistantBroughtDrink = nonExistantBroughtDrink + 1;
          }
      if (i === (this.event.drinkAdded.length - 1) && nonExistantBroughtDrink === i + 1) {
        return;
      }
    }
  }

/////////////////////////////// FOOD ///////////////////////////////
  foodRealtimeNeed(index) {
    this.duplication = false;
    this.finalResult = 0;
    for (this.i = 0; this.i < index; this.i++) {
      this.addedFoodName = ((this.detailForm.get('foodAdded') as FormArray).controls[index].get('foodName') as FormArray).value;
      this.addedFoodName2 = ((this.detailForm.get('foodAdded') as FormArray).controls[this.i].get('foodName') as FormArray).value;
      this.addedFoodSizeNumber = ((this.detailForm.get('foodAdded') as FormArray).controls[index].get('foodSizeNumber') as FormArray).value;
      this.addedFoodSize = ((this.detailForm.get('foodAdded') as FormArray).controls[index].get('foodSize') as FormArray).value;
      this.addedFoodSizeNumber2 = ((this.detailForm.get('foodAdded') as FormArray).controls[this.i].get('foodSizeNumber') as FormArray).value;
      this.addedFoodSize2 = ((this.detailForm.get('foodAdded') as FormArray).controls[this.i].get('foodSize') as FormArray).value;
      this.upperCase = this.addedFoodName.toUpperCase();
      this.upperCase2 = this.addedFoodName2.toUpperCase();
      if (this.upperCase === this.upperCase2 &&
          this.addedFoodSizeNumber === this.addedFoodSizeNumber2 &&
          this.addedFoodSize === this.addedFoodSize2 ) {
        this.duplication = true;
        return null;
      }
    }

    if (!this.duplication) {
      this.finalResult = 0;
      for (this.i = index + 1; this.i < this.event.foodAdded.length; this.i++) {
        this.addedFoodName = ((this.detailForm.get('foodAdded') as FormArray).controls[index].get('foodName') as FormArray).value;
        this.upperCase = this.addedFoodName.toUpperCase();
        this.addedFoodSizeNumber = ((this.detailForm.get('foodAdded') as FormArray).controls[index].get('foodSizeNumber') as FormArray).value;
        this.addedFoodSize = ((this.detailForm.get('foodAdded') as FormArray).controls[index].get('foodSize') as FormArray).value;
        this.addedFoodName2 = ((this.detailForm.get('foodAdded') as FormArray).controls[this.i].get('foodName') as FormArray).value;
        this.upperCase2 = this.addedFoodName2.toUpperCase();
        this.addedFoodQuantity2 = ((this.detailForm.get('foodAdded') as FormArray).controls[this.i].get('foodQuantity') as FormArray).value;

        this.addedFoodSizeNumber2 = ((this.detailForm.get('foodAdded') as FormArray).controls[this.i].get('foodSizeNumber') as FormArray).value;
        this.addedFoodSize2 = ((this.detailForm.get('foodAdded') as FormArray).controls[this.i].get('foodSize') as FormArray).value;
        if (  this.upperCase === this.upperCase2  &&
              this.addedFoodSizeNumber === this.addedFoodSizeNumber2 &&
              this.addedFoodSize === this.addedFoodSize2 ) {
          this.finalResult = this.addedFoodQuantity2 + this.finalResult || 0;
          console.log('final Result1: ' + this.finalResult);
        }
      }

      let nonExistantNeededFood = 0;
      for (this.j = index - index; this.j < this.event.foodNeeded.length; this.j++) {
        this.addedFoodName = ((this.detailForm.get('foodAdded') as FormArray).controls[index].get('foodName') as FormArray).value;
        this.upperCase = this.addedFoodName.toUpperCase();
        this.addedFoodSizeNumber = ((this.detailForm.get('foodAdded') as FormArray).controls[index].get('foodSizeNumber') as FormArray).value;
        this.addedFoodSize = ((this.detailForm.get('foodAdded') as FormArray).controls[index].get('foodSize') as FormArray).value;
        this.addedFoodQuantity = ((this.detailForm.get('foodAdded') as FormArray).controls[index].get('foodQuantity') as FormArray).value;
        this.neededFoodName = ((this.detailForm.get('foodNeeded') as FormArray).controls[this.j].get('foodName') as FormArray).value;
        this.upperCase2 = this.neededFoodName.toUpperCase();
        this.neededFoodSizeNumber = ((this.detailForm.get('foodNeeded') as FormArray).controls[this.j].get('foodSizeNumber') as FormArray).value;
        this.neededFoodSize = ((this.detailForm.get('foodNeeded') as FormArray).controls[this.j].get('foodSize') as FormArray).value;
        this.neededFoodQuantity = ((this.detailForm.get('foodNeeded') as FormArray).controls[this.j].get('foodQuantity') as FormArray).value;
        if (this.upperCase === this.upperCase2 &&
            this.addedFoodSize === this.neededFoodSize &&
            this.addedFoodSizeNumber === this.neededFoodSizeNumber) {
          this.finalResult = this.neededFoodQuantity - (this.finalResult + this.addedFoodQuantity);
          break;
          } else {
            nonExistantNeededFood = nonExistantNeededFood + 1;
          }
        if (this.j === (this.event.foodNeeded.length - 1) && nonExistantNeededFood === this.j + 1) {
          this.finalResult = 0 - this.addedFoodQuantity;
          return;
        }
      }
    }
  }

  nonBroughtNeededFood(index) {
    this.duplication = false;
    let nonExistantBroughtFood = 0;
    if  ( this.event.foodAdded.length === 0) {
      this.neededFoodName = ((this.detailForm.get('foodNeeded') as FormArray).controls[index].get('foodName') as FormArray).value;
      this.neededFoodQuantity = ((this.detailForm.get('foodNeeded') as FormArray).controls[index].get('foodQuantity') as FormArray).value;
      this.neededFoodSizeNumber = ((this.detailForm.get('foodNeeded') as FormArray).controls[index].get('foodSizeNumber') as FormArray).value;
      this.neededFoodSize = ((this.detailForm.get('foodNeeded') as FormArray).controls[index].get('foodSize') as FormArray).value;
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.event.foodAdded.length; i++ ) {
      this.neededFoodName = ((this.detailForm.get('foodNeeded') as FormArray).controls[index].get('foodName') as FormArray).value;
      this.upperCase = this.neededFoodName.toUpperCase();
      this.neededFoodSizeNumber = ((this.detailForm.get('foodNeeded') as FormArray).controls[index].get('foodSizeNumber') as FormArray).value;
      this.neededFoodSize = ((this.detailForm.get('foodNeeded') as FormArray).controls[index].get('foodSize') as FormArray).value;
      this.neededFoodQuantity = ((this.detailForm.get('foodNeeded') as FormArray).controls[index].get('foodQuantity') as FormArray).value;
      this.addedFoodName = ((this.detailForm.get('foodAdded') as FormArray).controls[i].get('foodName') as FormArray).value;
      this.upperCase2 = this.addedFoodName.toUpperCase();
      this.addedFoodSizeNumber = ((this.detailForm.get('foodAdded') as FormArray).controls[i].get('foodSizeNumber') as FormArray).value;
      this.addedFoodSize = ((this.detailForm.get('foodAdded') as FormArray).controls[i].get('foodSize') as FormArray).value;
      this.addedFoodQuantity = ((this.detailForm.get('foodAdded') as FormArray).controls[i].get('foodQuantity') as FormArray).value;
      if (this.upperCase === this.upperCase2 &&
          this.neededFoodSize === this.addedFoodSize &&
          this.neededFoodSizeNumber === this.addedFoodSizeNumber) {
            this.duplication = true;
            return null;
          } else {
            nonExistantBroughtFood = nonExistantBroughtFood + 1;
          }
      if (i === (this.event.foodAdded.length - 1) && nonExistantBroughtFood === i + 1) {
        return;
      }
    }
  }

/////////////////////////////// OBJECT ///////////////////////////////
  objectRealtimeNeed(index) {
    this.duplication = false;
    for (this.i = 0; this.i < index; this.i++) {
      this.addedObjectName = ((this.detailForm.get('objectAdded') as FormArray).controls[index].get('objectName') as FormArray).value;
      this.addedObjectName2 = ((this.detailForm.get('objectAdded') as FormArray).controls[this.i].get('objectName') as FormArray).value;
      // this.addedObjectSizeNumber = ((this.detailForm.get('objectNeeded') as FormArray).controls[index].get('objectSizeNumber') as FormArray).value;
      // this.addedObjectSize = ((this.detailForm.get('objectNeeded') as FormArray).controls[index].get('objectSize') as FormArray).value;
      // this.addedObjectSizeNumber2 = ((this.detailForm.get('objectNeeded') as FormArray).controls[this.i].get('objectSizeNumber') as FormArray).value;
      // this.addedObjectSize2 = ((this.detailForm.get('objectNeeded') as FormArray).controls[this.i].get('objectSize') as FormArray).value;
      this.upperCase = this.addedObjectName.toUpperCase();
      this.upperCase2 = this.addedObjectName2.toUpperCase();
      if (this.upperCase === this.upperCase2
          // this.addedObjectSizeNumber === this.addedObjectSizeNumber2 &&
          // this.addedObjectSize === this.addedObjectSize2
          ) {
        this.duplication = true;
        return null;
      }
    }

    if (!this.duplication) {
      this.finalResult = 0;
      for (this.i = index + 1; this.i < this.event.objectAdded.length; this.i++) {
        this.addedObjectName = ((this.detailForm.get('objectAdded') as FormArray).controls[index].get('objectName') as FormArray).value;
        this.upperCase = this.addedObjectName.toUpperCase();
        // this.addedObjectSizeNumber = ((this.detailForm.get('objectNeeded') as FormArray).controls[index].get('objectSizeNumber') as FormArray).value;
        // this.addedObjectSize = ((this.detailForm.get('objectNeeded') as FormArray).controls[index].get('objectSize') as FormArray).value;
        this.addedObjectName2 = ((this.detailForm.get('objectAdded') as FormArray).controls[this.i].get('objectName') as FormArray).value;
        this.upperCase2 = this.addedObjectName2.toUpperCase();
        this.addedObjectQuantity2 = ((this.detailForm.get('objectAdded') as FormArray).controls[this.i].get('objectQuantity') as FormArray).value;
        // this.addedObjectSizeNumber2 = ((this.detailForm.get('objectNeeded') as FormArray).controls[this.i].get('objectSizeNumber') as FormArray).value;
        // this.addedObjectSize2 = ((this.detailForm.get('objectNeeded') as FormArray).controls[this.i].get('objectSize') as FormArray).value;
        if (  this.upperCase === this.upperCase2
              // this.addedObjectSizeNumber === this.addedObjectSizeNumber2 &&
              // this.addedObjectSize === this.addedObjectSize2
            ) {
          this.finalResult = this.addedObjectQuantity2 + this.finalResult || 0;

          return;
        }
      }

      let nonExistantNeededObject = 0;
      for (this.j = index - index; this.j < this.event.objectNeeded.length; this.j++) {
        this.addedObjectName = ((this.detailForm.get('objectAdded') as FormArray).controls[index].get('objectName') as FormArray).value;
        this.upperCase = this.addedObjectName.toUpperCase();
        // this.addedObjectSizeNumber = ((this.detailForm.get('objectNeeded') as FormArray).controls[index].get('objectSizeNumber') as FormArray).value;
        // this.addedObjectSize = ((this.detailForm.get('objectNeeded') as FormArray).controls[index].get('objectSize') as FormArray).value;
        this.addedObjectQuantity = ((this.detailForm.get('objectAdded') as FormArray).controls[index].get('objectQuantity') as FormArray).value;
        this.neededObjectName = ((this.detailForm.get('objectNeeded') as FormArray).controls[this.j].get('objectName') as FormArray).value;
        this.upperCase2 = this.neededObjectName.toUpperCase();
        // this.neededObjectSizeNumber = ((this.detailForm.get('objectNeeded') as FormArray).controls[this.j].get('objectSizeNumber') as FormArray).value;
        // this.neededObjectSize = ((this.detailForm.get('objectNeeded') as FormArray).controls[this.j].get('objectSize') as FormArray).value;
        this.neededObjectQuantity = ((this.detailForm.get('objectNeeded') as FormArray).controls[this.j].get('objectQuantity') as FormArray).value;
        if (this.upperCase === this.upperCase2
            // this.addedObjectSize === this.neededObjectSize &&
            // this.addedObjectSizeNumber === this.neededObjectSizeNumber
            ) {
          this.finalResult = this.neededObjectQuantity - (this.finalResult + this.addedObjectQuantity);

          break;
          } else {
            nonExistantNeededObject = nonExistantNeededObject + 1;
          }
        if (this.j === (this.event.objectNeeded.length - 1) && nonExistantNeededObject === this.j + 1) {
          this.finalResult = 0 - this.addedObjectQuantity;

          return;
        }
      }
    }
  }

  nonBroughtNeededObject(index) {
    this.duplication = false;
    let nonExistantBroughtObject = 0;
    if  ( this.event.objectAdded.length === 0) {
      this.neededObjectName = ((this.detailForm.get('objectNeeded') as FormArray).controls[index].get('objectName') as FormArray).value;
      this.neededObjectQuantity = ((this.detailForm.get('objectNeeded') as FormArray).controls[index].get('objectQuantity') as FormArray).value;
      // this.neededObjectSizeNumber = ((this.detailForm.get('objectNeeded') as FormArray).controls[index].get('objectSizeNumber') as FormArray).value;
      // this.neededObjectSize = ((this.detailForm.get('objectNeeded') as FormArray).controls[index].get('objectSize') as FormArray).value;
    }
    for (let i = 0; i < this.event.objectAdded.length; i++ ) {
      this.neededObjectName = ((this.detailForm.get('objectNeeded') as FormArray).controls[index].get('objectName') as FormArray).value;
      this.upperCase = this.neededObjectName.toUpperCase();
      // this.neededObjectSizeNumber = ((this.detailForm.get('objectNeeded') as FormArray).controls[index].get('objectSizeNumber') as FormArray).value;
      // this.neededObjectSize = ((this.detailForm.get('objectNeeded') as FormArray).controls[index].get('objectSize') as FormArray).value;
      this.neededObjectQuantity = ((this.detailForm.get('objectNeeded') as FormArray).controls[index].get('objectQuantity') as FormArray).value;
      this.addedObjectName = ((this.detailForm.get('objectAdded') as FormArray).controls[i].get('objectName') as FormArray).value;
      this.upperCase2 = this.addedObjectName.toUpperCase();
      // this.addedObjectSizeNumber = ((this.detailForm.get('objectNeeded') as FormArray).controls[i].get('objectSizeNumber') as FormArray).value;
      // this.addedObjectSize = ((this.detailForm.get('objectNeeded') as FormArray).controls[i].get('objectSize') as FormArray).value;
      this.addedObjectQuantity = ((this.detailForm.get('objectAdded') as FormArray).controls[i].get('objectQuantity') as FormArray).value;
      if (this.upperCase === this.upperCase2
          // this.neededObjectSize === this.addedObjectSize &&
          // this.neededObjectSizeNumber === this.addedObjectSizeNumber
          ) {
            this.duplication = true;
            return null;
          } else {
            nonExistantBroughtObject = nonExistantBroughtObject + 1;
          }
      if (i === (this.event.objectAdded.length - 1) && nonExistantBroughtObject === i + 1) {
        return;
      }
    }
  }

}
