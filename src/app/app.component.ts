import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sidebarState = 'collapsed'
  title = 'app works!';

  toggleSidebar(): void {
    if(this.sidebarState == 'collapsed')
      this.sidebarState = 'expanded';
    else
      this.sidebarState = 'collapsed';
  }
}
