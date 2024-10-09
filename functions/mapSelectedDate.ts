export const mapSelectedDate = (
  selectedDates: { start: string; end: string },
  currentPrice: { weekends_price: string; weekdays_price: string }
) => {
  const price = toValue(currentPrice);
  let selectedDate = toValue(selectedDates);
  const weekdaysPrice = parseInt(price.weekdays_price);
  const weekendsPrice = parseInt(price.weekends_price);
  let res = {};

  for (const key in selectedDate) {
    res[key] = selectedDate[key].toString();
  }

  const start = new Date(selectedDate.start);
  const end = new Date(selectedDate.end);

  const month = start.getMonth() + 1;
  const fullYear = start.getFullYear();
  const filterDate = `${fullYear}-${month < 10 ? "0" + month : month}`;

  let daysArray = [];
  let daysCount = (end.getTime() - start.getTime()) / 1000 / 60 / 60 / 24 || 1;
  let day = start.getDay();
  res.daysCount = daysCount;
  while (daysCount > 0) {
    if (day < 7) {
      daysArray.push(day);
    } else {
      day = 0;
      daysArray.push(day);
    }
    daysCount--;
    day++;
  }
  const saturday = 6;
  const sunday = 0;

  res.total_price = daysArray.reduce((prev, curr) => {
    if (saturday === curr || sunday === curr) {
      return prev + weekendsPrice;
    } else {
      return prev + weekdaysPrice;
    }
  }, 0);

  res.days = daysArray;
  res.filter_date = filterDate;
  return res;
};
