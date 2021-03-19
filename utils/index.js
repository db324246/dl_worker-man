export const stringify = (data) => {
  if (typeof data === 'string') return data
  else return JSON.stringify(data)
}

export const parse = (str) => {
  if (typeof str !== 'string') return str
  else return JSON.parse(str || '[]')
}

export const timeParse = (date, format = '{y}-{m}-{d} {h}:{i}') => {
  const _date = date || new Date();
  const formatObj = {
    y: _date.getFullYear(),
    m: _date.getMonth() + 1,
    d: _date.getDate(),
    h: _date.getHours(),
    i: _date.getMinutes(),
    s: _date.getSeconds(),
    a: _date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })

  return time_str
}

export const queryObj = obj => {
  const del = []
  for (const key in obj) {
    if (obj[key] === undefined || obj[key] === null) del.push(key)
  }
  del.forEach(k => Reflect.deleteProperty(obj, k))
  return obj
}

export const defined = (val) => {
  return val !== undefined && val !== null
}
