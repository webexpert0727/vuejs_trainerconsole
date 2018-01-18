import * as types from '../../mutation-types'

const mutations = {
  [types.GET_RACE] (state, { race }) {
    state.race = race
  },
  [types.GET_RUNNERS_BY_RACE] (state, { runners }) {
    state.runners = runners
  }
}

export default mutations
