import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private nameSubject = new BehaviorSubject<string>('USER');
  private loginSubject = new BehaviorSubject<string>('false');

  constructor() { }

  getName(): Observable<string> {
    if (typeof window !== 'undefined' && localStorage) {
      const storedName = localStorage.getItem('Name');
      if (storedName) {
        this.nameSubject.next(storedName);
      }
    }
    return this.nameSubject.asObservable();
  }

  getIsLogged(): Observable<string> {
    if (typeof window !== 'undefined' && localStorage) {
      const storedName = localStorage.getItem('LoggedIn');
      if (storedName) {
        this.loginSubject.next(storedName);
      } 
    }
    return this.loginSubject.asObservable();
  }

  logout() {
    localStorage.clear();
    localStorage.setItem('LoggedIn', 'false');
  }
}
