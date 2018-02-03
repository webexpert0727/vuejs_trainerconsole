import * as types from '../../mutation-types'

const mutations = {
  [types.GET_QUESTION_BY_RACE] (state, { question }) {
    state.question = question
  }
}

export default mutations
