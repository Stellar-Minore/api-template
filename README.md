# Welcome to the API Template created for your use by Stellar Minore LLC.

This project is based on ExpressJS, running Node. It is meant to be a quick way for you to spin up a new API repo, without having to jump through the same hoops every time. Our team decided to OpenSource this API template that we were using every time we spun up a new template so that we can help others get running as well.

## Features

This project comes with a few things setup by default including

### Sign up API end points
### Database configurations for different environments
### Linter predefined with rules
### And more!

## App Environment
Node: 24

## Generating Private and Public Keys

To generate a private key and a public key for use in a Node.js application, follow these steps:

1. Open the terminal and navigate to the directory where you want to store the keys.

2. Use the command `openssl genrsa -out private.pem 3072` to generate a private key. This command will create a file named "private.pem" in the current directory. The number "3072" at the end of the command specifies the number of bits in the key.

3. Use the command `openssl rsa -in private.pem -pubout -out public.pem` to generate a public key from the private key. This command will create a file named "public.pem" in the current directory.

4. To convert the key to a single line, you can use the command `tr -d '\n' < private.pem > private_singleline.pem` for private key and `tr -d '\n' < public.pem > public_singleline.pem` for public key

5. Then, you can remove all white spaces by using `sed 's/ //g' private_singleline.pem` for private key and `sed 's/ //g' public_singleline.pem` for public key

Note: 
- The above commands are for *nix systems, You can use `type private.pem` and `(get-content private.pem) -join ""` for windows systems
- Also the key size can be adjusted as per the requirement 

You can then use the private key to sign your JWT and the public key to verify the signature.


If there are any recommended changes then please feel free to open a pull request!

Now don't just sit there looking pretty--clone this repo and get to work!
