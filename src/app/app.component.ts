import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
    template: '<flash-messages></flash-messages><router-outlet></router-outlet>'
})
export class AppComponent {
  version = "1.0"
}
