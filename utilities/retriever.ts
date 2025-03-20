// script.ts

/*******************/
/***** IMPORTS *****/
/*******************/

import { existsSync } from 'node:fs';
import { venueList, VenueName, Show } from './Venue.ts';

/*********************/
/***** CONSTANTS *****/
/*********************/

const SHOWS_PATH = './src/data/shows.json';
const TODAY = new Date().toLocaleDateString('en-CA');

/*********************/
/***** ARGUMENTS *****/
/*********************/

const args = Deno.args;
const flags: Record<string, string | boolean> = {};

// Help Menu
if (args.length === 1 && args[0] === '--help') {
  console.log(
    `\nUsage: deno run retriever.ts [--venue=["venue1","venue2"]] [--clear-cache]\n
Optional Flags:
----------------------------------------------
  -V, --venue="":           Only fetch from this venue.
  -C, --clear-cache:        Flag to clear the cache.
  -P, --print:              Print to console instead of writing\n`
  );
  Deno.exit();
}

for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg.startsWith('--')) {
    const [flag, value] = arg.split('=');
    if (value) {
      flags[flag.slice(2)] = value; // remove '--'
    } else {
      flags[flag.slice(2)] = true;
    }
  }
}

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
  venueList
    .filter((venue) => {
      return flags?.venue !== undefined ? flags.venue === venue.name : true;
    })
    .map(async (venue) => {
      // If the schedule for today is cached, use it
      if (cache[venue.name]?.date == TODAY && !flags['clear-cache']) {
        return venue;
      }
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

if (!flags.print) {
  Deno.writeTextFileSync(SHOWS_PATH, JSON.stringify(cache, null, 2));
} else if (flags.print && flags?.venue && typeof flags.venue == 'string') {
  console.log(cache[flags.venue as VenueName]);
} else if (flags.print) {
  console.log(cache);
}
