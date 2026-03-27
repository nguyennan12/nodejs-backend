         ======== SIGNUP =========
    1 - check exitst in database
    2 - hash password (bcrypt)
    3 - create user and check create success
    4 – create keyPair (publicKey, privateKey) and save (crypto)
    5 - generate tokens (userId, publicKey, privateKey) → (AT, RT) 
    6 – create tokenPair (AT, RT) from tokens (sign with privateKey) save in DB
    7 - return  data (info user, tokens)
   	
   
        ======== LOGIN =========
    1 - check user by email in db
    2 - match password
    3 – create keyPair (publicKey, privateKey) and save (crypto)
    4 - generate tokens (userId, publicKey, privateKey) → (AT, RT)
    5 – update tokenPair (AT, RT) from tokens (sign with privateKey) save in DB
    6 - return  data (info user, tokens)


        ======== AUTHENTICATION =========
    1 - check userId missing get from HEADER
    2 - get and check accessToken get from HEADER
    3 – find keyStore of user by Id → (AT, RT, PubK, PriK)
    4 - verify token (pubKey)
    5 - check user match userDecoded
    6 - check keyStore with this userId
    7 – gui req(keyStore) and return next()


         ======== LOGOUT =========
    1 – check exists  keyStore
    2 – remove keyStore


         ======== REFRESH TOKEN =========
    1 - check token used or using
    2 – if used → verify RT → userId → removeTokens by userId
    3 – if using → find and verify tokens → email → check userExits by email
    4 – generate tokens (userId, publicKey, privateKey) → (AT, RT)
    5 – update and save RT and add RT into RTused
    6 - return  data (info user, tokens)

      ======== DISCOUND SERVICE =========
     1 - Generator and delete discount code (admin/shop)
     2 - get discount amount (user)
     3 - get all discount code (user, shop)
     4 - verify and cancel discount code (user)

       ======== CARD SERVICE (User) =========
     1 - add product to cart
     2 - reduce product quantity
     3 - increase product quantity
     4 - get list cart
     5 - delete list cart
     6 - delete item in cart

     update: 
          shop_order_ids: [
               {
                    shopId,
                    item_products: [{
                         quantity, price, shopId, productId, oldquantity,
                    }],
                    version
               }
          ]

     ======== CHECKOUT SERVICE (User) =========
     
     {
          cartId,
          userId, 
          shop_order_ids: [
               {
                    shopId,
                    shop_discount: [{shopId, discountId, codeId}],
                    item products: [{price, quantity, productId}]
               }
          ]
     }
