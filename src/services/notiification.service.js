import notificationModel from '#models/notification.model.js'

const pushNotiToSytem = async ({ type = 'SHOP-001', receivedId, senderId, option = {} }) => {
  let noti_content
  if (type === 'SHOP-001') {
    noti_content = '@@@ vừa mới thêm 1 sản phẩm'
  }

  const newNoti = await notificationModel.create({
    noti_type: type,
    noti_content,
    noti_receivedId: receivedId,
    noti_options: option,
    noti_senderId: senderId
  })
  return newNoti
}

const listNotiByUser = async ({ userId, type = 'ALL', isRead = 0 }) => {
  const match = { noti_receivedId: Number(userId) }
  if (type !== 'ALL') {
    match['noti_type'] = type
  }
  return await notificationModel.aggregate([
    {
      $match: match
    },
    {
      $project: {
        noti_type: 1,
        noti_senderId: 1,
        noti_receivedId: 1,
        noti_content: 1,
        noti_options: 1
      }
    }
  ])

}

export default {
  pushNotiToSytem,
  listNotiByUser
}