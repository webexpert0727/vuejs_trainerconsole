import service from './index'

const resource = service.resource('races{/id}/runners')

export default {
  // Read
  getAll (id) {
    return resource.get({id: id}) 
  }
}