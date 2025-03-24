// belly-up.ts

import { Venue, Show, JSDOM } from '../Venue.ts';

export const bellyUp: Venue = {
  name: 'Belly Up',
  address: '143 S Cedros Ave, Solana Beach, CA 92075',
  ages: '21+',
  type: 'tavern',
  capacity: 600,
  setting: 'indoors',
  alcohol: 'full bar',
  food: 'full kitchen',
  url: 'https://bellyup.com/calendar/',
  fetchSchedule
};

async function fetchSchedule() {
  /**********************/
  /*** FETCH CALENDAR ***/
  /**********************/
  const events: Show[] = [];

  const response = await fetch(bellyUp.url);
  if (!response.ok) {
    console.error(
      `[Belly Up] Error fetching calendar: HTTP ${response.status} - ${response.statusText}`
    );
    return events;
  }

  const data = await response.text();
  const dom = new JSDOM(data);
  const root = dom.window.document;

  let eventElems = [...root.querySelectorAll('.tw-cal-event-popup')];
  eventElems = eventElems
    .filter((e) => {
      const venue = e.querySelector('.tw-venue-name');
      const url = e.querySelector('.sws-buy-tickets');
      if (!venue || !url) return false;
      const isBellyUp = venue.textContent?.includes('Belly Up');
      const isTW = /ticketweb\.com/gi.test(url.getAttribute('href'));
      const hasEnded = /event\sended/gi.test(url.textContent);
      return isBellyUp && isTW && !hasEnded;
    })
    .map((e) => e.querySelector('.sws-buy-tickets').getAttribute('href'));

  /********************/
  /*** FETCH EVENTS ***/
  /********************/
  for (let i = 0; i < eventElems.length; i++) {
    const event = eventElems[i];
    let eventRes, eventData;

    // For a 500ms delay in-between requests
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 500);
    });

    // Fetch event data
    try {
      console.log(`(${i + 1}/${eventElems.length}) Attempting ${event}`);
      eventRes = await fetch(event);
      // Throw if data isn't fetched properly
      if (!eventRes.ok) {
        throw new Error(
          `(${i + 1}/${
            eventElems.length
          }) [Belly Up] Error fetching event: HTTP ${eventRes.status} - ${
            eventRes.statusText
          }`
        );
      } else {
        console.log(`(${i + 1}/${eventElems.length}) Successful fetch`);
      }
      eventData = await eventRes.text();
    } catch (err) {
      console.error(err);
    }

    const dom = new JSDOM(eventData);
    const root = dom.window.document;

    // Query event data elements
    const dateElem = root.querySelector('.info-time>h4');
    const timeElem = root.querySelector('.info-time>h5');
    const bandsElem = root.querySelector('h1.title');
    const priceElem = root.querySelector('.info-price>h4');
    const genreElem = root.querySelector(
      'ul.media-list>li:first-of-type .attraction-genre'
    );
    const descElem = root.querySelector(
      'ul.media-list>li:first-of-type .editable-content'
    );
    const soldOutElem = root.querySelector('.onSale-status');

    // Extra data from page
    const url = event;
    const date = new Date(dateElem?.textContent ?? 0);

    let doorTime = '';
    let showTime = '';
    let timeStr: string = timeElem?.textContent ?? '';
    if (timeStr && /doors/gi.test(timeStr)) {
      timeStr = timeStr
        .trim()
        .toLowerCase()
        .replaceAll(/[\s\(\)]/g, '');
      const timeSplit = timeStr.split('doors');
      doorTime = timeSplit[1];
      showTime = timeSplit[0];
    }

    const bands: string[] = [];
    if (bandsElem) {
      const bandList = [
        ...bandsElem.querySelectorAll('span:not(.prefix-text)')
      ];
      bandList.forEach((band: HTMLSpanElement) => {
        const bandName = band.textContent?.replaceAll(',', '').trim();
        if (bandName) bands.push(bandName);
      });
    }

    const ages = '21+';

    let price: number | number[] = -1;
    let priceStr: string = priceElem?.textContent?.trim() ?? '';
    if (priceStr) {
      priceStr = priceStr.replaceAll('$', '').trim();
      if (priceStr.includes('-')) {
        // Show price range
        price = priceStr.split('-').map((p) => Number(p));
      } else {
        // Show solo price
        price = Number(priceStr);
      }
    }

    const genre = genreElem?.textContent.trim() ?? '';
    const description = descElem?.textContent?.trim() ?? '';

    // Grab sold out content
    let soldOut = false;
    if (soldOutElem) {
      soldOut = /sold\sout/gi.test(soldOutElem.textContent);
    }

    events.push({
      url,
      date,
      doorTime,
      showTime,
      endTime: '',
      header: '',
      bands,
      ages,
      price,
      genre,
      description,
      soldOut
    });
  }

  return events;
}
