// soda-bar.ts

import { Venue, Show } from '../Venue.ts';

const X_API_KEY = '7eKoPj5BJI5D83snVEQ9S5uHj4SO9j07aw5qh3VR';

export const sodaBar: Venue = {
  name: 'Soda Bar',
  address: '3615 El Cajon Blvd, San Diego, CA 92104',
  url: `https://partners-endpoint.dice.fm/api/v2/events?page%5Bsize%5D=24&types=linkout%2Cevent&filter%5Bvenues%5D%5B%5D=soda+bar&filter%5Bpromoters%5D%5B%5D=Big+Soda+LLC+DBA+Soda+Bar`,
  ages: '21+',
  type: 'bar',
  capacity: 200,
  setting: 'indoors',
  alcohol: 'full bar',
  food: 'no food',
  fetchSchedule
};

async function fetchSchedule(): Promise<Show[]> {
  const events: Show[] = [];

  const response = await fetch(sodaBar.url, {
    headers: {
      'X-Api-Key': X_API_KEY
    }
  });

  if (!response.ok) {
    console.error(
      `[Soda Bar] Error fetching calendar: HTTP ${response.status} - ${response.statusText}`
    );
    return events;
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    console.error('Failed to fetch schedule for Soda Bar:', error);
  }

  data = data?.data;
  if (!Array.isArray(data) || data.length == 0) return events;

  data.forEach((event) => {
    // Ignore everything that's not at the Soda Bar
    if (event.venue != 'Soda Bar') return;
    events.push({
      url: event.url ?? '',
      date: new Date(event.date ?? 0),
      doorTime: new Date(event.date ?? 0)
        .toLocaleTimeString(undefined, {
          hour: 'numeric',
          minute: '2-digit'
        })
        .replaceAll(' ', '')
        .toLocaleLowerCase(),
      showTime: '',
      endTime: '',
      header: '',
      bands: event.name?.split(', ') ?? [],
      ages: '21+',
      price: [
        (event.ticket_types?.[0]?.price?.face_value ?? 0) / 100,
        (event.ticket_types?.[0]?.price?.total ?? 0) / 100
      ],
      genre:
        event.genre_tags
          ?.map((g: string) => {
            const str = g.split(':').pop() ?? '';
            return str[0].toUpperCase() + str.slice(1);
          })
          .join(' / ') ?? '',
      description: event.description?.replace(/\s+/g, ' ') ?? '',
      soldOut: event.sold_out ?? undefined
    });
  });

  return events;
}
