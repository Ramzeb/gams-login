import { MediaMatcher } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  accessibleModules$!: Observable<string[]>;
  mobileQuery: MediaQueryList;
  public activeLink: string = '';

  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);

  private _mobileQueryListener: () => void;
  showDropdown: boolean = false;
  constructor(
    private authService: AuthService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 170px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.accessibleModules$ = this.authService.getAccessibleModules();
    // Para ver el valor REAL emitido
    this.accessibleModules$.subscribe((mods) => {
      console.log('Módulos accesibles:', mods);
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  logout() {
    this.authService.logout();
  }
  name() {
    //console.log(this.authService.getUserName());
    const name = this.authService.getUserNameValue().toString();
    return this.formatName(name);
  }

  formatName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  setActiveLink(link: string): void {
    this.activeLink = link;
  }

  getActiveLink(): string {
    return this.activeLink;
  }

  // Alternar la visibilidad del menú desplegable
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }
}
