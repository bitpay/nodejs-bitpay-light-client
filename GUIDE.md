## Using the BitPay NodeJS Light client

This SDK provides a convenient abstraction of BitPay's [cryptographically-secure API](https://bitpay.com/api) and allows payment gateway developers to focus on payment flow/e-commerce integration rather than on the specific details of client-server interaction using the API.  This SDK optionally provides the flexibility for developers to have control over important details, including the handling of private keys needed for client-server communication.

It also implements BitPay's remote client authentication and authorization strategy.  No private or shared-secret information is ever transmitted over the wire.

### Dependencies

You must have a BitPay merchant account to use this SDK.  It's free to [sign-up for a BitPay merchant account](https://bitpay.com/start).

If you need a test account, please visit https://test.bitpay.com/dashboard/signup and register for a BitPay merchant test account. Please fill in all questions, so you get a fully working test account.
If you are looking for a testnet bitcoin wallet to test with, please visit https://bitpay.com/wallet and
create a new wallet.
If you need testnet bitcoin please visit a testnet faucet, e.g. https://testnet.coinfaucet.eu/en/ or http://tpfaucet.appspot.com/

For more information about testing, please see https://bitpay.com/docs/testing

### Getting your client token

First of all, you need to generate a new POS token on your BitPay's account which will be required to securely connect to the BitPay's API.

For testing purposes use:
https://test.bitpay.com/dashboard/merchant/api-tokens

For production use:
https://bitpay.com/dashboard/merchant/api-tokens

Click on 'Add New Token', give a name on the Token Label input, leave the 'Require Authentication' checkbox unchecked and click on 'Add Token'. The new token will appear and ready to use.

### Usage

This library was built and tested using the Intellij IDE; the source code tree is directly compatible with Other NodeJS IDEs.
Library dependencies can be downloaded by executing the following command at the root of the library:

```node
// Using YARN.

yarn add bitpay-sdk

// Using NPM

npm install bitpay-sdk
        
```

### Initializing your BitPay client

Once you have the environment file (JSON previously generated) you can initialize the client on two different ways:

```node
// Provide the full path to the env file which you have previously stored securely.

const {Client, Env, Currency, Models, Tokens} = require('bitpay-sdk');

let client = new Client(configFilePath);
        
```

```node
// Initialize with separate variables.

const {Client, Env, Currency, Models, Tokens} = require('bitpay-sdk');

let token = 'AdsBgKAHzQTE8geuC3jg4TPivcbLsiic69SAsZSoKSWk';

let client = new Client(Env.Test, token);
```

### Create an invoice

```node
let invoiceData = new Models.Invoice(50, Currencies.USD);

const invoice = await client.CreateInvoice(invoiceData);

let invoiceUrl = invoice.url;

let status = invoice.status;
```

### Retrieve an invoice

```node
let invoice = await client.GetInvoice(invoice.id);
```

### Get exchange Rates

You can retrieve BitPay's [BBB exchange rates](https://bitpay.com/exchange-rates).

```node
let rates = client.GetRates();

let rate = rates.client(Currencies.USD);
```
See also the test package for more secure of API calls.
