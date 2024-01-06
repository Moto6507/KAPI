function isJsonString(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

async function objectEquals(x, y) {
  if (x === null || x === undefined || y === null || y === undefined) {
    return x === y;
  }

  if (x.constructor !== y.constructor || x instanceof Function || x instanceof RegExp || x === y || x.valueOf() === y.valueOf()) {
    return true;
  }

  if (Array.isArray(x) && x.length !== y.length) {
    return false;
  }

  if (x instanceof Date) {
    return false;
  }

  if (!(y instanceof Object)) {
    return false;
  }

  const keysX = Object.keys(x);
  const keysY = Object.keys(y);

  return keysY.every((i) => keysX.indexOf(i) !== -1) && keysX.every((i) => objectEquals(x[i], y[i]));
}

function f(d, useHours) {
  const date = new Date(d);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute && !useHours) {
    return 'less than a minute ago';
  } else if (diff < hour && !useHours) {
    const minutes = Math.floor(diff / minute);
    const plural = minutes > 1 ? 's' : '';
    return `${minutes} minute${plural} ago`;
  } else if (diff < day && !useHours) {
    const hours = Math.floor(diff / hour);
    const plural = hours > 1 ? 's' : '';
    return `${hours} hour${plural} ago`;
  } else if (diff < 2 * day && !useHours) {
    return 'yesterday';
  } else {
    d = date;
    const formattedDate =
      ('0' + d.getDate()).slice(-2) +
      '/' +
      ('0' + (d.getMonth() + 1)).slice(-2) +
      '/' +
      ('000' + d.getFullYear()).slice(-4) +
      " at " +
      new Date(new Date(d).getTime() + -3 * 3600 * 1000).toUTCString().replace(/ GMT$/, '').match(/\d\d:\d\d/);

    return formattedDate;
  }
}

function id() {
  const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  return S4() + S4() + S4();
}

export { isJsonString, objectEquals, f, id };