var utils = require('partial.js/utils');

// $ npm install paypal
var paypal = require('paypal');

exports.init = function() {
	this.route('/', viewHomepage);
	this.route('/pay/', redirectPay);
	this.route('/paypal/ok/', paymentOK);
};

function viewHomepage() {
	var self = this;
	self.layout('');
	self.repository.title = 'Node.js paypal';
	self.view('homepage');
}

function redirectPay() {
	var self = this;
	var payment = paypal.init(self.options['paypal-user'], self.options['paypal-password'], self.options['paypal-signature'], self.options['paypal-return'], self.options['paypal-cancel'], self.options.debug);

	var orderNumber = 100;
	var price = 12.23;

	payment.pay(orderNumber, price, 'support', 'EUR', function(err, url) {
		
		if (err) {
			self.view500(err);
			return;
		}

		self.redirect(url);
	});
};

function paymentOK() {
	var self = this;
	var payment = paypal.init(self.options['paypal-user'], self.options['paypal-password'], self.options['paypal-signature'], self.options['paypal-return'], self.options['paypal-cancel'], self.options.debug);
	
	payment.detail(self.get.token, self.get.PayerID, function(err, data) {
		
		if (err) {
			self.view500(err);
			return;
		}

		/*
		{
		  "TOKEN": "EC-2CM91608R1120253F",
		  "TIMESTAMP": "2013-01-27T10:18:20Z",
		  "CORRELATIONID": "d5b0e56e2875b",
		  "ACK": "Success",
		  "VERSION": "52.0",
		  "BUILD": "4181146",
		  "TRANSACTIONID": "5BG30034J7311192A",
		  "TRANSACTIONTYPE": "expresscheckout",
		  "PAYMENTTYPE": "instant",
		  "ORDERTIME": "2013-01-27T10:18:19Z",
		  "AMT": "12.23",
		  "TAXAMT": "0.00",
		  "CURRENCYCODE": "EUR",
		  "PAYMENTSTATUS": "Pending",
		  "PENDINGREASON": "multicurrency",
		  "REASONCODE": "None"
		}
		*/

  		if (data.ACK === 'Success')
  			console.log('OK');

		self.json(data);
	});
};