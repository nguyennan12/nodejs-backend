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

const removeUndefinedObject = obj => {
  Object.keys(obj).forEach(key => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key]
    }
  })
  return obj
}

const updateNestedObjectParser = obj => {
  const final = {}
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const response = updateNestedObjectParser(obj[key])
      Object.keys(response).forEach(childKey => {
        final[`${key}.${childKey}`] = response[childKey]
      })

    } else {
      final[key] = obj[key]
    }
  })
  return final
}

export {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParser
}