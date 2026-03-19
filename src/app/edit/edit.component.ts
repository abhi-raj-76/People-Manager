import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService, Person, ApiUser } from '../person.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent implements OnInit {

  person: Person = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  };

  isEdit = false;

  constructor(
    private service: PersonService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Edit component is starting up!');
    
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      console.log('Editing existing person with ID:', id);
      this.isEdit = true;
      this.loadPerson(+id);
    } else {
      console.log('Adding a new person');
      this.isEdit = false;
    }
  }

  loadPerson(id: number) {
    this.service.getPerson(id).subscribe(
      (data: ApiUser) => {
        this.person = {
          id: data.id,
          firstName: data.name.split(' ')[0] || '',
          lastName: data.name.split(' ')[1] || '',
          email: data.email,
          phone: data.phone,
          address: `${data.address?.street}, ${data.address?.city}`
        };
      },
      (error) => {
        console.error(error);
        alert('Failed to load person');
        this.router.navigate(['/list']);
      }
    );
  }

  save() {
    console.log('Saving person:', this.person);
    if (this.isEdit) {
      this.service.updatePerson(this.person).subscribe(
        () => {
          alert('Updated successfully');
          
          let localPeople = JSON.parse(localStorage.getItem('localPeople') || '[]');
          const existingIndex = localPeople.findIndex((p: Person) => p.id === this.person.id);
          
          if (existingIndex !== -1) {
            localPeople[existingIndex] = this.person;
          } else {
            localPeople.push(this.person);
          }
          
          localStorage.setItem('localPeople', JSON.stringify(localPeople));
          
          this.router.navigate(['/list']);
        },
        (error) => {
          console.error(error);
          alert('Update failed');
        }
      );
    } else {
      this.service.createPerson(this.person).subscribe(
        (response) => {
          console.log('Creating new person');
          alert('Created successfully');
          console.log('Create response:', response);
          
          const newPerson = {
            ...this.person,
            id: response.id || Date.now()
          };
          
          let localPeople = JSON.parse(localStorage.getItem('localPeople') || '[]');
          localPeople.push(newPerson);
          localStorage.setItem('localPeople', JSON.stringify(localPeople));
          
          this.router.navigate(['/list']);
        },
        (error) => {
          console.error(error);
          alert('Creation failed');
        }
      );
    }
  }

  cancel() {
    this.router.navigate(['/list']);
  }
}