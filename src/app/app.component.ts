import { Component, signal } from '@angular/core';
import { CountrySelectorLibraryComponent } from "../../projects/country-selector-library/src/lib/country-selector-library.component";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { IConfig } from 'country-selector-library';
import { ICountry } from '../../projects/country-selector-library/src/public-api';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CountrySelectorLibraryComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'country-selector';
  loginForm!: FormGroup;

  config : IConfig = {
    hideName: false,
    showLocalName: true
  };
  selectedConfig : IConfig = {
    hideName: false,
    showLocalName: false
  };

  //Nordic countries, Germany, Austria, UK, Austria, Switzerland
  allowedCountryCode: string[] = ['de', 'at', 'gb', 'dk', 'fi', 'is', 'no', 'se', 'ch'];
  selectedCountry = signal<ICountry | null> (null);

  onCountryChange(country: ICountry | null) {
    this.selectedCountry.set(country);
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required),
      country: new FormControl({value: {code:'in'} as ICountry | null, disabled: false},
         Validators.required), // need to send both validator and required input value to make it work
    });
  }

  onSubmit = () => {
    const login = this.loginForm.value;
  }

  validateControl = (controlName: string) => {
    return this.loginForm.get(controlName)!.invalid && this.loginForm.get(controlName)!.touched
  }

  hasError = (controlName: string, errorName: string) => {
    return this.loginForm.get(controlName)!.hasError(errorName)
  }

}
