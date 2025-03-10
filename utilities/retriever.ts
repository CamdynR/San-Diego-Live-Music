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
type cacheType = Partial<Record<VenueName, { date: string; shows: Show[] }>>;
const cache: cacheType = JSON.parse(Deno.readTextFileSync(SHOWS_PATH));

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
      let newSchedule = await venue.fetchSchedule();
      // Sort chronologically
      newSchedule = newSchedule.sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      );
      // Assign to cache
      cache[venue.name] = {
        date: TODAY,
        shows: newSchedule
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
