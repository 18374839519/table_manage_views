import { get, post } from './Request'

const getColumnPage = post('/columns/getColumnPage')
const addColumn = post('/columns/addColumn')
const updateColumn = post('/columns/updateColumn')
const deleteColumnById = get('/columns/deleteColumnById')

export {
  getColumnPage,
  addColumn,
  updateColumn,
  deleteColumnById
}
