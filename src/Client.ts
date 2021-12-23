import {BitPayExceptions as Exceptions, RESTcli} from './index';
import {
    Invoice,
    InvoiceInterface,
    Bill,
    BillInterface,
    Rates,
    RateInterface,
} from "./Model";

export class Client {
    private _env: string;
    private _token: string;
    private _RESTcli: RESTcli;

    constructor(
        environment: string,
        token: string
    ){
        try {
            this._env = environment;
            this._token = token;
            this.init();
        } catch (e) {
            throw new Exceptions.Generic(null, "failed to initiate client : " + e.message);
        }
    }

    private async init() {
        try {
            this._RESTcli = new RESTcli(this._env);
        } catch (e) {
            throw new Exceptions.Generic(null, "failed to deserialize BitPay server response (Token array) : " + e.message);
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////


    /**
     * Create a BitPay invoice.
     *
     * @param invoice Invoice An Invoice object with request parameters defined.
     * @return Invoice invoice Invoice A BitPay generated Invoice object.
     * @throws BitPayException BitPayException class
     * @throws InvoiceCreationException InvoiceCreationException class
     */
    public async CreateInvoice(invoice: Invoice): Promise<InvoiceInterface> {
        invoice.token = this._token;

        try {
            return await this._RESTcli.post("invoices", invoice).then(invoiceData => {
                return <InvoiceInterface>JSON.parse(invoiceData);
            });
        } catch (e) {
            throw new Exceptions.InvoiceCreation("failed to deserialize BitPay server response (Invoice) : " + e.message, e.apiCode);
        }
    }

    /**
     * Retrieve a BitPay invoice.
     *
     * @param invoiceId string The id of the invoice to retrieve.
     * @return Invoice A BitPay Invoice object.
     * @throws BitPayException BitPayException class
     * @throws InvoiceQueryException InvoiceQueryException class
     */
    public async GetInvoice(invoiceId: string): Promise<InvoiceInterface> {
        const params = {
            'token': this._token
        };

        try {
            return await this._RESTcli.get("invoices/" + invoiceId, params).then(invoiceData => {
                return <InvoiceInterface>JSON.parse(invoiceData);
            });
        } catch (e)
        {
            throw new Exceptions.InvoiceQuery("failed to deserialize BitPay server response (Invoice) : " + e.message, e.apiCode);
        }
    }

    /**
     * Create a BitPay Bill.
     *
     * @param bill        A Bill object with request parameters defined.
     * @return A BitPay generated Bill object.
     * @throws BitPayException       BitPayException class
     * @throws BillCreationException BillCreationException class
     */
     public async CreateBill(bill: Bill): Promise<BillInterface> {
        bill.token = this._token;

        try {
            return await this._RESTcli.post("bills", bill).then(billData => {
                return <BillInterface>JSON.parse(billData);
            });
        } catch (e) {
            throw new Exceptions.BillCreation("failed to deserialize BitPay server response (Bill) : " + e.message, e.apiCode);
        }
    }

    /**
     * Retrieve a BitPay bill by bill id using the specified facade.
     *
     * @param billId      The id of the bill to retrieve.
     * @return A BitPay Bill object.
     * @throws BitPayException    BitPayException class
     * @throws BillQueryException BillQueryException class
     */
     public async GetBill(billId: string): Promise<BillInterface> {
        const params = {
            'token': this._token
        };

        try {
            return await this._RESTcli.get("bills/" + billId, params).then(billData => {
                return <BillInterface>JSON.parse(billData);
            });
        } catch (e) {
            throw new Exceptions.BillQuery("failed to deserialize BitPay server response (Bill) : " + e.message, e.apiCode);
        }
    }

    /**
     * Deliver a BitPay Bill.
     *
     * @param billId      The id of the requested bill.
     * @param billToken   The token of the requested bill.
     * @return A response status returned from the API.
     * @throws BillDeliveryException BillDeliveryException class
     */
     public async DeliverBill(billId: string, billToken: string): Promise<Boolean> {
        const params = {
            'token': billToken
        };

        try {
            return await this._RESTcli.post("bills/" + billId + "/deliveries", params).then(billData => {
                return (<string>JSON.parse(billData) == "Success");
            });
        } catch (e) {
            throw new Exceptions.BillDelivery("failed to deserialize BitPay server response (Bill) : " + e.message, e.apiCode);
        }
    }

    /**
     * Retrieve a BitPay Rates.
     *
     * @param currency string The rates of the currency to retrieve.
     * @return Rate A BitPay Rate object.
     * @throws BitPayException BitPayException class
     * @throws RateQueryException RateQueryException class
     */
    public GetRates = async (currency: string = null): Promise<RateInterface[]> => {
        let uri = currency ? "rates/" + currency: "rates";
        try {
            return await this._RESTcli.get(uri, null).then(ratesData => {
                return new Rates(ratesData, this).GetRates();
            });
        } catch (e) {
            throw new Exceptions.RateQuery(e.message, e.apiCode);
        }
    }

    /**
     * Retrieve a BitPay Currencies.
     *
     * @return Currencies A BitPay Currencies array.
     * @throws BitPayException BitPayException class
     * @throws CurrencyQueryException CurrencyQueryException class
     */
    public GetCurrencies = async (): Promise<[]> => {
        try {
            return await this._RESTcli.get("currencies/", null).then(currenciesData => {
                return <[]>JSON.parse(currenciesData);
            });
        } catch (e) {
            throw new Exceptions.CurrencyQuery(e.message, e.apiCode);
        }
    }
}