-- Wipe all event data and reset to pre-event mode.
-- Run this in the Supabase SQL editor to start the event with a clean slate
-- (e.g. after testing, right before July 2).

truncate table votes cascade;
truncate table attendees cascade;
truncate table polls cascade;

update event_state
set mode = 'pre',
    banner = null,
    leaderboard_visible = false,
    active_poll_id = null,
    updated_at = now()
where id = 1;
