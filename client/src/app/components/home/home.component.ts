import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  mobileQuery: MediaQueryList;
  public activeLink: string = '';

  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);

  private _mobileQueryListener: () => void;

  constructor(
    private auth: AuthService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 170px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  logout() {
    this.auth.logout();
  }
  name() {
    //console.log(this.auth.getUserName());
    const name = this.auth.getUserNameValue().toString();
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
}
