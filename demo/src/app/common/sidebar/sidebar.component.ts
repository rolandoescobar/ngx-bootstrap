import { Component, Inject, Renderer  } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { isBs3, setTheme } from 'ngx-bootstrap/utils';
import { routes } from '../../app.routing';
import { StyleManager } from '../../theme/style-manager';
import { ThemeStorage } from '../../theme/theme-storage';
import { DOCUMENT } from '@angular/platform-browser';

const _bs3Css =
  'assets/css/bootstrap-3.3.7/css/bootstrap.min.css';
const _bs4Css =
  'assets/css/bootstrap-4.0.0-beta/css/bootstrap.min.css';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  public isShown = false;

  public get isBs3(): boolean {
    return isBs3();
  }

  public routes: any = routes;
  public search: any = {};

  currentTheme: 'bs3' | 'bs4';

  public constructor(
    private router: Router,
    public styleManager: StyleManager,
    private _themeStorage: ThemeStorage,
    private renderer: Renderer,
    @Inject(DOCUMENT) private document: any
  ) {
    const currentTheme = this._themeStorage.getStoredTheme();
    if (currentTheme) {
      this.installTheme(currentTheme);
    }

    this.router = router;
    this.routes = this.routes.filter((v: any) => v.path !== '**');

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.toggle(false);
      }
    });
  }

  public toggle(isShown?: boolean): void {
    this.isShown = typeof isShown === 'undefined' ? !this.isShown : isShown;
    if (this.document && this.document.body) {
      this.renderer.setElementClass(
        this.document.body,
        'isOpenMenu',
        this.isShown
      );
      if (this.isShown === false) {
        this.renderer.setElementProperty(this.document.body, 'scrollTop', 0);
      }
    }
  }

  installTheme(theme: 'bs3' | 'bs4') {
    setTheme(theme);
    this.currentTheme = this.isBs3 ? 'bs3' : 'bs4';
    this.styleManager.setStyle('theme', this.isBs3 ? _bs3Css : _bs4Css);

    if (this.currentTheme) {
      this._themeStorage.storeTheme(this.currentTheme);
    }
  }
}
