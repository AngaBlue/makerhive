import { isUndefined } from "util";
export class Page {
    name: string;
    route: string;
    component: React.ComponentType<any>;
    exact: boolean;
    authenticated: boolean;
    permissions: number;
    icon: React.ComponentType<any> | null;
    nav: boolean;
  
    constructor(options: {
      name: string;
      route: string;
      component: React.ComponentType<any>;
      exact?: boolean;
      authenticated?: boolean;
      nav?: boolean;
      permissions?: number;
      icon?: React.ComponentType<any>;
    }) {
      this.name = options.name;
      this.route = options.route;
      this.component = options.component;
      this.exact = !isUndefined(options.exact) ? options.exact : true;
      this.authenticated = options.authenticated || false;
      this.nav = options.nav || false;
      this.permissions = !isUndefined(options.permissions)
        ? options.permissions
        : -10;
      this.icon = !isUndefined(options.icon) ? options.icon : null;
    }
  }