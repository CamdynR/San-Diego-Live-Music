// brick-by-brick.ts

import { JSDOM, Show, Venue } from '../Venue.ts';

type BrickByBrickEvent = {
  id: string;
  start: number;
  title: string;
  imageUrl: string;
  allDay: boolean;
  url: string;
  times: string;
  venue: string;
  title_with_time: string;
};

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

  if (!response.ok) {
    console.error(
      `[Brick by Brick] Error fetching calendar: HTTP ${response.status} - ${response.statusText}`
    );
    return events;
  }

  const data = await response.text();
  const dom = new JSDOM(data);
  const root = dom.window.document;
  const scripts = [...root.querySelectorAll('script')];
  const script = scripts.filter((element: HTMLElement) => {
    return element.textContent?.includes('all_events');
  })[0];

  if (script !== undefined) {
    const match = script.textContent?.match(/var all_events\s*=\s*(\[.*?\]);/s);
    if (match) {
      try {
        const parseJSObj = (jsLikeJson: string) =>
          new Function(`return ${jsLikeJson}`)();
        const parsedEvents = await parseRawEvents(parseJSObj(match[1]));
        events.push(...parsedEvents);
      } catch (e) {
        console.error(`Failed to parse JSON: ${e}`);
      }
    }
  }

  return events;
}

// HELPER FUNCTIONS

async function parseRawEvents(rawEvents: BrickByBrickEvent[]): Promise<Show[]> {
  const parsedEvents: Show[] = [];

  const eventList = rawEvents.filter((event) => typeof event?.url === 'string');

  for (let i = 0; i < eventList.length; i++) {
    const event = eventList[i];
    let response, data;

    // For a 500ms delay in-between requests
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 500);
    });

    // Try to fetch event HTML
    try {
      response = await fetch(event.url);
      // Throw if data isn't fetched properly
      if (!response.ok) {
        throw new Error(
          `[Brick by Brick] Error fetching event: HTTP ${response.status} - ${response.statusText}`
        );
      }
      data = await response.text();
    } catch (err) {
      console.error(err);
    }

    const dom = new JSDOM(data);
    const root = dom.window.document;

    const urlElem = root.querySelector('a.tw-buy-tix-btn');
    const dateElem = root.querySelector('.tw-event-date');
    const doorTimeElem = root.querySelector('.tw-event-door-time');
    const showTimeElem = root.querySelector('.tw-event-time');
    const frontBandElem = root.querySelector('.tw-name.event-title');
    const openersElems = [...root.querySelectorAll('.tw-attractions > span')];
    const agesElem = root.querySelector('.tw-age-restriction');
    const priceElem = root.querySelector('.tw-price');
    const descElem = root.querySelector('.tw-description');

    // Format the elements
    const url = urlElem?.textContent.trim() ?? '';

    let dateString = dateElem?.textContent ?? 'Jan 1, 1970';
    if (dateString !== 'Jan 1, 1970') {
      // Clean up date string
      dateString = dateString.replaceAll('@', '').trim();
      // Grab current dates
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentDay = new Date().getDate();
      // Format date to be usable in date string
      const [monthName, day] = dateString.split(', ');
      const monthIndex = new Date(`${monthName} 1`).getMonth();
      dateString = `${monthName} ${day}, ${currentYear}`;
      // If the month has already passed this year, use the next year
      if (
        monthIndex < currentMonth ||
        (monthIndex === currentMonth && day < currentDay)
      ) {
        dateString = `${monthName} ${day}, ${currentYear + 1}`;
      }
    }
    const date = new Date(dateString);

    let doorTime = doorTimeElem?.getAttribute('href') ?? '';
    doorTime = doorTime.replaceAll(' ', '').trim();

    let showTime = showTimeElem?.textContent ?? '';
    showTime = showTime.replaceAll('Show: ', '');
    showTime = showTime.replaceAll(' ', '').trim();

    const bands = [];
    if (frontBandElem) {
      bands.push(frontBandElem.textContent.trim());
    }
    if (openersElems.length > 0) {
      bands.push(...openersElems.map((e) => e.textContent.trim()));
    }

    let ages = 'all-ages';
    if (agesElem) {
      const agesElemTxt = agesElem.textContent;
      ages = agesElemTxt.includes('18') ? '18+' : ages;
      ages = agesElemTxt.includes('21') ? '21+' : ages;
    }

    let price: number | number[] = -1;
    if (priceElem) {
      const priceTxt = priceElem.textContent.replaceAll('$', '').trim();
      if (priceTxt.includes('-')) {
        let multiPrice: number[] = priceTxt.split(' - ');
        multiPrice = multiPrice.map((p) => {
          return isNaN(Number(p)) ? -1 : Number(p);
        });
        price = multiPrice;
      } else {
        price = isNaN(Number(priceTxt)) ? -1 : Number(priceTxt);
      }
    }

    const description = descElem?.textContent.trim() ?? '';

    parsedEvents.push({
      url,
      date,
      doorTime,
      showTime,
      endTime: '',
      header: '',
      bands,
      ages: '',
      price,
      genre: '',
      description,
      soldOut: undefined
    });
  }

  return parsedEvents;
}
