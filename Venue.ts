// venue.ts

import jsdom from 'jsdom';
export const { JSDOM } = jsdom;

export type Show = {
  url: string;
  date: Date | undefined;
  doorTime?: string;
  showTime?: string;
  endTime?: string;
  header?: string;
  bands: string[];
  ages?: string;
  price: number | [number, number];
  genre?: string;
};

export interface Venue {
  name: string;
  url: string;
  fetchSchedule(): Promise<Show[]>;
}
