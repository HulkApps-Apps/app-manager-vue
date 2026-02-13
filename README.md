# App Manager Vue SDK

[//]: # (This is where your description should go. Try and limit it to a paragraph or two, and maybe throw in a mention of what PSRs you support to avoid any confusion with users and contributors.)

> Note about translations
>
> This package does not manage, store, or ship translations itself — it only uses the translation data you provide when rendering components (for example via the `translations` prop). Always pass the correct translations for the language/context you need. The package will not automatically translate or fetch missing keys for you.
>
> Here is the list of all translation keys used in this package — when upgrading the package, make sure any new or missing keys are added to your translations and passed into the components via the `translations` prop.

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
<Banners type="header" @handleBannerClose="handleBannerClose" :translations="translations"/>
<Banners type="footer" @handleBannerClose="handleBannerClose" :translations="translations"/>
<AppManagerPlan @handlePlanSelect="handlePlanSelectListener" @handlePlanBannerClose="handleBannerClose" :shop_domain="shop_domain" :translations="translations"/>
<AppManagerSliderPlan @handlePlanSelect="handlePlanSelectListener" @handlePlanBannerClose="handleBannerClose" :shop_domain="shop_domain" :translations="translations"/>
```

## AppManagerPlan Props

Here is a basic explanation of all the props for the `<AppManagerPlan>` component:

| Prop Name      | Type    | Default   | Description                                                                 |
|--------------- |---------|-----------|-----------------------------------------------------------------------------|
| shop_domain    | String  | —         | The domain of the Shopify store. Required to fetch and display plans.       |
| base_url       | String  | null      | The base URL for API requests. Used to configure backend communication.     |
| host           | String  | null      | Shopify host parameter, used for embedded app context.                      |
| discount_code  | String  | null      | Discount code to apply to plans, if available.                              |
| is_customizable| Boolean | false     | Allows the user to customize their plan if set to true.                     |
| width          | String  | 'base'    | Controls the layout width of the component. Accepted values: 'tight' (max-width: 840px), 'base' (max-width: 1190px, default), 'loose' (max-width: 1600px). |
| translations   | Object  | { hulkapps: 'hulkapps' } | Object for customizing translation strings.           |
| enable_feature_tooltip | Boolean | false | If true, shows the feature description as a tooltip for plan features (tap to show/hide on mobile). Tooltip is only shown if the feature has a description. |

You can use these props to control the appearance, context, and behavior of the `<AppManagerPlan>` component to fit your app's needs.

#### Non-Vue App usage

```html
<script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@hulkapps/app-manager-vue@2.0.3/dist/app-manager-vue.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/regenerator-runtime@0.13.9/runtime.min.js"></script>
<link href="https://cdn.jsdelivr.net/npm/@hulkapps/app-manager-vue@2.0.3/dist/hulkapps-app-manager.css" rel="stylesheet">

<div id="app" class="app-manager">
    <Banners type="header"  @handleBannerClose="handleBannerClose"/>
    <app-manager-plan  @handle-plan-select="handlePlanSelectListener" @handlePlanBannerClose="handleBannerClose" :translations="translations" shop_domain="<%= @store.shopify_domain %>" />
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
    
 if (payload.free_plan && payload.free_plan === true) {
         //handle free_plan selection
       }
}
```


A `handleBannerClose` event is emitted when the user closed banner.

```javascript
handleBannerClose(payload) {

    //handle close event
}
```

## Translation Keys

This package does not manage, store, or generate translations. It strictly renders the translation data supplied to it. Components expect a complete translation object to be provided via the `translations` prop. The package does not perform automatic localization or resolve missing translation keys.

The [complete list of predefined translation keys](https://docs.google.com/spreadsheets/d/1oO6UE07fPexHEauxMN0VE9ZiYU-GOctlSJf0-B5z2GY) referenced by this package is available here. The list includes only the static keys used internally by the components and does not cover dynamic or app-specific content such as plan names, feature labels, trial durations, pricing text, or plan descriptions. Those values should also be provided through the same `translations` prop, alongside the predefined keys, to ensure correct rendering.
## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.