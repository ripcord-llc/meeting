'use client';

import './index.css';

import { initUTMCapture } from './utm';
import Ripcord from './Ripcord';
import RipcordInline from './RipcordInline';
import BookingWidget, { MainInline as BookingInline } from './BookingWidget';

export type { BookingWidgetProps } from './BookingWidget';

export { BookingWidget, BookingInline, Ripcord, RipcordInline, initUTMCapture };
