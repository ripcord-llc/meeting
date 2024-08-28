/// <reference types="react" />
import * as react from 'react';

declare function initUTMCapture(): void;

interface BookingWidgetProps {
    open: boolean;
    onClose: () => void;
    routingId: string;
    productId?: string;
}
declare function Main(props: BookingWidgetProps): react.JSX.Element;

declare class Ripcord {
    static instances: Ripcord[];
    private el?;
    private root;
    private rootEl;
    private isOpen;
    private destroyed;
    private routingId;
    private productId?;
    private key;
    constructor(params: {
        routingId: string;
        el?: string | HTMLElement;
        productId?: string;
    });
    static INTERNAL_USE_ONLY_setConfig(config: {
        clientUrl: string;
        apiUrl: string;
    }): void;
    open(): void;
    close(): void;
    destroy(): void;
    private render;
    private bindEvents;
    private unbindEvents;
    private createRootEl;
    private destoryCheck;
}
//# sourceMappingURL=index.d.ts.map

export { Main as BookingWidget, type BookingWidgetProps, Ripcord, initUTMCapture };
