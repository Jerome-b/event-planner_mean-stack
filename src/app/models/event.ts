import { Time } from '@angular/common';

export interface Event {
  user: string;
  name: string;
  date: string;
  time: Time;
  address: string;
  description: string;
  drink: [];
  food: [];
  object: [];
}
