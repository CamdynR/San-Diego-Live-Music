// soda-bar.ts

import { Venue, Show, JSDOM } from '../Venue.ts';

export const sodaBar: Venue = {
  name: 'Soda Bar',
  url: 'https://sodabarmusic.com/',
  fetchSchedule: async () => {
    let events: Show[] = [];

    let response = await fetch(sodaBar.url);
    let data = await response.text();
    let dom = new JSDOM(data);
    let root = dom.window.document;

    root
      .querySelectorAll('.dice_events [type="application/ld+json"]')
      .forEach((event) => {
        let schema = JSON.parse(event?.textContent ?? '[]');
        if (schema.length === 0) return;
        schema = schema[0];

        let doorTime = new Date(schema.doorTime);
        let endTime = new Date(schema.endDate);

        events.push({
          url: schema.url,
          date: doorTime,
          doorTime: doorTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          }),
          endTime: endTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          }),
          bands: schema.name.split(', '),
          ages: '21+',
          price: schema.offers[0].price,
        });
      });

    return events;
  },
};
