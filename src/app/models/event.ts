import { Time } from '@angular/common';

export interface Event {
  owner: string;
  name: string;
  date: string;
  time: Time;
  address: string;
  description: string;
  drinkNeeded: [];
  drinkAdded: [];
  foodNeeded: [];
  foodAdded: [];
  objectNeeded: [];
  objectAdded: [];
  access: [];
}
