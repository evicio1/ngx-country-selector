import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import {
  CountrySelectorLibraryComponent,
  IConfig,
  ICountry,
} from '../../projects/country-selector-library/src/public-api';

type LoginModel = {
  username: string;
  password: string;
  country: ICountry | null;
};

@Component({
  selector: 'app-root',
  imports: [
    CountrySelectorLibraryComponent,

    // Signal forms directives
    FormField,
    FormRoot,

    // Reactive forms (the selector also works with formControl / formControlName)
    ReactiveFormsModule,

    // Material
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'country-selector';

  shouldCountryLocked = signal<boolean>(false);

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
  loginForm = form(
    this.vm,
    (p) => {
      required(p.username, { message: 'username is required' });
      required(p.password, { message: 'Password is required' });
      required(p.country, { message: 'Country is required' });
    },
    {
      // [formRoot] marks every field as touched on submit and only runs `action` when valid
      submission: {
        action: async () => {
          alert('Form submitted successfully: ' + JSON.stringify(this.vm()));
        },
        onInvalid: () => alert('Please fill all the required fields'),
      },
    }
  );

  // ✅ The same selector bound to a classic reactive form
  reactiveForm = new FormGroup({
    country: new FormControl<ICountry | null>(null, Validators.required),
  });

  // keep this if you still want your extra event handler
  onCountryChange(country: ICountry | null) {
    this.selectedCountry.set(country);
    // no manual setValue needed — [formField] handles it
  }

  ngOnInit(): void {
    setTimeout(() => this.loadCountries(), 2000);
  }

  loadCountries = () => {
    this.allowedCountryCode.set(['de', 'at', 'gb', 'dk', 'fi', 'is', 'no', 'se', 'ch']);
    this.loading.set(false);
  };

  onReactiveSubmit = () => {
    if (this.reactiveForm.invalid) {
      this.reactiveForm.markAllAsTouched();
      return;
    }

    alert('Reactive form submitted successfully: ' + JSON.stringify(this.reactiveForm.value));
  };
}
