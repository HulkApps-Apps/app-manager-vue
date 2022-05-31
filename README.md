# App Manager Vue SDK

[//]: # (This is where your description should go. Try and limit it to a paragraph or two, and maybe throw in a mention of what PSRs you support to avoid any confusion with users and contributors.)

## Installation

You can install the package via npm:

```bash
npm i @hulkapps/app-manager-vue
```

## Register

```vue
import Vue from 'vue';
import AppManager from '@hulkapps/app-manager-vue';

Vue.use(AppManager);
```


## Usage

```vue
<Banners type="header" />
<Banners type="footer" />
<AppManagerPlan :shop_domain="shop_domain" />
```
The AppManagerPlan component requires a Shop Domain

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.