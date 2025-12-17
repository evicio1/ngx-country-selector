import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import type { IConfig, ICountry } from './models';
import {
  getAllowedCountries,
  getCountriesBasedOnSearch,
  getFilteredCountries,
  getPreferredCountries,
} from './country.helper';

import {
  FormValueControl,
  type DisabledReason,
  type ValidationError,
  type WithOptionalField,
} from '@angular/forms/signals';

import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-country-selector',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './country-selector-library.component.html',
  styleUrl: './country-selector-library.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountrySelectorLibraryComponent
  implements FormValueControl<ICountry | null>
{
  // ---- Your existing config inputs (kept) ----
  readonly label = input('');
  readonly appearance = input<'fill' | 'outline'>('outline');
  readonly extendWidth = input(false);
  readonly class = input<string>('');
  readonly placeHolder = input('Select country');
  readonly tabIndex = input<number>(0);
  readonly name = input<string>('country');
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
  readonly customNaming = input<{ [key: string]: string }>({});

  // Keep this as *UI* readonly flag (we'll merge it with form readonly)
  readonly uiReadonly = input(false);

  readonly onCountryChange = output<ICountry | null>();

  // ---- Signal Forms control contract (required) ----
  // This is what [field] binds to.
  value = model<ICountry | null>(null);

  // ---- Optional state/constraint signals that [field] can supply ---- :contentReference[oaicite:1]{index=1}
  touched = model(false);

  disabled = input(false);
  disabledReasons = input<readonly WithOptionalField<DisabledReason>[]>([]);
  readonly = input(false);
  hidden = input(false);

  required = input(false); // comes from schema (required(...))
  invalid = input(false);
  errors = input<readonly WithOptionalField<ValidationError>[]>([]);

  // ---- Internal UI state ----
  readonly searchText = model('');      // user typed text
  readonly displayText = model('');     // what is shown in the input

  // ---- Lists ----
  readonly countryList = computed(() =>
    getAllowedCountries(this.allowedCountryCodes(), this.customNaming())
  );

  readonly countriesExpectBlocked = computed(() =>
    getFilteredCountries(this.countryList(), this.blockedCountryCodes())
  );

  readonly standardCountries = computed(() =>
    getFilteredCountries(this.countriesExpectBlocked(), this.preferredCountryCodes())
  );

  readonly filteredCountries = computed(() =>
    getCountriesBasedOnSearch(this.standardCountries(), this.searchText())
  );

  readonly preferredCountryList = computed(() => {
    const result = getPreferredCountries(
      this.countriesExpectBlocked(),
      this.preferredCountryCodes()
    );
    return getCountriesBasedOnSearch(result, this.searchText());
  });

  readonly combinedCountryList = computed(() => ({
    preferred: this.preferredCountryList(),
    nonPreferred: this.filteredCountries(),
  }));

  // A single "effective" readonly for the template
  readonly effectiveReadonly = computed(() => this.uiReadonly() || this.readonly());

  constructor() {
    // Keep the input text in sync when value changes externally (model updates / resets)
    effect(() => {
      const country = this.value();

      if (!country) {
        this.displayText.set('');
        this.searchText.set('');
        return;
      }

      const showLocal = !!this.selectedCountryConfig().showLocalName && !!country.localName;
      const txt = showLocal ? `${country.name} (${country.localName})` : (country.name ?? '');
      this.displayText.set(txt);
      this.searchText.set(txt);
    });
  }

  onTextInput(raw: string) {
    this.displayText.set(raw);
    this.searchText.set(raw);
  }

  onBlur() {
    this.touched.set(true);
  }

  onCountrySelected($event: MatAutocompleteSelectedEvent) {
    const selected = ($event.option.value as ICountry) ?? null;
    this.value.set(selected);
    this.touched.set(true);
    this.onCountryChange.emit(selected);
  }

  clear() {
    this.value.set(null);
    this.touched.set(true);
    this.displayText.set('');
    this.searchText.set('');
    this.onCountryChange.emit(null);
  }

  // (Optional) if your mat-autocomplete displayWith needs it:
  displayWith = (country: ICountry | null) => {
    if (!country) return '';
    const showLocal = !!this.selectedCountryConfig().showLocalName && !!country.localName;
    return showLocal ? `${country.name} (${country.localName})` : (country.name ?? '');
  };
}
