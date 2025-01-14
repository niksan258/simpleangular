import { Component } from '@angular/core';
import { GlobalErrorHandlerService } from './services/global-error-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
  constructor(private globalErrorHandler: GlobalErrorHandlerService) {}
}
