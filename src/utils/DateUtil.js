import moment from 'moment';

export function unixToStr(unix, format = 'MM/DD/YYYY HH:mm') {
  return moment.unix(unix).format(format);
}

export function dateToStr(date, format = 'yyyy-mm-dd') {
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const year = date.getFullYear();
  if(format === 'yyyy-mm-dd') { return `${year}-${month}-${day}`; }
  return `${month}-${day}-${year}`;
}

export function unixToHumanizedDuration(unixTime) {
  return moment.duration(unixTime).humanize();
}

export function deltaDays(date1, date2) {
  let d1 = dateToUnix(date1);
  let d2 = dateToUnix(date2);
  return Math.floor((d2 - d1) / 86400); // 86400 seconds in a day
}

export function unixToDate(dateUnix) {
  return new Date(dateUnix * 1000);
}

export function dateToUnix(date) {
  return Math.floor(date.getTime() / 1000);
}

export function nowUnix() {
  return dateToUnix(new Date());
}

export function daysToSeconds(numDays) {
  return 60 * 60 * 24 * numDays;
}

export function secondsToDays(seconds) {
  return seconds / 24 / 60 / 60;
}