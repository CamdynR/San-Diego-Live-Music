// script.ts

import { casbah } from './venues/casbah.ts';

let schedule = await casbah.fetchSchedule();
console.log(schedule);
