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
<AppManagerPlan @handlePlanSelect="handlePlanSelectListener" :shop_domain="shop_domain" />
<AppManagerSliderPlan @handlePlanSelect="handlePlanSelectListener" :shop_domain="shop_domain" />
```
The AppManagerPlan component requires a Shop Domain

#### Non-Vue App usage

```html
<script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@hulkapps/app-manager-vue@2.0.3/dist/app-manager-vue.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/regenerator-runtime@0.13.9/runtime.min.js"></script>
<link href="https://cdn.jsdelivr.net/npm/@hulkapps/app-manager-vue@2.0.3/dist/hulkapps-app-manager.css" rel="stylesheet">

<div id="app" class="app-manager">
    <Banners type="header"  />
    <app-manager-plan shop_domain="<%= @store.shopify_domain %>" />
</div>

<script>
    Vue.use(AppManagerVue, {baseUrl: '<%= ENV['volume_domain'] %>'})
    var app = new Vue({
        el: '#app',
        data: {
            message: 'Hello Vue!',
            domain: '<%= @store.shopify_domain %>'
        }
    })
</script>
```

A `handlePlanSelect` event is emitted when the user continues without selecting a plan.

```javascript
handlePlanSelectListener(payload) {

  if (payload.choose_later && payload.choose_later === true) {
    //handle choose_later
  }

}
```

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.