import { AccessControl } from 'accesscontrol'

// let grantList = [
//   { role: 'admin', resource: 'profile', action: 'read:any', attributes: '*, !views' },
//   { role: 'admin', resource: 'profile', action: 'update:any', attributes: '*, !views' },
//   { role: 'admin', resource: 'profile', action: 'delete:any', attributes: '*, !views' },
//   { role: 'admin', resource: 'balance', action: 'read:any', attributes: '*, !views' },

//   { role: 'shop', resource: 'profile', action: 'read:own', attributes: '*' }
// ]

export default new AccessControl()