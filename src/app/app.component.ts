import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NumberToWordsComponent } from "./number-to-words/number-to-words.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, NumberToWordsComponent]
})
export class AppComponent {
  title = 'CurrencyConversion';
}
