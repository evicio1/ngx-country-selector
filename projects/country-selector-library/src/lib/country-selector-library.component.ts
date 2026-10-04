import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  output,
  untracked,
  viewChild,
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
  type WithOptionalFieldTree,
} from '@angular/forms/signals';

import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'lib-country-selector',
  standalone: true,
  imports: [
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

  // ---- Form control contract (required) ----
  // This is what [formField] binds to. formControl / formControlName bind to it as well.
  value = model<ICountry | null>(null);

  // ---- Optional state/constraint signals that the forms directive can supply ----
  touched = input(false);
  // Tells the forms directive to mark the bound field as touched.
  touch = output<void>();

  // booleanAttribute lets the bare attribute form work too, e.g. <lib-country-selector readonly>
  disabled = input(false, { transform: booleanAttribute });
  disabledReasons = input<readonly WithOptionalFieldTree<DisabledReason>[]>([]);
  readonly = input(false, { transform: booleanAttribute });
  hidden = input(false);

  // comes from schema (required(...)) or Validators.required
  required = input(false, { transform: booleanAttribute });
  invalid = input(false);
  errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);

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

  // The model may only carry a code (e.g. { code: 'in' }), so look the full country up for display.
  readonly selectedCountry = computed<ICountry | null>(() => {
    const value = this.value();
    if (!value?.code) return null;

    const code = value.code.toLowerCase();
    return this.countriesExpectBlocked().find(x => x.code.toLowerCase() === code) ?? value;
  });

  readonly showError = computed(
    () => this.touched() && (this.invalid() || (this.required() && !this.value()))
  );

  // Schema errors carry their own message; reactive forms errors don't, so fall back to `error`.
  readonly errorMessage = computed(
    () => this.errors().find(e => !!e.message)?.message ?? this.error()
  );

  // The inner matInput has no form control of its own, so it takes its error state from here.
  protected readonly errorStateMatcher: ErrorStateMatcher = {
    isErrorState: () => this.showError(),
  };

  private readonly matInput = viewChild(MatInput);
  private readonly selectedText = computed(() => this.displayWith(this.selectedCountry()));

  constructor() {
    // Keep the input text in sync when value changes externally (model updates / resets)
    effect(() => this.restoreText());

    // matInput only re-checks its error state when it owns a form control, so trigger it ourselves
    effect(() => {
      this.showError();
      const matInput = this.matInput();
      untracked(() => matInput?.updateErrorState());
    });
  }

  onTextInput(raw: string) {
    this.displayText.set(raw);
    this.searchText.set(raw);
  }

  onBlur(panelOpen: boolean) {
    this.touch.emit();

    // With the panel open an option may be mid-click, and re-filtering the list now would lose
    // that click. onPanelClosed() restores the text in that case.
    if (!panelOpen) {
      this.restoreText();
    }
  }

  onPanelClosed() {
    // The panel also closes while typing when nothing matches; leave the text alone then.
    if (!this.matInput()?.focused) {
      this.restoreText();
    }
  }

  onCountrySelected($event: MatAutocompleteSelectedEvent) {
    const selected = ($event.option.value as ICountry) ?? null;
    this.value.set(selected);
    this.touch.emit();
    // Re-picking the current country leaves value unchanged, so the effect won't reset the text.
    this.restoreText();
    this.onCountryChange.emit(selected);
  }

  clear() {
    this.value.set(null);
    this.touch.emit();
    this.displayText.set('');
    this.searchText.set('');
    this.onCountryChange.emit(null);
  }

  // Drops text that was typed without picking an option, so the input matches the value again.
  private restoreText() {
    const txt = this.selectedText();
    this.displayText.set(txt);
    this.searchText.set(txt);
  }

  displayWith = (country: ICountry | null) => {
    if (!country) return '';
    const showLocal = !!this.selectedCountryConfig().showLocalName && !!country.localName;
    return showLocal ? `${country.name} (${country.localName})` : (country.name ?? '');
  };
}
