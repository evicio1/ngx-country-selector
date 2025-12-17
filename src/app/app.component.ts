import { Component, input, signal } from '@angular/core';
import { CountrySelectorLibraryComponent } from '../../projects/country-selector-library/src/lib/country-selector-library.component';

import { form, Field, required } from '@angular/forms/signals';

import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { IConfig } from 'country-selector-library';
import { ICountry } from '../../projects/country-selector-library/src/public-api';

type LoginModel = {
  username: string;
  password: string;
  country: ICountry | null;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CountrySelectorLibraryComponent,

    // Signal forms directive
    Field,

    // Material + forms
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'country-selector';

  shouldCountryLocked = input<boolean>(false);

  config: IConfig = {
    hideName: false,
    showLocalName: true,
  };

  selectedConfig: IConfig = {
    hideName: false,
    showLocalName: false,
  };

  allowedCountryCode = signal<string[]>([]);
  selectedCountry = signal<ICountry | null>(null);
  loading = signal<boolean>(true);
  readonly = signal<boolean>(false);

  // ✅ model stored as a signal
  vm = signal<LoginModel>({
    username: '',
    password: '',
    country: null,
  });

  // ✅ Signal Form schema
  loginForm = form(this.vm, (p) => {
    required(p.username, { message: 'username is required' });
    required(p.password, { message: 'Password is required' });
    required(p.country, { message: 'Country is required' });
  });

  // keep this if you still want your extra event handler
  onCountryChange(country: ICountry | null) {
    this.selectedCountry.set(country);
    // no manual setValue needed — [field] handles it
  }

  ngOnInit(): void {
    setTimeout(() => this.loadCountries(), 10000);
  }

  loadCountries = () => {
    this.allowedCountryCode.set(['de', 'at', 'gb', 'dk', 'fi', 'is', 'no', 'se', 'ch']);
    this.loading.set(false);
  };

  onSubmit = () => {
    // Signal Forms: fields using [field] directive manage their own touched state
    // Just check if form is valid by checking the values
    const data = this.vm();
    
    if (!data.username || !data.password || !data.country) {
      alert('Please fill all the required fields');
      return;
    }

    // Form is valid, submit
    alert('Form submitted successfully: ' + JSON.stringify(data));
  };
}
