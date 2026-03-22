import lodash from 'lodash'

const getInfoData = ({ fields = [], object = {} }) => {
  return lodash.pick(object, fields)
}

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(item => [item, 1]))
}

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map(item => [item, 0]))
}

export {
  getInfoData,
  getSelectData,
  unGetSelectData
}