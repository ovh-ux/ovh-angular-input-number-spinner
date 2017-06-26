# Input Number Spinner

![githubbanner](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![Maintenance](https://img.shields.io/maintenance/yes/2017.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux) [![Build Status](https://travis-ci.org/ovh-ux/ovh-angular-input-number-spinner.svg)](https://travis-ci.org/ovh-ux/ovh-angular-input-number-spinner)

[![NPM](https://nodei.co/npm/ovh-angular-input-number-spinner.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-angular-input-number-spinner/)

## Example

```javascript
angular.module("yourModule", [
    "ovh-angular-input-number-spinner"
]);
```

```html
<form name="foo">
    <input-number-spinner data-ng-model="inputValue"
                        data-input-number-spinner-min="1"
                        data-input-number-spinner-max="200">
    </input-number-spinner>
</form>
```

## Installation

# Installation

## Bower
```
bower install ovh-angular-input-number-spinner --save
```

## NPM
```
npm install ovh-angular-input-number-spinner --save
```

## Get the sources
```bash
git clone https://github.com/ovh-ux/ovh-angular-input-number-spinner.git
cd ovh-angular-input-number-spinner
npm install
bower install
```

You've developed a new cool feature? Fixed an annoying bug? We'd be happy
to hear from you!

Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-input-number-spinner/blob/master/CONTRIBUTING.md)

## Run the tests

```
npm test
```

## Build the documentation

```
grunt ngdocs
```

## Related links

 * Contribute: https://github.com/ovh-ux/ovh-angular-input-number-spinner/CONTRIBUTING.md
 * Report bugs: https://github.com/ovh-ux/ovh-angular-input-number-spinner/issues
 * Get latest version: https://github.com/ovh-ux/ovh-angular-input-number-spinner

## License

See https://github.com/ovh-ux/ovh-angular-input-number-spinner/blob/master/LICENSE
