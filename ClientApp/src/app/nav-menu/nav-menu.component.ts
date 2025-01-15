import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit, OnDestroy {
  isExpanded = false;
  isAuthenticated = false;
  tokenSubscription:Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.tokenSubscription = this.authService.token$.subscribe(token => {
      this.isAuthenticated = !!token;
    })
  }

  ngOnDestroy(): void {
    this.tokenSubscription.unsubscribe();
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
