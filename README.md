# Welcome to the API Template created for your use by Stellar Minore LLC.

This project is based on ExpressJS, running Node. It is meant to be a quick way for you to spin up a new API repo, without having to jump through the same hoops every time. Our team decided to OpenSource this API template that we were using every time we spun up a new template so that we can help others get running as well.

## Features

This project comes with a few things setup by default including

### Sign up API end points
### Database configurations for different environments
### Linter predefined with rules
### And more!

## Swagger Documentation

This project also includes a Swagger documentation route for easy API documentation. To access it, follow these steps:

1. Start the server by running npm start in the project's root directory.
2. Open your browser and navigate to http://localhost:3000/docs.
3. You will see a Swagger UI page where you can view the API documentation and test the endpoints.
4. You can also pass a bearer token in the headers of your requests for endpoints that require authorization.

Each API endpoint includes a summary, tags, request body (if applicable), parameters (if applicable), and responses.

## Generating Private and Public Keys

To generate a private key and a public key for use in a Node.js application, follow these steps:

1. Open the terminal and navigate to the directory where you want to store the keys.

2. Use the command `openssl genrsa -out private.pem 3072` to generate a private key. This command will create a file named "private.pem" in the current directory. The number "3072" at the end of the command specifies the number of bits in the key.

3. Use the command `openssl rsa -in private.pem -pubout -out public.pem` to generate a public key from the private key. This command will create a file named "public.pem" in the current directory.

4. To use these keys in Sequelize, you will need to convert them into a single line and remove all white spaces.

You can then use the private key to sign your JWT and the public key to verify the signature.


If there are any recommended changes then please feel free to open a pull request!

Now don't just sit there looking pretty--clone this repo and get to work!
