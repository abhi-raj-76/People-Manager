import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
  };
}

export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  getPeople(): Observable<any[]> {
    console.log('Getting all people from the API...');
    return this.http.get<any[]>(this.apiUrl);
  }

  getPerson(id: number): Observable<any> {
    console.log('Getting person with ID:', id);
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createPerson(person: Person): Observable<any> {
    console.log('Creating new person:', person);
    return this.http.post(this.apiUrl, person);
  }

  updatePerson(person: Person): Observable<any> {
    console.log('Updating person:', person);
    return this.http.put(`${this.apiUrl}/${person.id}`, person);
  }

  deletePerson(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}