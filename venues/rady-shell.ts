// rady-shell.ts

import { Venue, Show, JSDOM } from '../Venue.ts';

export const radyShell: Venue = {
  name: 'The Rady Shell',
  url: 'https://www.theshell.org/performances/rady-shell-calendar/',
  fetchSchedule: async () => [],
};
