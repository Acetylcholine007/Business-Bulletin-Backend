# Business Bulletin Backend

## Overview
Node-Express implementation of business finder web server deployed in Heroku.

## Usage
- Run `npm install` to install dependencies
- Create `nodemon.json` in root folder with the following structure <br>
`{`<br/>
`"env": {`<br/>
` "PORT": 8000,`<br/>
` "MONGO_USER": "Your mongoDB Atlas user",`<br/>
` "MONGO_PASSWORD": "Your mongoDB Atlas password",`<br/>
` "MONGO_DEFAULT_DATABASE": "Your mongoDB Atlas database name",`<br/>
` "SECRET_KEY": "Your secret key",`<br/>
` "TOKEN_EXPIRATION": "Your token expiration",`<br/>
` "GMAIL_EMAIL": "Your gmail email",`<br/>
` "GMAIL_PASSWORD": "Your gmail password",`<br/>
` "SERVER_URL": "Server URL",`<br/>
` "WEBAPP_URL": "Web app URL"`<br/>
`}`<br/>
`}`<br/>
- Run `npm start:dev` to start local server

## API Endpoints

### Authentication-related endpoints

- POST /auth/signup

  - **Usage:** For business owner/practitioner registration
  - **Headers:** None
  - **Request Body:** `{firstname: String, lastname: String, email: String, password: String, contactNo: String, profileUri: String}`
  - **Response:** `{message: String}`
  - **Query parameters:** None
  - **Accessibility:** Public

- POST /auth/login

  - **Usage:** For business owner/practitioner or admin login
  - **Headers:** None
  - **Request Body:** `{email: String, password: String}`
  - **Response:** `{message: String, data: {token: String, userId: String, firstname: String, lastname: String, contactNo: String, email: String, accountType: String}}`
  - **Query parameters:** None
  - **Accessibility:** Public

- GET /verify/:verificationToken (SSR-related endpoint)

  - **Usage:** For verifying attached token in verification link
  - **Headers:** None
  - **Request Body:** None
  - **Response:** HTML Template
  - **Query parameters:** None
  - **Accessibility:** Public

- GET /resetPasswordForm/:uid (SSR-related endpoint)

  - **Usage:** For reseting user password
  - **Headers:** None
  - **Request Body:** `{newPassword: String, confirmPassword: String}`
  - **Response:** HTML Template
  - **Query parameters:** None
  - **Accessibility:** Public

- POST /resetPassword/:uid (SSR-related endpoint)

  - **Usage:** For serving Password reset form
  - **Headers:** None
  - **Request Body:** None
  - **Response:** HTML Template
  - **Query parameters:** None
  - **Accessibility:** Public

- POST /sendResetPassword

  - **Usage:** For requesting password reset form to email
  - **Headers:** None
  - **Request Body:** `{email: String}`
  - **Response:** `{message: String}`
  - **Query parameters:** None
  - **Accessibility:** Public

- POST /sendVerification

  - **Usage:** For requesting verification link to email
  - **Headers:** None
  - **Request Body:** `{email: String}`
  - **Response:** `{message: String}`
  - **Query parameters:** None
  - **Accessibility:** Public

### User-related endpoints

- GET /users

  - **Usage:** For retrieving list of Users
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** None
  - **Response:** `{message: String, users: [User], totalItems: Number}`
  - **Query parameters:** `query`, `page`, and `queryTarget`
  - **Accessibility:** Admin

- GET /users/:userId

  - **Usage:** For retrieving sepecific User
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** None
  - **Response:** `{message: String, users: User}`
  - **Query parameters:** None
  - **Accessibility:** Admin and User (Owner)

- PATCH /users/changePassword/:userId

  - **Usage:** For changing user password
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** `{password: String}`
  - **Response:** `{message: String}`
  - **Query parameters:** None
  - **Accessibility:** User (Owner)

- PATCH /users/allowUser/:userId

  - **Usage:** For allowing or banning user
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** `{status: Boolean}`
  - **Response:** `{message: String, user: User}`
  - **Query parameters:** None
  - **Accessibility:** Admin

- PATCH /users/:userId

  - **Usage:** For changing user information
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** `{firstname: String, lastname: String, contactNo: String, profileUri: String}`
  - **Response:** `{message: String, user: User}`
  - **Query parameters:** None
  - **Accessibility:** User (Owner)

- DELETE /users/:userId

  - **Usage:** For deleting user
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** None
  - **Response:** `{message: String}`
  - **Query parameters:** None
  - **Accessibility:** User (Owner)

### Business-related endpoints

- GET /businesses

  - **Usage:** For retrieving list of Businesses
  - **Headers:** None
  - **Request Body:** None
  - **Response:** `{message: String, businesses: [Business], totalItems: Number}`
  - **Query parameters:** `query`, `page`, and `queryTarget`
  - **Accessibility:** Public

- GET /businesses/user/:userId

  - **Usage:** For retrieving list of User businesses
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** None
  - **Response:** `{message: String, businesses: [Business], totalItems: Number}`
  - **Query parameters:** `query`, `page`, and `queryTarget`
  - **Accessibility:** User (Owner)

- GET /businesses/:businessId

  - **Usage:** For retrieving sepecific Business
  - **Headers:** None
  - **Request Body:** None
  - **Response:** `{message: String, business: Business}`
  - **Query parameters:** None
  - **Accessibility:** Public

- POST /businesses

  - **Usage:** For creating business
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** `{name: String, description: String, address: String, contactNo: String, tags: [Tag._id], coordinates: {lat: Number, lng: Number}, logoUri: String, bannerUri: String, credentials: [String], products: [Products], services: [Services]}`
  - **Response:** `{message: String, business: Business}`
  - **Query parameters:** None
  - **Accessibility:** Users

- PATCH /businesses/verifyBusiness/:businessId

  - **Usage:** For verifying or unverifying business
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** `{isVerified: Boolean}`
  - **Response:** `{message: String, business: Business}`
  - **Query parameters:** None
  - **Accessibility:** Admin

- PATCH /businesses/allowBusiness/:businessId

  - **Usage:** For allowing or banning business
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** `{status: Boolean}`
  - **Response:** `{message: String, business: Business}`
  - **Query parameters:** None
  - **Accessibility:** Admin

- PATCH /businesses/:businessId

  - **Usage:** For editing business
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** `{name: String, description: String, address: String, contactNo: String, tags: [Tag._id], lat: Number, lng: Number, logoUri: String, bannerUri: String, credentials: [String]}`
  - **Response:** `{message: String, business: Business}`
  - **Query parameters:** None
  - **Accessibility:** User (Owner)

- DELETE /businesses/:businessId

  - **Usage:** For deleting business
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** None
  - **Response:** `{message: String}`
  - **Query parameters:** None
  - **Accessibility:** User (Owner)

### Product-related endpoints

- GET /products

  - **Usage:** For retrieving list of Products
  - **Headers:** None
  - **Request Body:** None
  - **Response:** `{message: String, products: [Product], totalItems: Number}`
  - **Query parameters:** `query` and `page`
  - **Accessibility:** Public

- GET /products/:productId

  - **Usage:** For retrieving sepecific Product
  - **Headers:** None
  - **Request Body:** None
  - **Response:** `{message: String, product: Product}`
  - **Query parameters:** None
  - **Accessibility:** Public

- POST /products

  - **Usage:** For creating product
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** `{businessId: String, name: String, description: String, price: Number, imagesUri: [String]}`
  - **Response:** `{message: String, product: Product}`
  - **Query parameters:** None
  - **Accessibility:** User (Owner)

- PATCH /products/:productId

  - **Usage:** For editing product
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** `{businessId: String, name: String, description: String, price: Number, imagesUri: [String]}`
  - **Response:** `{message: String, product: Product}`
  - **Query parameters:** None
  - **Accessibility:** User (Owner)

- DELETE /products/:productId

  - **Usage:** For deleting product
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** None
  - **Response:** `{message: String}`
  - **Query parameters:** None
  - **Accessibility:** User (Owner)

### Service-related endpoints

- GET /services

  - **Usage:** For retrieving list of Services
  - **Headers:** None
  - **Request Body:** None
  - **Response:** `{message: String, services: [Service], totalItems: Number}`
  - **Query parameters:** `query` and `page
  - **Accessibility:** Public

- GET /services/:serviceId

  - **Usage:** For retrieving sepecific Service
  - **Headers:** None
  - **Request Body:** None
  - **Response:** `{message: String, service: Service}`
  - **Query parameters:** None
  - **Accessibility:** Public

- POST /services

  - **Usage:** For creating service
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** `{businessId: String, name: String, description: String, price: Number, imagesUri: [String]}`
  - **Response:** `{message: String, service: Service}`
  - **Query parameters:** None
  - **Accessibility:** User (Owner)

- PATCH /services/:serviceId

  - **Usage:** For editing service
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** `{businessId: String, name: String, description: String, price: Number, imagesUri: [String]}`
  - **Response:** `{message: String, service: Service}`
  - **Query parameters:** None
  - **Accessibility:** User (Owner)

- DELETE /services/:serviceId

  - **Usage:** For deleting service
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** None
  - **Response:** `{message: String}`
  - **Query parameters:** None
  - **Accessibility:** User (Owner)

### Tag-related endpoints

- GET /tags

  - **Usage:** For retrieving list of Tags
  - **Headers:** None
  - **Request Body:** None
  - **Response:** `{message: String, tags: [Tag]}`
  - **Query parameters:** None
  - **Accessibility:** Public

- GET /tags/:tagId

  - **Usage:** For retrieving sepecific Tag
  - **Headers:** None
  - **Request Body:** None
  - **Response:** `{message: String, tag: Tag}`
  - **Query parameters:** None
  - **Accessibility:** Public

- POST /tags

  - **Usage:** For creating tag
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** `{name: String}`
  - **Response:** `{message: String, tag: Tag}`
  - **Query parameters:** None
  - **Accessibility:** Admin

- PATCH /tags/:tagId

  - **Usage:** For editing tag
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** `{name: String}`
  - **Response:** `{message: String, tag: Tag}`
  - **Query parameters:** None
  - **Accessibility:** Admin

- DELETE /tags/:tagId

  - **Usage:** For deleting tag
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** None
  - **Response:** `{message: String}`
  - **Query parameters:** None
  - **Accessibility:** Admin

## Entities and Schema

- User<br/>
  `{`<br/>
  ` firstname: [String, NN],`<br/>
  ` lastname: [String, NN],`<br/>
  ` email: [String, NN, UQ],`<br/>
  ` password: [String, NN],`<br/>
  ` contactNo: [String, NN],`<br/>
  ` role: [Number, NN, Default = 1],`<br/>
  ` isVerified: [Boolean, NN, Default = false],`<br/>
  ` status: [Boolean, NN, Default = true],`<br/>
  ` profileUri: [String],`<br/>
  ` businesses: [Array of Business._id, FK],`<br/>
  ` createdAt: [String, NN],`<br/>
  ` modifiedAt: [String, NN]`<br/>
  `}`<br/>

- Business<br/>
  `{`<br/>
  ` name: [String, NN],`<br/>
  ` description: [String, NN],`<br/>
  ` address: [String, NN, UQ],`<br/>
  ` contactNo: [String, NN],`<br/>
  ` owner: [User._id, NN, FK],`<br/>
  ` isVerified: [Boolean, NN, Default = false],`<br/>
  ` status: [Boolean, NN, Default = true],`<br/>
  ` products: [Array of Product._id, FK],`<br/>
  ` services: [Array of Service._id, FK],`<br/>
  ` tags: [Array of Tag._id, FK],`<br/>
  ` coordinates: {`<br/>
  `   lat: [Number],`<br/>
  `   lng: [Number],`<br/>
  ` },`<br/>
  ` logoUri: [String],`<br/>
  ` bannerUri: [String],`<br/>
  ` credentials: [Array of String],`<br/>
  ` createdAt: [String, NN],`<br/>
  ` modifiedAt: [String, NN]`<br/>
  `}`<br/>

- Product<br/>
  `{`<br/>
  ` name: [String, NN],`<br/>
  ` description: [String, NN],`<br/>
  ` price: [Number, NN],`<br/>
  ` imagesUri: [Array of String],`<br/>
  ` business: [Business._id, NN, FK],`<br/>
  ` createdAt: [String, NN],`<br/>
  ` modifiedAt: [String, NN]`<br/>
  `}`<br/>

- Service<br/>
  `{`<br/>
  ` name: [String, NN],`<br/>
  ` description: [String, NN],`<br/>
  ` price: [Number, NN],`<br/>
  ` imagesUri: [Array of String],`<br/>
  ` business: [Business._id, NN, FK],`<br/>
  ` createdAt: [String, NN],`<br/>
  ` modifiedAt: [String, NN]`<br/>
  `}`<br/>

- Tag<br/>
  `{`<br/>
  ` name: [String, NN]`<br/>
  `}`<br/>
