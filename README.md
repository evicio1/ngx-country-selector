# ngx-country-selector

A modern, feature-rich Angular country selector component built with **Angular Material**. This library provides a beautiful, accessible, and highly customizable dropdown for selecting countries with support for flags, country codes, local names, and more.

## ✨ Features

- 🎨 **Built with Angular Material** - Leverages Material Design components for consistent UI/UX
- 🏳️ **Country Flags** - Visual flag representations for all countries
- 🌍 **Comprehensive Country Data** - Includes country codes, local names, capitals, currencies, and languages
- 🔍 **Search & Filter** - Built-in search functionality with autocomplete
- ⚡ **Performance Optimized** - Supports zoneless change detection for better performance
- 🎯 **Highly Customizable** - Extensive configuration options for appearance and behavior
- ♿ **Accessible** - Full accessibility support with ARIA attributes
- 📱 **Responsive** - Works seamlessly across all device sizes
- 🔧 **Angular 20 Ready** - Compatible with the latest Angular version

## 🛠️ Built With

- **Angular 20+** - Modern Angular framework
- **Angular Material 20+** - Material Design components (mat-form-field, mat-autocomplete, mat-input, mat-icon, mat-progress-bar, mat-divider)
- **TypeScript** - Type-safe development experience
- **SCSS** - Styled with modern CSS preprocessor

*Note: Angular CDK is included as a peer dependency of Angular Material but is not directly used by this library.*

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 20.3.2.

## 📋 Prerequisites

This library requires **Angular Material** to be installed in your project, as it uses Material Design components like `mat-form-field`, `mat-autocomplete`, and `mat-input`.

If you don't have Angular Material installed:

```bash
ng add @angular/material
```

## 🚀 Getting started

1. Once your Angular application setup is ready, install the ngx-country-selector library using the following command:

```bash
npm i ngx-country-selector
```

2. Add the CSS
   Either import the CSS directly to styles.scss file

   ```
   @import  "node_modules/ngx-country-selector/assets/styles.css";
   ```

   Or, add CSS file in angular.json in the styles array in the build section

   ```
    "styles": [
              "node_modules/ngx-country-selector/assets/styles.css",
              "src/styles.scss"
            ],
   ```

3. Import CountrySelectorLibraryComponent
   import CountrySelectorLibraryComponent in module where you want to add the countries dropdown, it may be app-module, some lazy loaded module or a standalone component
   ```
     imports: [
    CountrySelectorLibraryComponent
    ],
   ```
4. Add the country component to the component where is being used

```html
<lib-country-selector></lib-country-selector>
```

### Properties and their usage

####The below table explains what all Input properties country dropdown accepts and their usage

<table role="table">
 <tbody><tr>
  <td>Property</td>
  <td>Type and default values</td>
  <td>Description</td>
 </tr>
 <tr>
  <td><b>preferredCountryCodes</b></td>
  <td>Type: string array(string[]),Default value: []</td>
  <td>the list of country codes which needs to be displayed on top section. ex. if user provided ['in', 'us'], India and United States will be displayed on top</td>
 </tr>
 <tr>
  <td><b>blockedCountryCodes</b></td>
  <td>Type: string array(string[]),Default value: []</td>
  <td>an array of country codes which are not required in the list. Ex. if some client is not servicing some specific countries can be removed from the country dropdown using this.  </td>
 </tr>

 <tr>
  <td><b>allowedCountryCodes</b></td>
  <td>Type: string array(string[]),Default value: []</td>
  <td>Only countries which will be displayed in the country list </td>
 </tr>
 <tr>
  <td><b>selectedCountryConfig</b></td>
  <td>Type: <b>IConfig</b> (see table below for IConfig properties), Default value: {}</td>
  <td>Provides config for the selected country, and controls what all will be displayed. Ex. if the user do not want to display flag for the selected item, can be controlled with this property(refer to config table for details)</td>
 </tr>
 <tr>
  <td><b>countryListConfig</b></td>
  <td>Type: <b>IConfig</b> (see table below for IConfig properties), Default value: {}</td>
  <td>Provides config for the country list, and controls what all will be displayed in the country list. Ex. if the user do not want to see flag or dial code or name in the country list, can be controlled with this property(refer to config table for details)</td>
 </tr>
  <tr>
  <td><b>label</b></td>
  <td>Type: <b>string</b> Default value: 'Select country'</td>
  <td>`mat-form-field` label's text</td>
 </tr>
 <tr>
  <td><b>placeholderText</b></td>
  <td>Type: <b>string</b> Default value: 'Select country'</td>
  <td>To change the default placeholder label.</td>
 </tr>
 <tr>
  <td><b>loading</b></td>
  <td>Type: <b>boolean</b> Default value: false</td>
  <td>Whether the component is loading.</td>
 </tr>
<tr>
  <td><b>readonly</b></td>
  <td>Type: <b>boolean</b> Default value: false</td>
  <td>Whether the component is read only.</td>
 </tr>
  <tr>
  <td><b>clearable</b></td>
  <td>Type: <b>boolean</b> Default value: false</td>
  <td>To show clear button.</td>
 </tr>
 <tr>
  <td><b>required</b></td>
  <td>Type: <b>boolean</b> Default value: false</td>
  <td>Whether the component is required. Note: `FormControl` validator need to be setup too</td>
 </tr>
 <tr>
  <td><b>error</b></td>
  <td>Type: <b>string</b> Default value: ''</td>
  <td>To set the error message for required validation.</td>
 </tr>
</tbody></table>

### Events

<table role="table">
 <tbody><tr>
  <td><b>onCountryChange</b> </td>
  <td>Country type <b>ICountry</b> </td>
  <td>returns the selected country</td>
 </tr>

</tbody></table>

### Reactive forms

```
 loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required),
      country: new FormControl({value: {code:'in'} as ICountry | null, disabled: false},
         Validators.required), // need to send both validator and required input value to make it work
    });
```

```
  <lib-country-selector
  [allowedCountryCodes]="allowedCountryCode()"
  [countryListConfig]="config"
  [selectedCountryConfig]="selectedConfig"
  [loading]="loading()"
  [readonly]="readonly() || loading()"
  label="Country"
  [clearable]="!shouldCountryLocked()"
  [customNaming]="{ gb: 'United Kingdom'}"
  formControlName="country"
  (onCountryChange)="onCountryChange($event)"
  error="Country is required"
  [required]="true"
  ></lib-country-selector>
```

### IConfig properties and usage

Config properties can be used to control what will be displayed in the country list and for the selected country.

Exported interface

```
export interface IConfig {
  hideFlag?: boolean;
  hideCode?: boolean;
  hideName?: boolean;
  showLocalName?: boolean;
  hideSearch?: boolean;
  hideDialCode?: boolean;
  displayCapital?: boolean;
  displayLanguageCode?: boolean;
  displayLanguageName?: boolean;
  displayCurrencyCode?: boolean
  displayCurrencyName?: boolean
  displayCurrencySymbol?: boolean

}
```

<table role="table">
 <tbody><tr>
  <td><b>hideFlag</b> </td>
  <td>Boolean, Default value: false </td>
  <td>to hide flag from country list or selected country</td>
 </tr>
<tr>
  <td><b>hideCode</b> </td>
  <td>Boolean, Default value: false </td>
  <td>to hide country code </td>
 </tr>
<tr>
  <td><b>hideName</b> </td>
  <td>Boolean, Default value: false </td>
  <td>to hide country name </td>
 </tr>
<tr>
  <td><b>showLocalName</b> </td>
  <td>Boolean, Default value: false </td>
  <td>to show local name of the country</td>
 </tr>
<tr>
  <td><b>hideSearch</b> </td>
  <td>Boolean, Default value: false </td>
  <td>to hide search field from country list </td>
 </tr>
     <tr>
  <td><b>hideDialCode</b> </td>
  <td>Boolean, Default value: false </td>
  <td>to hide dial code </td>
 </tr>
      <tr>
  <td><b>displayCapital</b> </td>
  <td>Boolean, Default value: false </td>
  <td>to display country capital </td>
 </tr>
  <tr>
  <td><b>displayLanguageCode</b> </td>
  <td>Boolean, Default value: false </td>
  <td>to display country language code </td>
 </tr>
   <tr>
  <td><b>displayLanguageName</b> </td>
  <td>Boolean, Default value: false </td>
  <td>to display country language name </td>
 </tr>
  <tr>
  <td><b>displayCurrencyCode</b> </td>
  <td>Boolean, Default value: false </td>
  <td>to display country currency code </td>
 </tr>
  <tr>
  <td><b>displayCurrencyName</b> </td>
  <td>Boolean, Default value: false </td>
  <td>to display country currency name </td>
 </tr>
  <tr>
  <td><b>displayCurrencySymbol</b> </td>
  <td>Boolean, Default value: false </td>
  <td>to display country currency symbol </td>
 </tr>
</tbody></table>

### Output on country selection

On country selection output of ICountry type will be emitted.
Handle country change event

```
<lib-country-selector (onCountryChange)="onCountryChange($event)"></lib-country-selector>
```

```
  onCountryChange(country: ICountry){
    console.log(country);
  }
```

output in console

```
{
    name: 'Afghanistan',
    localName: '‫افغانستان‬‎',
    code: 'AF',
    capital: 'Kabul',
    region: 'AS',
    currency: {
      code: 'AFN',
      name: 'Afghan afghani',
      symbol: '؋',
    },
    language: {
      code: 'ps',
      name: 'Pashto',
    },
    dialling_code: '+93',
    isoCode: '004',
  },
```

### exported ICountry interface

```
export interface ICountry {
  name?: string;
  localName?: string;
  code?: string;
  capital?: string;
  region?: string;
  currency?: ICurrency
  language?: ILanguage
  dialling_code?: string;
  isoCode?: string;
  demonym?: string;
}

export interface ICurrency {
  code?: string | null;
  name?: string;
  symbol?: string | null;
}

export interface ILanguage {
    code?: string;
    name?: string;
    iso639_2?: string,
    nativeName?: string
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE.txt) file for details.

## Acknowledgment

This project includes code and concepts inspired by the following:

1. [angular-material-extensions/select-country](https://github.com/angular-material-extensions/select-country) by [Anthony Nahas](https://github.com/AnthonyNahas), licensed under the MIT License.
2. [ngx-countries-dropdown](https://github.com/kapilkumar0037/ngx-countries-dropdown) by [Kapil Kumar](https://github.com/kapilkumar0037), licensed under the MIT License.
