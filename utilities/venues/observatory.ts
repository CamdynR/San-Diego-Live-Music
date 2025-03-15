// observatory.ts

import { Venue, Show, JSDOM } from '../Venue.ts';

// Types

type ObservatoryEvent = {
  '@context'?: string;
  '@type'?: string;
  'name'?: string;
  'image'?: string;
  'startDate'?: string;
  'url'?: string;
  'eventStatus'?: string;
  'eventAttendanceMode'?: string;
  'location'?: {
    '@type'?: string;
    'name'?: string;
    'address'?: {
      '@type'?: string;
      'streetAddress'?: string;
      'addressLocality'?: string;
      'addressRegion'?: string;
      'postalCode'?: string;
      'addressCountry'?: {
        '@type'?: string;
        'name'?: string;
      };
    };
    'geo'?: {
      '@type'?: string;
      'latitude'?: number;
      'longitude'?: number;
    };
  };
};

// Main Code

export const observatory: Venue = {
  name: 'The Observatory North Park',
  url: 'https://www.observatorysd.com/shows',
  ages: 'event dependent',
  type: 'old theater',
  capacity: 1100,
  setting: 'indoors',
  alcohol: 'full bar',
  food: 'attached restaurant',
  fetchSchedule
};

async function fetchSchedule(): Promise<Show[]> {
  const events: Show[] = [];

  // Grab the content from the web
  const response = await fetch(observatory.url);
  const data = await response.text();
  const dom = new JSDOM(data);
  const root = dom.window.document;

  // Parse the text into JSON from the application/ld+json scripts
  const jsonScripts = [
    ...root.querySelectorAll('[type="application/ld+json"]')
  ];
  const parsedJSON = jsonScripts.map((elem) => {
    let parsed = {};
    try {
      parsed = JSON.parse(elem?.textContent || {});
    } catch (err) {
      console.error(`Unable to parse JSON, ${err}`);
    }
    return parsed;
  });

  // TODO: Finish

  // Parse the JSON into the structure that we need
  parsedJSON.forEach((event: ObservatoryEvent) => {
    events.push({
      url: event.url ?? '',
      date: new Date(event.startDate ?? 0),
      doorTime: new Date(event.startDate ?? 0).toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit'
      }),
      showTime: '',
      endTime: '',
      header: '',
      bands: [''],
      ages: '',
      price: 0,
      genre: '',
      description: '',
      soldOut: false
    });
  });

  return events;
}
