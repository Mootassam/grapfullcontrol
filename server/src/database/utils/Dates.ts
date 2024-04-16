export default class Dates {
  static getDate() {
    const dubaiTimezone = "Asia/Dubai";
    const options = { timeZone: dubaiTimezone };
    const currentDateTime = new Date().toLocaleString("en-US", options);

    // Get the current date in UTC format
    const utcDateTime = new Date(currentDateTime).toISOString();
    return utcDateTime;
  }
}
