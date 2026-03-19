import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PersonService, Person, ApiUser } from '../person.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit, OnDestroy {
  
  people: Person[] = [];
  private routerSubscription: any;

  constructor(
    private service: PersonService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPeople();
    
    this.routerSubscription = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url === '/list' || event.urlAfterRedirects === '/list') {
        this.loadPeople();
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadPeople() {
    console.log('Loading people from the service...');
    this.service.getPeople().subscribe(
      (data: any[]) => {
        console.log('Got people from API:', data);
        
        try {
          const localPeople = JSON.parse(localStorage.getItem('localPeople') || '[]');
          const deletedIds = JSON.parse(localStorage.getItem('deletedIds') || '[]');
          
          console.log('Local people:', localPeople);
          console.log('Deleted IDs:', deletedIds);
          
          let apiPeople = data.map(user => ({
            id: user.id,
            firstName: user.name.split(' ')[0] || '',
            lastName: user.name.split(' ')[1] || '',
            email: user.email,
            phone: user.phone,
            address: `${user.address?.street}, ${user.address?.city}`
          })).filter(person => !deletedIds.includes(person.id));

          console.log('API people after filtering:', apiPeople);

          const filteredLocalPeople = localPeople.filter((person: Person) => 
            !deletedIds.includes(person.id)
          );

          console.log('Filtered local people:', filteredLocalPeople);

          this.people = [...apiPeople];
          
          filteredLocalPeople.forEach((localPerson: Person) => {
            const existingIndex = this.people.findIndex(p => p.id === localPerson.id);
            if (existingIndex !== -1) {
              this.people[existingIndex] = localPerson;
            } else {
              this.people.push(localPerson);
            }
          });

          console.log('Final people array:', this.people);
        } catch (error) {
          console.error('Error processing people data:', error);
          this.people = data.map(user => ({
            id: user.id,
            firstName: user.name.split(' ')[0] || '',
            lastName: user.name.split(' ')[1] || '',
            email: user.email,
            phone: user.phone,
            address: `${user.address?.street}, ${user.address?.city}`
          }));
        }
      },
      (error) => {
        console.error('API Error:', error);
        // Fallback to sample data if API fails
        this.people = [
          {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '123-456-7890',
            address: '123 Main St, Anytown'
          },
          {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            phone: '098-765-4321',
            address: '456 Oak Ave, Somewhere'
          }
        ];
        console.log('Using fallback data:', this.people);
      }
    );
  }

  edit(id: number) {
    this.router.navigate(['/edit', id]);
  }

  delete(id: number) {
    if (confirm('Are you sure?')) {
      let localPeople = JSON.parse(localStorage.getItem('localPeople') || '[]');
      localPeople = localPeople.filter((p: Person) => p.id !== id);
      localStorage.setItem('localPeople', JSON.stringify(localPeople));
      
      let deletedIds = JSON.parse(localStorage.getItem('deletedIds') || '[]');
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem('deletedIds', JSON.stringify(deletedIds));
      }
      
      this.people = this.people.filter(p => p.id !== id);
      
      this.service.deletePerson(id).subscribe(() => {
        alert('Deleted successfully');
      }, (error) => {
        console.error('Delete API error:', error);
        alert('Delete failed locally, but item hidden');
      });
    }
  }

  add() {
    this.router.navigate(['/new']);
  }
}