import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  AfterViewInit,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { IConfig, ICountry } from './models';
import {
  getAllowedCountries,
  getCountriesBasedOnSearch,
  getFilteredCountries,
  getPreferredCountries,
} from './country.helper';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'lib-country-selector',
    imports: [FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        MatProgressBarModule,
        MatIconModule,
        MatDividerModule
    ],
    templateUrl: './country-selector-library.component.html',
    styleUrl: './country-selector-library.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CountrySelectorLibraryComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            multi: true,
            useExisting: forwardRef(() => CountrySelectorLibraryComponent),
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountrySelectorLibraryComponent implements OnInit, AfterViewInit, ControlValueAccessor, Validator  {
  readonly label = input('');
  readonly appearance = input<"fill" | "outline">("outline");
  readonly extendWidth = input(false);
  readonly class = input<string>('');
  readonly placeHolder = input('Select country');
  readonly readonly = input(false);
  readonly tabIndex = input<number>(0);
  readonly name = input<string>("country");
  readonly required = input<boolean>(false);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string>('');
  readonly loading = input<boolean>(false);
  readonly panelWidth = input<string>('');
  readonly clearable = input<boolean>(false);
  readonly preferredCountryCodes = input<string[]>([]);
  readonly allowedCountryCodes = input<string[]>([]);
  readonly blockedCountryCodes = input<string[]>([]);
  readonly selectedCountryConfig = input<IConfig>({});
  readonly countryListConfig = input<IConfig>({});
  readonly customNaming = input<{ [key: string]: string }>({})

  readonly onCountryChange = output<ICountry | null>();

  private onChange: (value: ICountry | null) => void = () => { };
  onTouched: () => void = () => { };

  readonly disabled = signal(false);
  readonly value = signal<ICountry | null>(null);
  readonly searchText = model('');

  countryCtrl = new FormControl();

  constructor() {
    this.countryCtrl = new FormControl(null);
  }
  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.required()) {
      return null;
    }
    
    const hasValue = this.value() !== null && this.value() !== undefined;
    return hasValue ? null : { required: true };
  }

  writeValue(value: ICountry | null): void {
    if (value) {
      const selectedCountryCode = value.code;
      if (selectedCountryCode) {
        const country = this.countriesExpectBlocked().find(
          x => x.code === selectedCountryCode.toUpperCase()
        );
        if (country) {
          this.setValue(country, false);
        }
      }
    } else {
      this.setValue(null, false);
    }
  }

  protected setValue(value: ICountry | null, emitEvent: boolean) {
    this.setSelectedCountry(value);
    if (emitEvent && this.onChange) {
      this.onChange(value);
      this.onTouched();
    }
  }


  readonly standardCountries = computed(() =>
    getFilteredCountries(
      this.countriesExpectBlocked(),
      this.preferredCountryCodes()
    )
  );

  readonly filteredCountries = computed(() =>
    getCountriesBasedOnSearch(this.standardCountries(), this.searchText())
  );

  readonly countryList = computed(() =>
    getAllowedCountries(this.allowedCountryCodes(), this.customNaming())
  );

  readonly countriesExpectBlocked = computed(() =>
    getFilteredCountries(this.countryList(), this.blockedCountryCodes())
  );

  readonly preferredCountryList = computed(() => {
    const result = getPreferredCountries(
      this.countriesExpectBlocked(),
      this.preferredCountryCodes()
    );
    return getCountriesBasedOnSearch(result, this.searchText());
  });

  readonly combinedCountryList = computed(() => {
    return {
      preferred: this.preferredCountryList(),
      nonPreferred: this.filteredCountries()
    };
  });

  ngOnInit(): void {
    this.countryCtrl.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (value !== null) {
          if (!(typeof value === 'object' && (value as ICountry)?.name !== this.searchText())) {
            this.searchText.set(value);
          }
        }
      })
    ).subscribe();

    if(this.required()){
      this.countryCtrl.setValidators(Validators.required);
    }
  }

  ngAfterViewInit(): void {
    // In zoneless mode, signals will automatically trigger change detection
    // No manual validation state update needed
  }

  registerOnChange(fn: (value: ICountry | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    isDisabled ? this.countryCtrl.disable() : this.countryCtrl.enable();
  }

  onCountrySelected($event: MatAutocompleteSelectedEvent) {
    const selectedCountry = $event.option.value as ICountry ?? null;
    this.setValue(selectedCountry, true);
  }

  private setSelectedCountry(country: ICountry | null) {
    this.value.set(country);
    this.onCountryChange.emit(country);

    if (country !== null) {
      if (this.selectedCountryConfig().showLocalName && !!country.localName) {
        this.countryCtrl.setValue(country.name! + ' (' + country.localName + ')');
      } else {
        this.countryCtrl.setValue(country.name!);
      }
    }
    else{
      this.countryCtrl.setValue(null);
    }
  }

  clear() {
    this.searchText.set('');
    this.value.set(null);
    this.setValue(null, true);
    this.onCountryChange.emit(null);
  }
}

