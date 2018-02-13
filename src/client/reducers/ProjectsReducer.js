// @flow

import * as Immutable from 'immutable'
import {IMPORT_SUCCESS, INITIALISED, PROJECTS_FETCHED, REMOVE_TRAY, SET_TRAY_ID, TRAY_ADDED} from '../actions/Actions'
import type {Action, Project} from '../Types'

type State = Immutable.Map<string, Project>

const DEFAULT_STATE = Immutable.Map()

export function reduce(state: State = DEFAULT_STATE, action: Action) {
  switch (action.type) {
    case INITIALISED:
    case IMPORT_SUCCESS: {
      const projects = action.data.get('projects')
      return projects ? Immutable.Map(projects) : state
    }

    case TRAY_ADDED:
      return state.set(action.trayId, Immutable.Map())

    case REMOVE_TRAY:
      return state.delete(action.trayId)

    case PROJECTS_FETCHED: {
      const fetched = action.data.reduce((reduction, project) => {
        reduction[project.get('projectId')] = project.merge({isNew: true, removed: false})
        return reduction
      }, {})

      return state.update(action.trayId, (projects) => {
        return projects
          .filterNot((project) => project.get('removed'))
          .map((project) => project.merge({isNew: false, removed: true}))
          .mergeWith((previous, next) => {
            return previous.merge(next, {isNew: false, removed: false})
          }, fetched)
      })
    }

    case SET_TRAY_ID:
      return state.mapKeys((key) => key === action.originalTrayId ? action.newTrayId : key)

    default:
      return state
  }
}
