'use client';

import './index.css';
import { createRoot, Root } from 'react-dom/client';

import { setConfig } from './config';

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
  static instances: Ripcord[] = [];

  private el?: HTMLElement;

  private root: Root;

  private rootEl: HTMLElement;

  private isOpen: boolean = false;

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

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);

    this.bindEvents();

    this.render();

    Ripcord.instances.push(this);
  }

  static INTERNAL_USE_ONLY_setConfig(config: { clientUrl: string; apiUrl: string }) {
    setConfig(config);

    Ripcord.instances.forEach((instance) => {
      if (instance && !instance.destroyed) {
        instance.key = String(Math.random());

        instance.render();
      }
    });
  }

  public open() {
    this.destoryCheck();

    if (this.isOpen) {
      return;
    }

    this.isOpen = true;
    this.key = String(Math.random());

    this.render();
  }

  public close() {
    this.destoryCheck();

    if (!this.open) {
      return;
    }

    this.isOpen = false;

    this.render();
  }

  public destroy() {
    this.destoryCheck();

    this.destroyed = true;

    this.unbindEvents();

    this.root.unmount();

    document.body.removeChild(this.rootEl);
  }

  private render() {
    this.root.render(
      <BookingWidget
        open={this.isOpen}
        onClose={this.close}
        routingId={this.routingId}
        productId={this.productId}
        key={this.key}
      />
    );
  }

  private bindEvents() {
    if (this.el) {
      this.el.addEventListener('click', this.open);
    }
  }

  private unbindEvents() {
    if (this.el) {
      this.el.removeEventListener('click', this.open);
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

export default Ripcord;
