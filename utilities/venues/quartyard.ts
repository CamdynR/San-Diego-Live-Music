// quartyard.ts

import { Venue, Show, JSDOM } from '../Venue.ts';

type URLElem = HTMLAnchorElement | undefined;
type PElem = HTMLParagraphElement | undefined;
type PArray = HTMLParagraphElement[];
type TitleElem = HTMLDivElement | undefined;

export const quartyard: Venue = {
  name: 'Quartyard',
  address: '1301 Market St, San Diego, CA 92101',
  url: 'https://quartyardsd.com/events/',
  ages: 'event dependent',
  type: 'event space',
  capacity: 550,
  setting: 'outdoors',
  alcohol: 'full bar',
  food: 'full kitchen',
  fetchSchedule
};

async function fetchSchedule() {
  const events: Show[] = [];

  const response = await fetch(quartyard.url);

  if (!response.ok) {
    console.error(
      `[Quartyard] Error fetching calendar: HTTP ${response.status} - ${response.statusText}`
    );
    return events;
  }

  const data = await response.text();
  const dom = new JSDOM(data);
  const root = dom.window.document;
  let eventElems = [...root.querySelectorAll('.card-event-content')];

  // Try to filter out some non-music events (not perfect)
  eventElems = eventElems.filter((event) => {
    const primaryBtn = event.querySelector('a.btn-primary');
    if (!primaryBtn) return false;
    if (primaryBtn.textContent !== 'Buy Tickets') return false;
    return true;
  });

  // Pull out show data from each event
  eventElems.forEach((event) => {
    // Query elements

    const urlElem: URLElem = event.querySelector('a.btn-primary');
    const pElems: PArray = [...event.querySelectorAll('p')];
    const dateTimeElem: PElem = pElems[0];
    const titleElem: TitleElem = event.querySelector('.event-title');

    // Format each element
    const url = urlElem?.getAttribute('href') ?? '';

    let date = new Date(0);
    let doorTime = '';
    let endTime = '';

    let rawStr = dateTimeElem?.textContent?.trim();
    if (typeof rawStr === 'string' && rawStr.includes('Date & Time:')) {
      rawStr = rawStr.replaceAll('Date & Time:', '').trim();
      const dateTimeSplit = rawStr.split(' @ ');

      // DATE FORMATTING
      let dateStr = dateTimeSplit[0];
      // Grab current date
      const today = new Date();
      const currentYear = today.getFullYear();
      // Extract the month and day properly
      const [, monthName, day] = dateStr.split(' '); // Ignore the weekday
      // Get month index
      const monthIndex = new Date(`${monthName} 1`).getMonth();
      // Create a Date object for the extracted date in the current year
      const eventDate = new Date(currentYear, monthIndex, Number(day));
      // Get timestamps for accurate comparison
      const todayTimestamp = new Date(
        currentYear,
        today.getMonth(),
        today.getDate()
      ).getTime();
      const eventTimestamp = eventDate.getTime();
      // If the event is in the past (but not today), move it to next year
      if (eventTimestamp < todayTimestamp) {
        eventDate.setFullYear(currentYear + 1);
      }
      // Format date string correctly
      dateStr = eventDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      date = new Date(dateStr);

      // Format the door and end time
      const splitTime = dateTimeSplit[1].split('-');
      doorTime = splitTime[0].trim();
      endTime = splitTime[1].trim();
    }

    const header = titleElem?.textContent?.trim() ?? '';
    let bands: string[] = [];

    // Split the header to parse out the bands
    if (/presents?:?/gi.test(header)) {
      bands = header.split(/presents?:?/gi).map((s) => s.trim());
    } else if (/\sw\/\s/gi.test(header)) {
      bands = header.split(/\sw\/\s/gi).map((s) => s.trim());
    } else if (/\s[\-\–—−]\s/gi.test(header)) {
      bands = header.split(/\s[\-\–—−]\s/gi).map((s) => s.trim());
    } else if (/\sfeat\.?[a-z]+:?\s/gi.test(header)) {
      bands = header.split(/\sfeat\.?[a-z]+:?\s/gi).map((s) => s.trim());
    } else if (/\s[a-z]+:\s/gi.test(header)) {
      bands = header.split(/\s[a-z]+:\s/gi).map((s) => s.trim());
    } else {
      bands = [header];
    }

    let index = 0;
    if (bands.length > 1) index = 1;
    bands = bands[index].split(/\s*(?:[,\+&]|and)\s*/gi);

    events.push({
      url,
      date,
      doorTime,
      showTime: '',
      endTime,
      header,
      bands,
      ages: 'Check link',
      price: -1,
      genre: '',
      description: '',
      soldOut: undefined
    });
  });

  return events;
}
