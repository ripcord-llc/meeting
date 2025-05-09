# Ripcord.io Meeting Widget

Embeddable widget and React component for scheduling meetings with Ripcord.io.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [License](#license)

## Install

### Via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@ripcord.io/meeting"></script>
```

## Usage

### Simple Usage

To get started, instantiate the `Ripcord` class, passing in the ID of the Routing you want to use.

#### Import via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@ripcord.io/meeting"></script>
<script>
  const button = document.getElementById('open-widget');

  const instance = new ripcord.Widget({
    routingId: '<your_routing_id>',
  });

  button.addEventListener('click', () => {
    instance.open();
  });
</script>
```

You also have the option to pass in an element, either as an `HTMLElement` or a query selector string, to open the widget when clicked. This will automatically add a click event listener to the element.

```html
<script src="https://cdn.jsdelivr.net/npm/@ripcord.io/meeting"></script>
<script>
  const instance = new ripcord.Widget({
    routingId: '<your_routing_id>',
    el: '#open-widget',
  });
</script>
```

#### Inline

The `Inline` class allows you to embed the widget directly into your existing page.

```html
<script src="https://cdn.jsdelivr.net/npm/@ripcord.io/meeting"></script>
<script>
  const container = document.getElementById('booking-inline');

  const instance = new ripcord.Inline({
    routingId: '<your_routing_id>',
    el: container,
  });

  instance.initialize();
</script>
```

When used via the CDN, any UTM parameters in the URL will automatically be captured and sent to the Ripcord API.

## API

### Widget

The `Widget` class provides methods to control the lifecycle of an object that can be opened and closed.

#### Constructor

The `Widget` constructor accepts the following parameters:

- **`routingId: string`**
  The UUID of the routing that should be used to determine which team members will be assigned the new deals.

- **`el?: HTMLElement | string`**  
  The element that will open the widget when clicked. If a string is passed in, the element will be found using `querySelector`. If not provided, the widget will be opened when the `open` method is called.

- **`productId?: string`**  
  The UUID of a product you want all new deals to be associated with. This will override the product selection by the routing.

#### Methods

- **`open()`**: Opens the booking modal.

- **`close()`**: Closes the booking modal.

- **`destroy()`**: Destroys the instance, removing all event listeners elements created by the instance. The instance cannot be used after this method is called. Does not remove the element passed in the constructor.

### Inline

The `Inline` class provides methods to control the lifecycle of an object that can be opened and closed.

#### Constructor

The `Inline` constructor accepts the following parameters:

- **`routingId: string`**
  The UUID of the routing that should be used to determine which team members will be assigned the new deals.

- **`el?: HTMLElement | string`**  
  The element that will open the widget when clicked. If a string is passed in, the element will be found using `querySelector`. If not provided, the widget will be opened when the `open` method is called.

- **`productId?: string`**  
  The UUID of a product you want all new deals to be associated with. This will override the product selection by the routing.

#### Methods

- **`initialize()`**: Initializes the widget.

- **`destroy()`**: Destroys the instance, removing all event listeners elements created by the instance. The instance cannot be used after this method is called. Does not remove the element passed in the constructor.

### UTM Parameters

When using the widget via the CDN, any UTM parameters in the URL will automatically be captured and sent to the Ripcord API.

## License [MIT © Ripcord.io, LLC](./LICENSE.md)
