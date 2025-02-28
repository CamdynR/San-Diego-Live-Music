// casbah.ts

import { Venue, Show, JSDOM } from '../Venue.ts';

export const casbah: Venue = {
  name: 'Casbah',
  url: 'https://www.casbahmusic.com/calendar/',
  fetchSchedule: async () => {
    let events: Show[] = [];

    let response = await fetch(casbah.url);
    let data = await response.text();
    let dom = new JSDOM(data);
    let root = dom.window.document;
    root
      .querySelectorAll('.seetickets-list-event-content-container')
      .forEach((element) => {
        let venue = element.querySelector('.venue');
        if (venue && venue.textContent !== 'at Casbah') {
          // Grab element references from the event
          let urlElem = element.querySelector('.event-title a');
          let dateElem = element.querySelector('.event-date');
          let doorTimeElem = element.querySelector('.see-doortime');
          let showTimeElem = element.querySelector('.see-showtime');
          let bandsElem = element.querySelector('.event-title');
          let headerElem = element.querySelector('.event-header');
          let agesElem = element.querySelector('.ages');
          let priceElem = element.querySelector('.price');
          let genreElem = element.querySelector('.genre');

          // Format data into proper types
          let url = urlElem?.getAttribute('href') || casbah.url;
          let doorTime = doorTimeElem?.textContent || '';
          let showTime = showTimeElem?.textContent || '';
          let header = headerElem?.textContent || '';
          let ages = agesElem?.textContent || '';
          let genre = genreElem?.textContent || '';

          let date: Date | undefined;
          if (dateElem) {
            const CURR_YEAR = new Date().getFullYear();
            // Parse the date string without a year
            date = new Date(`${dateElem.textContent} ${CURR_YEAR}`);
            // If the parsed month is behind the current month, use next year
            const currentMonth = new Date().getMonth(); // 0-based (Jan = 0, Feb = 1, ...)
            if (date.getMonth() < currentMonth) {
              date.setFullYear(CURR_YEAR + 1);
            }
          }

          let bands: string[] = [];
          if (bandsElem) {
            bands =
              bandsElem?.textContent?.split(',').map((band) => band.trim()) ||
              [];
          }

          let price: number | [number, number] = 0;
          if (priceElem) {
            let priceStr: string | string[] = priceElem.textContent ?? '';
            priceStr = priceStr?.replaceAll('$', '');
            if (priceStr.includes('-')) {
              priceStr = priceStr.split('-');
              price = [Number(priceStr[0]), Number(priceStr[1])];
            } else {
              price = Number(priceStr);
            }
          }

          events.push({
            url,
            date,
            doorTime,
            showTime,
            header,
            bands,
            ages,
            price,
            genre,
          });
        }
      });

    return events;
  },
};
