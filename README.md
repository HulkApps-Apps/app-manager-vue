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
| full_width     | Boolean | false     | If true, stretches the component to the full width of its container.        |
| narrow_width   | Boolean | false     | If true, uses a narrower, more compact width.                               |
| translations   | Object  | { hulkapps: 'hulkapps' } | Object for customizing translation strings.           |

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

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.