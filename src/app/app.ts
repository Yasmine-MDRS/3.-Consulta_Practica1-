import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  mostrarNavbar = true;

constructor(private router: Router) {

  this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {

      const ocultar = ['/login', '/register'];

      this.mostrarNavbar =
        !ocultar.includes(this.router.url);
    });
}
}
