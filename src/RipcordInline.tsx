'use client';

import './index.css';
import { createRoot, Root } from 'react-dom/client';

import { MainInline } from './BookingWidget';

function assertConstructorParams(params: { routingId: string; el: string | HTMLElement }) {
  if (!params)
    throw new Error(
      'Invalid constructor for Ripcord instance. Must provide an object with a routingId'
    );

  if (!params.routingId) {
    throw new Error('routingId is required');
  }

  if (params.el) {
    if (typeof params.el !== 'string' && !(params.el instanceof Element)) {
      throw new Error(
        `'el' must be a string or an HTMLElement. Got ${Array.isArray(params.el) ? 'Array' : params.el} instead`
      );
    }
  }
}

function findElement(el: string | Element): Element {
  if (typeof el === 'string') {
    const found = document.querySelector(el);

    if (!found) {
      throw new Error(`Element with selector ${el} not found`);
    }

    return found;
  }

  return el;
}

class RipcordInline {
  static instances: RipcordInline[] = [];

  private rootElement: Element;

  private root?: Root;

  private destroyed: boolean = false;

  private routingId: string;

  private productId?: string;

  private key: string = String(Math.random());

  constructor(params: { routingId: string; el: string | HTMLElement; productId?: string }) {
    assertConstructorParams(params);

    const { el, routingId, productId } = params;

    this.rootElement = findElement(el);
    this.routingId = routingId;
    this.productId = productId;

    RipcordInline.instances.push(this);
  }

  static INTERNAL_USE_ONLY_onConfigChange() {
    RipcordInline.instances.forEach((instance) => {
      if (instance && !instance.destroyed) {
        instance.key = String(Math.random());

        instance.render();
      }
    });
  }

  public initialize() {
    const handle = this.initReact.bind(this);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', handle);
    } else {
      handle();
    }
  }

  public destroy() {
    this.destoryCheck();

    this.destroyed = true;

    this.root?.unmount();
  }

  private initReact() {
    this.root = createRoot(this.rootElement);

    this.render();
  }

  private render() {
    if (!this.root) {
      throw new Error("Trying to render without initializing the root. Call 'initialize' first");
    }

    this.root.render(
      <MainInline routingId={this.routingId} productId={this.productId} key={this.key} />
    );
  }

  private destoryCheck() {
    if (this.destroyed) {
      throw new Error('Ripcord instance has been destroyed');
    }
  }
}

export default RipcordInline;
