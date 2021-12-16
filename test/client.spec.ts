import {Env,} from "../src";
import {Buyer} from "../src/Model/Invoice/Buyer";
import {BillItem} from "../src/Model";

const BitPaySDK = require('../src/index');
const InvoiceStatus = BitPaySDK.InvoiceStatus;
const Currencies = BitPaySDK.Currency;

let client;

describe('BitPaySDK.Client', () => {
    beforeAll(() => {
        jest.setTimeout(20000); // browser takes a while
        
        let env = Env.Test;
        let token = 'D1puRMRi7iqwCLkxKmgxASQeEYg8MSDuRP3f2zAL6PdW';

        client = new BitPaySDK.Client(env, token);
    });

    describe('Rates', () => {
        it('should get rates', async () => {
            const results = await client.GetRates();

            expect(results[0].rate).toBeDefined();
        });

        it('should update rates', async () => {
            let Rates = new BitPaySDK.Models.Rates(await client.GetRates(), client);
            await Rates.Update();
            let newRates = await Rates.GetRates();

            expect(newRates[0].rate).toBeDefined();
        });

        it('should get rates EUR', async () => {
            const Rates = await client.GetRates(Currencies.EUR);

            expect(Rates).toBeDefined();
        });
    });

    describe('Currencies', () => {
        it('should get currencies', async () => {
            const results = await client.GetCurrencies();

            expect(results[0].code).toBeDefined();
        });
    });

    describe('Invoices', () => {
        let buyer = new Buyer();
        buyer.email = "sandbox@bitpay.com";
        buyer.name = "BuyerTest";
        let invoiceData = new BitPaySDK.Models.Invoice(6.02, Currencies.USD);
        invoiceData.buyer = buyer;
        invoiceData.notificationURL = "https://hookb.in/1gw8aQxYQDHj002yk79K";
        invoiceData.extendedNotifications = true;
        let invoice;
        let retrievedInvoice;

        it('should create invoice', async () => {
            invoice = await client.CreateInvoice(invoiceData);
            console.log(invoice);

            expect(invoice).toBeDefined();
        });

        it('should retrieve invoice', async () => {
            invoice = await client.CreateInvoice(invoiceData);
            retrievedInvoice = await client.GetInvoice(invoice.id);

            expect(retrievedInvoice).toBeDefined();
        });
    });

    describe('Bills', () => {
        let basicBillUsd;
        let basicBillEur;
        let retrievedBill;
        let updatedBill;
        let deliveredBill;

        let items = [];
        let item = new BillItem();
        item.price = 30;
        item.quantity = 9;
        item.description = "product-a";
        items.push(item);

        item.price = 13.7;
        item.quantity = 18;
        item.description = "product-b";
        items.push(item);

        item.price = 2.1;
        item.quantity = 43;
        item.description = "product-c";
        items.push(item);

        it('should create bill USD', async () => {
            let bill = new BitPaySDK.Models.Bill("0001", Currencies.USD, "sandbox@bitpay.com", items);
            basicBillUsd = await client.CreateBill(bill);

            expect(basicBillUsd).toBeDefined();
        });

        it('should create bill EUR', async () => {
            let bill = new BitPaySDK.Models.Bill("0002", Currencies.EUR, "sandbox@bitpay.com", items);
            basicBillEur = await client.CreateBill(bill);

            expect(basicBillEur).toBeDefined();
        });

        it('should get bill', async () => {
            let bill = new BitPaySDK.Models.Bill("0003", Currencies.USD, "sandbox@bitpay.com", items);
            basicBillUsd = await client.CreateBill(bill);
            retrievedBill = await client.GetBill(basicBillUsd.id);

            expect(retrievedBill).toBeDefined();
        });

        it('should deliver bill', async () => {
            let bill = new BitPaySDK.Models.Bill("0006", Currencies.USD, "sandbox@bitpay.com", items);
            basicBillUsd = await client.CreateBill(bill);
            deliveredBill = await client.DeliverBill(basicBillUsd.id, basicBillUsd.token);
            
            expect(deliveredBill).toBeTruthy();
        });
    });
});