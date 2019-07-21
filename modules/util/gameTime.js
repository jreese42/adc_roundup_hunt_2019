const config = require('../../config.json');
const startTime = new Date(config.gameStart);

let latestEventId = -1;
let nextEventTime = startTime;

module.exports = {
    // Returns time until the game starts in milliseconds, based on the start time set in config.json.
    // If the current time is past the game start, this will return 0 rather than negative milliseconds.
    timeToStart: () => {
        const now = new Date();
        return Math.max(0, startTime - now);
    },
    // Returns time until the next event (e.g. blog post) in milliseconds. If there are no more events,
    // this will return 0.
    timeToNextEvent: () => {
        const now = new Date();
        return Math.max(0, nextEventTime - now);
    },
    // Returns the ID of the most recent event or db queries to populate the blog page. If the game hasn't
    // started yet, this will return -1.
    latestEventId: () => {
        return latestEventId;
    },
    // Queries the database to update the latest event ID and next event time based on current time/game
    // start time. This will be called in a setTimeout() loop from the main app to keep the cache fresh.
    refresh: () => {
        const now = new Date();
        const gameDuration = Math.max(0, now - startTime);
        if (gameDuration === 0) {
            // Game hasn't started, no reason to hit the db
            return;
        }

        // TODO - Query should be something like:
        // `SELECT event_id, event_time FROM events WHERE event_time > ${gameDuration} ORDER BY event_id ASC LIMIT 1`
        // Basically, pull the first event -after- the current game time, and from that we can update nextEventTime
        // (startTime + the event_time column) and latestEventId (event_id - 1, assuming they're numerical and sequential).
    }
};
