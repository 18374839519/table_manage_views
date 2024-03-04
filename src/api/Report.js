import { get } from './Request'

const getTableColumnCount = get('/baseReport/getTableColumnCount')
const getColumnReportTop10 = get('/baseReport/getColumnReportTop10')

export {
  getTableColumnCount,
  getColumnReportTop10
}
