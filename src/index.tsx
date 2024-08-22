'use client';

import './index.css';
import { createRoot, Root } from 'react-dom/client';

import BookingWidget from './BookingWidget';

function findEl(el: string | HTMLElement): HTMLElement {
  if (typeof el === 'string') {
    const found = document.querySelector(el);

    if (!found) {
      throw new Error(`Element with selector ${el} not found`);
    }

    return found as HTMLElement;
  }

  return el;
}

class Ripcord {
  private el?: HTMLElement;

  private root: Root;

  private rootEl: HTMLElement;

  private open: boolean = false;

  private destroyed: boolean = false;

  private routingId: string;

  private productId?: string;

  private key: string = String(Math.random());

  constructor(params: { routingId: string; el?: string | HTMLElement; productId?: string }) {
    const { el, routingId, productId } = params;

    this.routingId = routingId;
    this.productId = productId;
    this.rootEl = this.createRootEl();
    this.root = createRoot(this.rootEl);

    this.el = typeof el !== 'undefined' ? findEl(el) : undefined;

    this.openWidget = this.openWidget.bind(this);
    this.closeWidget = this.closeWidget.bind(this);

    this.bindEvents();

    this.render();
  }

  public openWidget() {
    this.destoryCheck();

    if (this.open) {
      return;
    }

    this.open = true;
    this.key = String(Math.random());

    this.render();
  }

  public closeWidget() {
    this.destoryCheck();

    if (!this.open) {
      return;
    }

    this.open = false;

    this.render();
  }

  public destroy() {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    this.unbindEvents();

    this.root.unmount();

    document.body.removeChild(this.rootEl);
  }

  private render() {
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

  private bindEvents() {
    if (this.el) {
      this.el.addEventListener('click', this.openWidget);
    }
  }

  private unbindEvents() {
    if (this.el) {
      this.el.removeEventListener('click', this.openWidget);
    }
  }

  private createRootEl() {
    const rootEl = document.createElement('div');

    rootEl.id = `ripcord-root-${this.routingId}`;

    document.body.appendChild(rootEl);

    return rootEl;
  }

  private destoryCheck() {
    if (this.destroyed) {
      throw new Error('Ripcord instance has been destroyed');
    }
  }
}

export { default as BookingWidget } from './BookingWidget';

export { Ripcord };
