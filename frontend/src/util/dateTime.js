export const removeLocalTZ = (value) => {
  const date = new Date(value);
  date.setHours(date.getHours() + date.getTimezoneOffset() / 60);
  return date;
};

export const formattedDate = (date) => {
  const formatDate = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
  return formatDate;
};

export const splitDate = (dateObj) => {

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const date = new Date(dateObj);
  const [month, monthIndex, day, year] = [
    monthNames[date.getUTCMonth()],
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCFullYear(),
  ];
  const dateSummary = `${month} ${day}, ${year}`;
  return { monthIndex, month, day, year, dateSummary};
};
