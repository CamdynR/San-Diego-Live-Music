// script.ts

/*******************/
/***** IMPORTS *****/
/*******************/

import { existsSync } from 'jsr:@std/fs/exists';
import { venueList, VenueName, Show } from './Venue.ts';

/*********************/
/***** CONSTANTS *****/
/*********************/

const SHOWS_PATH = './src/data/shows.json';
const TODAY = new Date().toLocaleDateString('en-CA');

/************************/
/***** DATA PARSING *****/
/************************/

// Make the cache if it doesn't exist
const cacheExists = existsSync(SHOWS_PATH);
if (!cacheExists) Deno.writeTextFileSync(SHOWS_PATH, '{}');
// Read the cache
type CacheShowType = Omit<Show, 'date'> & { date: number };
export type CacheType = Partial<
  Record<VenueName, { date: string; shows: CacheShowType[] }>
>;
const cache: CacheType = JSON.parse(Deno.readTextFileSync(SHOWS_PATH));

/*************************/
/***** DATA FETCHING *****/
/*************************/

await Promise.all(
  // Loop through each venue
  venueList.map(async (venue) => {
    // If the schedule for today is cached, use it
    if (cache[venue.name]?.date == TODAY) return venue;
    // Otherwise fetch the schedule
    try {
      // Fetch the new event schedule
      const newSchedule = await venue.fetchSchedule();
      // Sort chronologically
      const newScheduleCacheType: CacheShowType[] = newSchedule
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map((show): CacheShowType => {
          return {
            ...show,
            date: show.date.getTime()
          };
        });
      // Assign to cache
      cache[venue.name] = {
        date: TODAY,
        shows: newScheduleCacheType
      };
    } catch (error) {
      console.error(`Failed to fetch schedule for ${venue.name}:`, error);
    }
    return venue;
  })
);

/***********************/
/***** DATA OUTPUT *****/
/***********************/

Deno.writeTextFileSync(SHOWS_PATH, JSON.stringify(cache, null, 2));
