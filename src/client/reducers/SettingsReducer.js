// @flow

import * as Immutable from 'immutable'
import {
  BROKEN_BUILD_SOUND_FX,
  IMPORT_SUCCESS,
  INITIALISED,
  PLAY_BROKEN_BUILD_SOUND_FX,
  REFRESH_TIME,
  SHOW_BROKEN_BUILD_TIME,
  SHOW_BUILD_LABEL,
  SHOW_TRAY_NAME
} from '../actions/Actions'
import {MIN_REFRESH_TIME} from '../actions/SettingsActionCreators'
import defaultSoundFx from '../settings/pacman_death.mp3'
import type {Action} from '../Types'

type State = Immutable.Map<string, mixed>

const DEFAULT_STATE = Immutable.Map({
  showTrayName: false,
  showBrokenBuildTime: true,
  playBrokenBuildSoundFx: false,
  brokenBuildSoundFx: defaultSoundFx,
  refreshTime: MIN_REFRESH_TIME,
  showBuildLabel: false
})

export function reduce(state: State = DEFAULT_STATE, action: Action) {
  switch (action.type) {
    case INITIALISED:
    case IMPORT_SUCCESS:
      return state.merge(action.data.get('audioVisual'))

    case SHOW_BROKEN_BUILD_TIME:
      return state.set('showBrokenBuildTime', action.value)

    case PLAY_BROKEN_BUILD_SOUND_FX:
      return state.set('playBrokenBuildSoundFx', action.value)

    case BROKEN_BUILD_SOUND_FX:
      return state.set('brokenBuildSoundFx', action.value)

    case SHOW_TRAY_NAME:
      return state.set('showTrayName', action.value)

    case REFRESH_TIME:
      return state.set('refreshTime', action.value)

    case SHOW_BUILD_LABEL:
      return state.set('showBuildLabel', action.value)

    default:
      return state
  }
}
