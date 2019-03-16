/**
 * Get declension for number
 * @param number number
 * @param titles number, <one, two, few>
 */
export function declOfNum(number: number, titles: Array<string>) {  
  const cases = [2, 0, 1, 1, 1, 2];  
  return titles[ (number%100>4 && number%100<20) ? 2 : cases[(number%10<5)?number%10:5] ];
}
/**
 * Get formatted string for time
 * @param seconds number
 */
export function getNormalizedTime(seconds: number): string {
  const time = {
    hours: Math.floor(seconds / 60 / 60),
    mins:Math.floor((seconds / 60) % 60),
    secs: seconds % 60
  };
  let formattedTime = '';

  if (time.hours) {
    formattedTime += `${time.hours} ${declOfNum(time.hours, ['час', 'часа', 'часов'])} `;
  }

  if (time.mins) {
    formattedTime += `${time.mins} ${declOfNum(time.mins, ['минуту', 'минуты', 'минут'])} `;
  }

  if (time.secs) {
    formattedTime += `${time.secs} ${declOfNum(time.secs, ['секунду', 'секунды', 'секунд'])} `;
  }

  return formattedTime;
};

export function declensionContinuePast(type: string) {
  if (type === 'ревью') {
    return 'длилось';
  }

  if (type === 'стендап') {
    return 'длился';
  }

  if (type === 'разработка') {
    return 'длилась';
  }

  if (type === 'встреча') {
    return 'длилась';
  }

  return 'длилась';
}