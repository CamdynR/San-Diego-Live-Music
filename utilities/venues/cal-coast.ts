// cal-coast.ts

import { Venue, Show, JSDOM } from '../Venue.ts';

type CalCoastEventPerformer = {
  'name': string;
  'sameAs': string;
  '@type': 'MusicGroup';
};

type CalCoastEvent = {
  'name': string;
  'image': string;
  'startDate': string;
  'endDate': string;
  'url': string;
  'description': string;
  'eventStatus': string;
  'location': {
    'name': string;
    'sameAs': string;
    'address': {
      'streetAddress': string;
      'addressLocality': string;
      'addressRegion': string;
      'postalCode': string;
      'addressCountry': string;
      '@type': 'PostalAddress';
    };
    '@type': 'Place';
    'geo': {
      '@type': 'GeoCoordinates';
      'latitude': string;
      'longitude': string;
    };
  };
  'offers': {
    'url': string;
    'availabilityStarts': string;
    'priceCurrency': string;
    'price': string;
    'validForm': string;
    '@type': 'Offer';
  };
  'performer': CalCoastEventPerformer[];
  '@context': 'https://schema.org';
  '@type': 'MusicEvent';
  'eventAttendanceMode': string;
};

export const calCoast: Venue = {
  name: 'Cal Coast Credit Union Open Air Theatre',
  address: '5500 Campanile Drive, San Diego, CA 92182',
  url: 'https://www.ticketmaster.com/Open-Air-Theatre-San-Diego-tickets-San-Diego/venue/81968?brand=openair',
  ages: 'all-ages',
  type: 'amphitheater',
  capacity: 4600,
  setting: 'outdoors',
  alcohol: 'beer & wine',
  food: 'snacks',
  fetchSchedule
};

async function fetchSchedule() {
  const events: Show[] = [];

  const response = await fetch(calCoast.url);
  if (!response.ok) {
    console.error(
      `[Cal Coast] Error fetching calendar: HTTP ${response.status} - ${response.statusText}`
    );
    return events;
  }

  const data = await response.text();
  const dom = new JSDOM(data);
  const root = dom.window.document;

  const eventElems: HTMLScriptElement[] = [
    ...root.querySelectorAll('script[type="application/ld+json"]')
  ];
  const eventSchemas: CalCoastEvent[] = eventElems
    .map((event: HTMLScriptElement) => {
      try {
        const rawSchema = JSON.parse(event?.textContent ?? '{}');
        if (rawSchema['@type'] === 'MusicEvent') {
          return rawSchema as CalCoastEvent;
        } else {
          return null;
        }
      } catch (err) {
        console.error(`[Cal Coast] Unable to parse JSON schema - ${err}`);
        return null;
      }
    })
    .filter((event: CalCoastEvent | null) => event !== null);

  eventSchemas.forEach((event) => {
    const date = new Date(event.startDate);
    let price = Number(event.offers.price);
    if (isNaN(price)) price = -1;

    events.push({
      url: event.url,
      date,
      doorTime: '',
      showTime: date
        .toLocaleTimeString(undefined, {
          hour: 'numeric',
          minute: '2-digit'
        })
        .replaceAll(' ', '')
        .toLocaleLowerCase(),
      endTime: '',
      header: event.name,
      bands: event.performer.map((p) => p.name),
      ages: 'all-ages',
      price,
      genre: '',
      description: event.description,
      soldOut: undefined
    });
  });

  return events;
}
