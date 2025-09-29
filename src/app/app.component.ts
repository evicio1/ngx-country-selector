import { Component, input, signal, effect, OnInit } from '@angular/core';
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
    imports: [CountrySelectorLibraryComponent,
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
  shouldCountryLocked  = input<boolean>(false);

  config : IConfig = {
    hideName: false,
    showLocalName: true
  };
  selectedConfig : IConfig = {
    hideName: false,
    showLocalName: false
  };

  //Nordic countries, Germany, Austria, UK, Austria, Switzerland
  allowedCountryCode = signal<string[]>([]);
  selectedCountry = signal<ICountry | null> (null);
  loading = signal<boolean>(true);
  readonly = signal<boolean>(false);


  onCountryChange(country: ICountry | null) {
    this.selectedCountry.set(country);
    // In zoneless mode, we just need to update the form control value
    // Angular will automatically detect the change through signals
    const countryControl = this.loginForm.get('country');
    if (countryControl) {
      countryControl.setValue(country);
      countryControl.markAsTouched();
    }
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required),
      country: new FormControl(null, Validators.required), // Initialize with null and let the component handle the default
    });

    //loadCountries after 10 seconds of page shows
    setTimeout(() => {
      this.loadCountries();
    }, 10000);

  }

  // this should call after 2 seconds of page load
  loadCountries = () => {
    this.allowedCountryCode.set(['de', 'at', 'gb', 'dk', 'fi', 'is', 'no', 'se', 'ch']);
    this.loading.set(false);
  }

  onSubmit = () => {
    
    
    
    
    
    
    // Check each control
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      
    });
    
    if(this.loginForm.invalid) {
      alert('Please fill all the required fields');
      return;
    }
    const login = this.loginForm.value;
    alert('Form submitted successfully: ' + JSON.stringify(login));
  }

  validateControl = (controlName: string) => {
    return this.loginForm.get(controlName)!.invalid && this.loginForm.get(controlName)!.touched
  }

  hasError = (controlName: string, errorName: string) => {
    return this.loginForm.get(controlName)!.hasError(errorName)
  }

}
