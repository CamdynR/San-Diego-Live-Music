// brick-by-brick.ts

import { Venue, Show, JSDOM } from '../Venue.ts';

export const brickByBrick: Venue = {
  name: 'Brick by Brick',
  address: '1130 Buenos Ave, San Diego, CA 92110',
  url: 'https://www.brickbybrick.com/calendar/',
  ages: '21+',
  type: 'bar',
  capacity: 400,
  setting: 'indoors',
  alcohol: 'full bar',
  food: 'no food',
  fetchSchedule
};

async function fetchSchedule() {
  const events: Show[] = [];

  const response = await fetch(brickByBrick.url);
  const data = await response.text();
  const dom = new JSDOM(data);
  const root = dom.window.document;
  root.querySelectorAll('').forEach((element: HTMLElement) => {
    // TODO
  });

  return events;
}
