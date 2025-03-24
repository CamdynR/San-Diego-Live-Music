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
  address: '2891 University Ave, San Diego, CA 92104',
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

  if (!response.ok) {
    console.error(
      `[The Observatory North Park] Error fetching calendar: HTTP ${response.status} - ${response.statusText}`
    );
    return events;
  }

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

  // Parse the JSON into the structure that we need
  parsedJSON.forEach((event: ObservatoryEvent) => {
    // We only care about music events
    if (event?.['@type'] !== 'MusicEvent') return;
    // Header and Ages
    let [band, header] = ['', ''];
    let ages: Show['ages'] = 'all-ages';
    if (event?.name !== undefined) {
      // Grab the ages
      const eighteenPlus: string[] | null = event.name.match(/\(.*18\+.*\)/g);
      const twentyOnePlus: string[] | null = event.name.match(/\(.*21\+.*\)/g);
      if (eighteenPlus !== null) ages = '18+';
      if (twentyOnePlus !== null) ages = '21+';
      // Grab the band and header
      const noAge = event.name.replaceAll(/\(\d{2}\+.*\)/g, '').trim();
      let split = '';
      band = noAge;
      if (band.includes(': ')) split = ': ';
      else if (band.includes(' - ')) split = ' - ';
      if (split !== '') {
        header = band.split(split)[1];
        band = band.split(split)[0];
      }
    }

    events.push({
      url: event.url ?? '',
      date: new Date(event.startDate ?? 0),
      doorTime: new Date(event.startDate ?? 0).toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit'
      }),
      showTime: '',
      endTime: '',
      header: header,
      bands: [band],
      ages: ages,
      price: -1,
      genre: '',
      description: '',
      soldOut: undefined
    });
  });

  return events;
}
