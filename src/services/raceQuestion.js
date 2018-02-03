import service from './index'

const resource = service.resource('race-questions{/id}')


export default {
  createOne (question) {
    return resource.save({}, question)
  }
}

