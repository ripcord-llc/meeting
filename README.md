# Ripcord.io Meeting Widget

Embeddable widget and React component for scheduling meetings with Ripcord.io.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [License](#license)

## Install

### Via [npm](https://npmjs.org/):

```
npm install @ripcord.io/meeting --save
```

### Via [yarn](https://yarnpkg.com/):

```
yarn add @ripcord.io/meeting
```

### Via CDN:

```html
<script src="https://cdn.ripcord.io/booking-widget.js"></script>
```

## Usage

### Simple Usage

To get started, import and instantiate the `Ripcord` class, passing in the ID of the Routing you want to use. The widget will be opened when the element is clicked.

#### Import via ES6

```typescript
import { Ripcord } from '@ripcord.io/meeting';

const button = document.getElementById('open-widget');

const instance = new Ripcord({
  routingId: '<your_routing_id>',
  el: button,
  productId: '<your_product_id>',
});
```

#### Import via CDN

```html
<script src="https://cdn.ripcord.io/booking-widget.js"></script>
<script>
  const button = document.getElementById('open-widget');

  const instance = new Ripcord({
    routingId: '<your_routing_id>',
    el: button,
    productId: '<your_product_id>',
  });
</script>
```

When used via the CDN, any UTM parameters in the URL will automatically be captured and sent to the Ripcord API. This needs to be enabled manually when using ES6 (more below).

## API

### Ripcord

The `Ripcord` class provides methods to control the lifecycle of an object that can be opened and closed.

#### Constructor

The `Ripcord` constructor accepts the following parameters:

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

### BookingWidget Component

The `BookingWidget` is a React component that provides a user interface for making bookings.

#### Props

- **`open: boolean`**  
  Controls the visibility of the `BookingWidget`. When `true`, the widget is displayed; when `false`, the widget is hidden.

- **`onClose: function`**  
  A callback function that is triggered when the widget is closed. This function should handle any cleanup or state management required when the widget is no longer visible.

- **`routingId: string`**
  The UUID of the routing that should be used to determine which team members will be assigned the new deals.

- **`productId?: string`**  
   The UUID of a product you want all new deals to be associated with. This will override the product selection by the routing.

#### Example Usage

```jsx
import React, { useState } from 'react';
import { BookingWidget } from '@ripcord.io/meeting';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Booking Widget<button>
      {isOpen && (
        <BookingWidget
          open={isOpen}
          onClose={handleClose}
          routingId="<your_routing_id>"
          productId="<your_product_id>" // Optional
        />
      )}
    </div>
  );
}

export default App;
```

### UTM Parameters

When using the widget via the CDN, any UTM parameters in the URL will automatically be captured and sent to the Ripcord API. This needs to be enabled manually when using ES6.

#### `initUTMCapture: () => void`

This function captures any UTM parameters in the URL and stores them to be sent to the Ripcord API. This function should be called as early as possible, and as few times a possible. Call this function at the root of your application.

#### Example Usage

```jsx
import React, { useState, useEffect } from 'react';
import { BookingWidget, initUTMCapture } from '@ripcord.io/meeting';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    initUTMCapture();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Booking Widget</button>
      {isOpen && (
        <BookingWidget
          open={isOpen}
          onClose={handleClose}
          routingId="<your_routing_id>"
          productId="<your_product_id>" // Optional
        />
      )}
    </div>
  );
}

export default App;
```

## License

[MIT © Ripcord.io, LLC](./LICENSE.md)
