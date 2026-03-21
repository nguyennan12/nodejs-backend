import lodash from 'lodash'

const getInfoData = ({ fields = [], object = {} }) => {
  return lodash.pick(object, fields)
}

export {
  getInfoData
}