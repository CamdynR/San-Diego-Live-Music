// casbah.ts

import { Venue, Show, JSDOM } from '../Venue.ts';

export const casbah: Venue = {
  name: 'The Casbah',
  address: '2501 Kettner Blvd, San Diego, CA 92101',
  url: 'https://www.casbahmusic.com/calendar/',
  ages: '21+',
  type: 'bar',
  capacity: 200,
  setting: 'indoors',
  alcohol: 'full bar',
  food: 'no food',
  fetchSchedule
};

async function fetchSchedule(): Promise<Show[]> {
  let events: Show[] = [];

  const response = await fetch(casbah.url);
  const data = await response.text();
  const dom = new JSDOM(data);
  const root = dom.window.document;
  root
    .querySelectorAll('.seetickets-list-event-content-container')
    .forEach((element: HTMLElement) => {
      const venue = element.querySelector('.venue');
      if (venue && venue.textContent === 'at Casbah') {
        // Grab element references from the event
        const urlElem = element.querySelector('.event-title a');
        const dateElem = element.querySelector('.event-date');
        const doorTimeElem = element.querySelector('.see-doortime');
        const showTimeElem = element.querySelector('.see-showtime');
        const bandsElem = element.querySelector('.event-title');
        const headerElem = element.querySelector('.event-header');
        const agesElem = element.querySelector('.ages');
        const priceElem = element.querySelector('.price');
        const genreElem = element.querySelector('.genre');

        // Format data into proper types
        const url = urlElem?.getAttribute('href') || casbah.url;
        const doorTime = doorTimeElem?.textContent || '';
        const showTime = showTimeElem?.textContent || '';
        const header = headerElem?.textContent || '';
        const ages = agesElem?.textContent || '21+';
        const genre = genreElem?.textContent || '';

        let date: Date;
        if (dateElem) {
          const CURR_YEAR = new Date().getFullYear();
          // Parse the date string without a year
          date = new Date(`${dateElem.textContent} ${CURR_YEAR}`);
          // If the parsed month is behind the current month, use next year
          const currentMonth = new Date().getMonth(); // 0-based (Jan = 0, Feb = 1, ...)
          if (date.getMonth() < currentMonth) {
            date.setFullYear(CURR_YEAR + 1);
          }
        } else {
          date = new Date(0);
        }

        let bands: string[] = [];
        if (bandsElem) {
          bands =
            bandsElem?.textContent?.split(',').map((band) => band.trim()) || [];
        }

        let price: number | [number, number] = 0;
        if (priceElem) {
          let priceStr: string = priceElem.textContent ?? '';
          priceStr = priceStr?.replaceAll('$', '');
          if (priceStr.includes('-')) {
            const priceArr = priceStr.split('-');
            price = [Number(priceArr[0]), Number(priceArr[1])];
          } else {
            price = Number(priceStr);
          }
        }

        // TODO: Check if the event is sold out
        const soldOut = false;

        // TODO: Get the event description
        const description = '';

        events.push({
          url,
          date,
          doorTime,
          showTime,
          endTime: '',
          header,
          bands,
          ages,
          price,
          genre,
          description,
          soldOut
        });
      }
    });

  events = [...new Map(events.map((obj) => [obj.url, obj])).values()];

  return events;
}
