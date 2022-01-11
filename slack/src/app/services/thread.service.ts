import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {

  opened: boolean = true;

  constructor() { }
}
