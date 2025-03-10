// venue.ts

import jsdom from 'jsdom';
// import { bellyUp } from './venues/belly-up.ts';
// import { brickByBrick } from './venues/brick-by-brick.ts';
// import { calCoast } from './venues/cal-coast.ts';
import { casbah } from './venues/casbah.ts';
// import { cheCafe } from './venues/che-cafe.ts';
// import { eq } from './venues/eq.ts';
// import { houseOfBlues } from './venues/house-of-blues.ts';
// import { humphreys } from './venues/humphreys.ts';
// import { kensingtonClub } from './venues/kensington-club.ts';
// import { louLous } from './venues/lou-lous.ts';
// import { musicBox } from './venues/music-box.ts';
// import { northIsland } from './venues/north-island.ts';
// import { nova } from './venues/nova.ts';
// import { observatory } from './venues/observatory.ts';
// import { petcoPark } from './venues/petco-park.ts';
// import { quartyard } from './venues/quartyard.ts';
// import { radyShell } from './venues/rady-shell.ts';
import { sodaBar } from './venues/soda-bar.ts';
// import { soma } from './venues/soma.ts';
// import { theLoft } from './venues/the-loft.ts';
// import { theSound } from './venues/the-sound.ts';
// import { tilTwoClub } from './venues/til-two-club.ts';
// import { whistleStop } from './venues/whistle-stop.ts';
// import { towerBar } from './venues/tower-bar.ts';

export const { JSDOM } = jsdom;

export type Show = {
  url: string;
  date: Date;
  doorTime: string;
  showTime: string;
  endTime: string;
  header: string;
  bands: string[];
  ages: string;
  price: number | number[];
  genre: string;
  description: string;
  soldOut: boolean;
};

export type VenueName =
  // | 'Belly Up'
  // | 'Brick by Brick'
  // | 'Cal Coast Credit Union Open Air Theatre'
  | 'Casbah'
  // | 'Che Cafe'
  // | 'EQ'
  // | 'House of Blues'
  // | 'Humphreys Concerts by the Bay'
  // | 'Kensington Club'
  // | "Lou Lou's Jungle Room"
  // | 'Music Box'
  // | 'North Island Credit Union Amphitheatre'
  // | 'NOVA'
  // | 'The Observatory North Park'
  // | 'Petco Park'
  // | 'Quartyard'
  // | 'Rady Shell at Jacobs Park'
  | 'Soda Bar';
// | 'SOMA'
// | 'The Loft'
// | 'The Sound'
// | 'Til-Two Club'
// | 'Tower Bar'
// | 'Whistle Stop';

export interface Venue {
  name: VenueName;
  url: string;
  ages: 'all-ages' | '18+' | '21+';
  type: 'bar' | 'club' | 'amphitheater' | 'hotel lounge';
  capacity: number;
  setting: 'indoors' | 'outdoors';
  alcohol: 'beer & wine' | 'full bar' | 'no alcohol';
  food: 'snacks' | 'full menu' | 'no food';
  fetchSchedule(): Promise<Show[]>;
}

export const venueList: Venue[] = [
  // bellyUp,
  // brickByBrick,
  // calCoast,
  casbah,
  // cheCafe,
  // eq,
  // houseOfBlues,
  // humphreys,
  // kensingtonClub,
  // louLous,
  // musicBox,
  // northIsland,
  // nova,
  // observatory,
  // petcoPark,
  // quartyard,
  // radyShell,
  sodaBar
  // soma,
  // theLoft,
  // theSound,
  // tilTwoClub,
  // whistleStop,
  // towerBar,
];
