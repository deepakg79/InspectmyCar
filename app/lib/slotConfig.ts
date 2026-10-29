/**
 * Inspection slots and time-based availability helpers.
 *
 * All comparisons use the India business timezone (Asia/Kolkata).
 * A slot is considered past once its scheduled start time has arrived.
 */

export const ALL_SLOTS = [
    "7:30 AM",
    "9:00 AM",
    "10:30 AM",
    "12:00 PM",
    "1:30 PM",
    "3:00 PM",
    "4:30 PM",
    "6:00 PM",
    "7:30 PM",
];

type IndiaDateTimeParts = {
    year: string;
    month: string;
    day: string;
    hour: string;
    minute: string;
};

const getIndiaDateTimeParts = (date: Date = new Date()): IndiaDateTimeParts => {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).formatToParts(date);

    const get = (type: string) =>
        parts.find((part) => part.type === type)?.value ?? "";

    return {
        year: get("year"),
        month: get("month"),
        day: get("day"),
        hour: get("hour"),
        minute: get("minute"),
    };
};

/** Return the current India date as YYYY-MM-DD. */
export const getIndiaDateKey = (date: Date = new Date()): string => {
    const parts = getIndiaDateTimeParts(date);
    return `${parts.year}-${parts.month}-${parts.day}`;
};

/**
 * Returns true if the date is in the past, or if the slot's start time
 * has passed on the current India date. Future dates are not time-blocked.
 */
export const isPastSlot = (
    bookingDate: string,
    slot: string,
    now: Date = new Date(),
): boolean => {
    const date = bookingDate.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;

    const today = getIndiaDateKey(now);

    if (date < today) return true;
    if (date > today) return false;

    const match = slot.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return false;

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const period = match[3].toUpperCase();

    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
        return false;
    }

    if (period === "AM" && hours === 12) hours = 0;
    if (period === "PM" && hours !== 12) hours += 12;

    const slotMinutes = hours * 60 + minutes;
    const parts = getIndiaDateTimeParts(now);
    const currentMinutes = Number(parts.hour) * 60 + Number(parts.minute);

    // At the exact slot start minute, the slot is no longer bookable.
    return slotMinutes <= currentMinutes;
};
