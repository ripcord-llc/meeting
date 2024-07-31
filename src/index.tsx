import "./index.css";
import { createRoot, Root } from "react-dom/client";

import Main from "./main";

export default class Ripcord {
  private root: Root;

  constructor(el: HTMLElement) {
    this.root = createRoot(el);
  }

  public open() {
    this.root.render(<Main />);
  }
}
