// @flow

import _ from 'lodash'
import format from 'date-fns/format'

const ONE_MINUTE_IN_SECONDS = 60
const ONE_HOUR_IN_SECONDS = 3600
const ONE_DAY_IN_SECONDS = 86400

export function isBlank(s: ?string): boolean {
  return _.isEmpty(_.trim(s))
}

export function friendlyFormatDuration(seconds: number): string {
  if (seconds < ONE_MINUTE_IN_SECONDS) {
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`
  } else if (seconds < ONE_HOUR_IN_SECONDS) {
    const minutes = Math.floor(seconds / ONE_MINUTE_IN_SECONDS)
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
  } else if (seconds < ONE_DAY_IN_SECONDS) {
    const hours = Math.floor(seconds / ONE_HOUR_IN_SECONDS)
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
  } else {
    const days = Math.floor(seconds / ONE_DAY_IN_SECONDS)
    return `${days} ${days === 1 ? 'day' : 'days'}`
  }
}

export function now(): string {
  return format(new Date())
}
