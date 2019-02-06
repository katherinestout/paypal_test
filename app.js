const express = require('express');
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'ARTyH8uojFhbF0OMuhYnsGtjwr6YOBuVyR1aShZmdv3zWRWIpO3UZMi6UcYvId-jFSFcXNB_Dipqg9Ba',
    'client_secret': 'EDvuzF7pbswLpmhGs2W6MtZrBNm5AOmwJT34fkByoeeUkNYkqcHpyay6TW7AFWSCSV-xEUymTI2A9OYW'
  });

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index'));

app.post('/pay', (req, res) => {

    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://return.url/success",
            "cancel_url": "http://cancel.url/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Red Sox Hat",
                    "sku": "001",
                    "price": "25.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "25.00"
            },
            "description": "a hat yay."
        }]
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
        }
    });


});

app.listen(3000, () => console.log('Server Started ^_^'));