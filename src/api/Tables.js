import { get, post } from './Request'

const getTablesPage = post('/tables/getTablesPage')
const delTableById = get('/tables/delTableById')
const updateTable = post('/tables/updateTable')
const createTable = post('/dbOp/createTable')

const getTableDetail = get('/tables/getTableDetail')

const createTableColumn = post('/dbOp/createTableColumn')
const delTableColumn = get('/dbOp/delTableColumn')
const getTableDdl = get('/dbOp/getTableDdl')
const getTableDml = get('/dbOp/getTableDml')

export {
  getTablesPage,
  delTableById,
  updateTable,
  createTable,
  getTableDetail,
  createTableColumn,
  delTableColumn,
  getTableDdl,
  getTableDml
}
