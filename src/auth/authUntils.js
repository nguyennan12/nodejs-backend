import JWT from 'jsonwebtoken'

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, privateKey, {
      // algorithm: 'RS256',
      expiresIn: '2 days'
    })

    const refreshToken = JWT.sign(payload, privateKey, {
      // algorithm: 'RS256',
      expiresIn: '7 days'
    })

    JWT.verify(accessToken, publicKey, (error, decode) => {
      if (error) {
        console.log('error verify: ', error)
      }
      else {
        console.log('decode verify: ', decode)
      }
    })
    return { accessToken, refreshToken }
  } catch (error) {
    return error
  }
}

export {
  createTokenPair
}