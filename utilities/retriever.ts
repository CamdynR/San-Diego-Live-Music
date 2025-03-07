// script.ts

import fs from 'fs';
import { venueData, AllVenues, Venue, Show } from './Venue.ts';

const venueNameArr = Object.keys(venueData) as AllVenues[];
const venueDataArr: Venue[] = Object.entries(venueData).map(([_, v]) => v);
const eventData: PromiseSettledResult<Show[]>[] = await Promise.allSettled(
  venueDataArr.map((v) => v.fetchSchedule())
);

const TODAY = new Date().toISOString().split('T')[0];

let cache: Partial<Record<AllVenues, Show[]>> = {};
if (fs.statSync('./public/shows.json')) {
  cache = JSON.parse(fs.readFileSync('./public/shows.json', 'utf-8'));
} else {
  eventData.forEach((e, i) => {
    let venueEventData: Show[] = [];
    if (e.status === 'fulfilled') venueEventData = e.value;
    cache[venueNameArr[i]] = { [TODAY]: venueEventData };
  });
}

fs.writeFileSync('./public/shows.json', JSON.stringify(cache, null, 2));
