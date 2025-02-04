'use client';

import './index.css';
import { createRoot, Root } from 'react-dom/client';

import { Config, setConfig } from './config';

import BookingWidget from './BookingWidget';

function findElements(el: string | Element): Element[] {
  if (typeof el === 'string') {
    const found = document.querySelectorAll(el);

    if (!found) {
      throw new Error(`Element with selector ${el} not found`);
    }

    return Array.from(found);
  }

  return [el];
}

class Ripcord {
  static instances: Ripcord[] = [];

  private selector?: string | Element;

  private elements?: Element[];

  private root?: Root;

  private rootEl?: HTMLElement;

  private isOpen: boolean = false;

  private destroyed: boolean = false;

  private routingId: string;

  private productId?: string;

  private key: string = String(Math.random());

  constructor(params: { routingId: string; el?: string | HTMLElement; productId?: string }) {
    if (!params.routingId) throw new Error('routingId is required');

    const { el, routingId, productId } = params;

    this.selector = el;
    this.routingId = routingId;
    this.productId = productId;

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);

    Ripcord.instances.push(this);

    this.initialize();
  }

  static INTERNAL_USE_ONLY_setConfig(config: Config) {
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

    this.root?.unmount();

    if (this.rootEl) {
      document.body.removeChild(this.rootEl);
    }
  }

  private initialize() {
    const handle = () => {
      this.initReact();

      this.bindEvents();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', handle);
    } else {
      handle();
    }
  }

  private initReact() {
    this.rootEl = this.createRootEl();

    this.root = createRoot(this.rootEl);

    this.render();
  }

  private render() {
    if (!this.root) {
      throw new Error("Trying to render without initializing the root. Call 'initialize' first");
    }

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
    if (!this.selector) return;

    const { selector } = this;

    this.elements = findElements(selector);

    this.elements.forEach((el) => {
      el.addEventListener('click', this.open);
    });
  }

  private unbindEvents() {
    if (this.elements) {
      this.elements.forEach((el) => {
        el.removeEventListener('click', this.open);
      });
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
