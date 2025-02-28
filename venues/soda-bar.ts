// soda-bar.ts

import { Venue, Show } from '../Venue.ts';

const X_API_KEY = '7eKoPj5BJI5D83snVEQ9S5uHj4SO9j07aw5qh3VR';

export const sodaBar: Venue = {
  name: 'Soda Bar',
  url: `https://partners-endpoint.dice.fm/api/v2/events?page%5Bsize%5D=24&types=linkout%2Cevent&filter%5Bvenues%5D%5B%5D=brick+by+brick&filter%5Bvenues%5D%5B%5D=kensington+club&filter%5Bvenues%5D%5B%5D=ken+club&filter%5Bvenues%5D%5B%5D=house+of+blues+voodoo+room&filter%5Bvenues%5D%5B%5D=voodoo+room&filter%5Bvenues%5D%5B%5D=house+of+blues&filter%5Bvenues%5D%5B%5D=soda+bar&filter%5Bvenues%5D%5B%5D=soma&filter%5Bvenues%5D%5B%5D=SOMA&filter%5Bvenues%5D%5B%5D=SOMA+San+Diego&filter%5Bvenues%5D%5B%5D=SOMA+Mainstage&filter%5Bvenues%5D%5B%5D=soma+sidestage&filter%5Bvenues%5D%5B%5D=casbah&filter%5Bvenues%5D%5B%5D=the+casbah&filter%5Bvenues%5D%5B%5D=belly+up&filter%5Bvenues%5D%5B%5D=music+box&filter%5Bvenues%5D%5B%5D=observatory+north+park&filter%5Bvenues%5D%5B%5D=the+observatory+north+park&filter%5Bvenues%5D%5B%5D=observatory&filter%5Bvenues%5D%5B%5D=whistle+stop&filter%5Bvenues%5D%5B%5D=che+cafe&filter%5Bvenues%5D%5B%5D=quartyard&filter%5Bvenues%5D%5B%5D=the+merrow&filter%5Bvenues%5D%5B%5D=til-two+club&filter%5Bvenues%5D%5B%5D=til+two+club&filter%5Bvenues%5D%5B%5D=the+loft&filter%5Bvenues%5D%5B%5D=The+Loft+%40+UC+San+Diego&filter%5Bvenues%5D%5B%5D=the+loft+ucsd&filter%5Bvenues%5D%5B%5D=the+sound&filter%5Bvenues%5D%5B%5D=lou+lou%27s&filter%5Bvenues%5D%5B%5D=Lou+Lou%27s+Jungle+Room&filter%5Bpromoters%5D%5B%5D=Big+Soda+LLC+DBA+Soda+Bar`,
  fetchSchedule: async () => {
    const events: Show[] = [];

    const response = await fetch(sodaBar.url, {
      headers: {
        'X-Api-Key': X_API_KEY,
      },
    });
    const data = await response.json();
    if (!Array.isArray(data) || data.length == 0) return events;

    data.forEach((event) => {
      console.log(event);
      // TODO
    });

    return events;
  },
};
