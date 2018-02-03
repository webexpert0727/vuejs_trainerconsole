import * as types from '../../mutation-types'
import RaceQuestionService from '../../../services/raceQuestion'

const actions = {
  createOne ({ commit, state }, question) {
    return RaceQuestionService.createOne(question)
  }
}

export default actions
