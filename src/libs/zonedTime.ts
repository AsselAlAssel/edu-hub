const partsIn = (utcMs: number, timeZone: string) => {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone,
		hourCycle: "h23",
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
	}).formatToParts(new Date(utcMs));
	const get = (type: Intl.DateTimeFormatPartTypes) =>
		Number(parts.find((part) => part.type === type)?.value);
	return {
		year: get("year"),
		month: get("month"),
		day: get("day"),
		hour: get("hour"),
		minute: get("minute"),
		second: get("second"),
	};
};

/** The calendar year at `date` in `timeZone`. */
export const yearIn = (date: Date, timeZone: string) =>
	partsIn(date.getTime(), timeZone).year;

/** The instant when the wall clock in `timeZone` shows this date and time. */
export function zonedDate(
	{
		year,
		month,
		day,
		hour,
		minute,
	}: { year: number; month: number; day: number; hour: number; minute: number },
	timeZone: string
) {
	const wall = Date.UTC(year, month - 1, day, hour, minute);
	const p = partsIn(wall, timeZone);
	const offset =
		Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - wall;
	return new Date(wall - offset);
}
