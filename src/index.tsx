'use client';

import './index.css';
import { createRoot, Root } from 'react-dom/client';

import BookingWidget from './BookingWidget';

class Ripcord {
  private el: HTMLElement;

  private root: Root;

  private open: boolean = false;

  private destroyed: boolean = false;

  private routingId: string;

  private productId?: string;

  private key: string = '';

  constructor(params: { routingId: string; productId?: string }) {
    const { routingId, productId } = params;

    this.routingId = routingId;
    this.productId = productId;

    const el = document.createElement('div');
    el.id = `ripcord-${routingId}`;
    document.body.appendChild(el);

    this.el = el;
    this.root = createRoot(el);

    this.closeWidget = this.closeWidget.bind(this);
  }

  public openWidget() {
    this.destoryCheck();

    if (this.open) {
      return;
    }

    this.open = true;
    this.key = String(Math.random());

    this.root.render(
      <BookingWidget
        open={this.open}
        onClose={this.closeWidget}
        routingId={this.routingId}
        productId={this.productId}
        widgetKey={this.key}
      />
    );
  }

  public closeWidget() {
    this.destoryCheck();

    if (!this.open) {
      return;
    }

    this.open = false;

    this.root.render(
      <BookingWidget
        open={this.open}
        onClose={this.closeWidget}
        routingId={this.routingId}
        productId={this.productId}
        widgetKey={this.key}
      />
    );
  }

  public destroy() {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;
    this.root.unmount();
    this.el.remove();
  }

  private destoryCheck() {
    if (this.destroyed) {
      throw new Error('Ripcord instance has been destroyed');
    }
  }
}

export { default as BookingWidget } from './BookingWidget';

export { Ripcord };
