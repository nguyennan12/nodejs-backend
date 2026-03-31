import ApiError from '#core/error.response.js'
import resourceModel from '#models/resource.model.js'
import roleModel from '#models/role.model.js'
import { StatusCodes } from 'http-status-codes'

const createResource = async ({ name = 'profile', slug = 'p000101', description = '' }) => {
  if (!name && !slug) throw new ApiError(StatusCodes.BAD_REQUEST, 'something went wrong')
  const resource = await resourceModel.create({ src_name: name, src_slug: slug, src_description: description })
  return resource
}

//userId = 0 admin
const resourceList = async ({ userId = 0, limit = 30, offset = 0, search = '' }) => {
  //check amin ? middleware function

  const resources = await resourceModel.aggregate([{
    $project: {
      _id: 0,
      name: '$src_name',
      slug: '$src_slug',
      description: '$src_description',
      resourceId: '$_id',
      createAt: 1
    }
  }])
  return resources
}
const createRole = async (
  { name = 'profile',
    slug = 's00001',
    description = 'extend from shop or user',
    grants = [] }
) => {
  //check role exists

  const role = await roleModel.create({
    role_name: name,
    role_slug: slug,
    role_description: description,
    role_grants: grants
  })
  return role
}
const roleList = async ({ userId = 0, limit = 30, offset = 0, search = '' }) => {
  //userId

  //list roles
  const roles = await roleModel.aggregate([
    {
      $unwind: '$role_grants'
    },
    {
      $lookup: {
        from: 'Resources ',
        localField: 'role_grants.resource',
        foreignField: '_id',
        as: 'resource'
      }
    },
    {
      $unwind: '$resource'
    },
    {
      $project: {
        role: '$role_name',
        resource: '$resource.src_name',
        action: '$role_grants.actions',
        attributes: '$role_grants.attributes'
      }
    },
    {
      $unwind: '$action'
    },
    {
      $project: {
        _id: 0,
        role: 1,
        resource: 1,
        action: '$action',
        attributes: 1
      }
    }
  ])
  return roles
}

export default {
  createResource,
  createRole,
  roleList,
  resourceList
}