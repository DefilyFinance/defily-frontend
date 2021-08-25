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
]

export const formatDDMMMYYYYHHmm = (time) => {
  const date = new Date(time)
  const days = date.getUTCDate()
  const month = date.getUTCMonth()
  const year = date.getUTCFullYear()
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()

  return `${days < 10 ? `0${days}` : days} ${monthNames[month]} ${year} ${hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  } ${hours >= 12 ? 'PM' : 'AM'}`
}

export const formatDDMMMHHmm = (time) => {
  const date = new Date(time)
  const days = date.getUTCDate()
  const month = date.getUTCMonth()
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()

  return `${days < 10 ? `0${days}` : days} ${monthNames[month]} ${hours}:${minutes < 10 ? `0${minutes}` : minutes} ${
    hours >= 12 ? 'PM' : 'AM'
  }`
}

export const formatDDMMM = (time) => {
  const date = new Date(time)

  const days = date.getUTCDate()
  const month = date.getUTCMonth()

  return `${monthNames[month]} ${days < 10 ? `0${days}` : days}`
}

export const formatMMMDD = (time) => {
  const date = new Date(time)

  const days = date.getUTCDate()
  const month = date.getUTCMonth()

  return `${days < 10 ? `0${days}` : days} ${monthNames[month]}`
}
