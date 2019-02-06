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

//pay route
app.post('/pay', (req, res) => {

    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
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
          for(let i = 0; i < payment.links.length; i++){
              if(payment.links[i].rel === 'approval_url'){
                  res.redirect(payment.links[i].href);
              }
          }
        }
    });
});

//route for success
app.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
        "amount": {
            "currency": "USD",
            "total": "25.00"
        }
    }]
    };

//executing

paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        //if everything goes through 
        console.log(JSON.stringify(payment));
        res.send('Success!');
    }
});
});

//if the buyer cancels their order
app.get('/cancel', (req, res) => res.send('Cancelled!'));


app.listen(3000, () => console.log('Server Started ^_^'));