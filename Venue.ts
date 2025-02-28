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
  ages: 'all-ages' | '18+' | '21+';
  type: 'bar' | 'club' | 'amphitheater' | 'hotel lounge';
  capacity: 'under 100' | 'up to 500' | 'up to 1000' | 'over 1000';
  setting: 'indoors' | 'outdoors';
  alcohol: 'beer & wine' | 'full bar' | 'no alcohol';
  food: 'snacks' | 'full menu' | 'no food';
  fetchSchedule(): Promise<Show[]>;
}
