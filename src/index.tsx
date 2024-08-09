import "./index.css";
import { createRoot, Root } from "react-dom/client";

import BookingWidget from "./BookingWidget";

class Ripcord {
  private el: HTMLElement;
  private root: Root;
  private open: boolean = false;
  private destroyed: boolean = false;

  constructor(private routingId: string, private productId?: string) {
    const el = document.createElement("div");
    el.id = `ripcord-${routingId}`;
    document.body.appendChild(el);

    this.el = el;
    this.root = createRoot(el);
  }

  public openWidget() {
    this.destoryCheck();

    if (this.open) {
      return;
    }

    this.open = true;
    this.root.render(
      <BookingWidget
        open={this.open}
        onClose={this.closeWidget.bind(this)}
        routingId={this.routingId}
        productId={this.productId}
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
        onClose={this.closeWidget.bind(this)}
        routingId={this.routingId}
        productId={this.productId}
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
      throw new Error("Ripcord instance has been destroyed");
    }
  }
}

export { default as BookingWidget } from "./BookingWidget";

export { Ripcord };
