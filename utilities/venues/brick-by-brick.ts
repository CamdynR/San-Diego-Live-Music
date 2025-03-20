// brick-by-brick.ts

import jsdom from 'jsdom';
const { JSDOM } = jsdom;
// import { Venue, Show, JSDOM } from '../Venue.ts';

// export const brickByBrick: Venue = {
//   name: 'Brick by Brick',
//   address: '1130 Buenos Ave, San Diego, CA 92110',
//   url: 'https://www.brickbybrick.com/calendar/',
//   ages: '21+',
//   type: 'bar',
//   capacity: 400,
//   setting: 'indoors',
//   alcohol: 'full bar',
//   food: 'no food',
//   fetchSchedule
// };

async function fetchSchedule() {
  // const events: Show[] = [];
  const events: any = [];

  const response = await fetch('https://www.brickbybrick.com/calendar/');
  const data = await response.text();
  const dom = new JSDOM(data);
  const root = dom.window.document;
  const scripts = [...root.querySelectorAll('script')];
  const script = scripts.filter((element: HTMLElement) => {
    return element.textContent?.includes('all_events');
  })[0];

  let allEvents: any = null;
  if (script !== undefined) {
    const match = script.textContent?.match(/var all_events\s*=\s*(\[.*?\]);/s);
    if (match) {
      try {
        const parseJSObj = (jsLikeJson: string) =>
          new Function(`return ${jsLikeJson}`)();
        const obj = parseJSObj(match[1]);
      } catch (e) {
        console.error(`Failed to parse JSON: ${e}`);
      }
    }
  }

  console.log(allEvents);

  return events;
}

fetchSchedule();
