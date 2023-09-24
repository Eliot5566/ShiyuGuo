import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';
import { Container } from 'react-bootstrap';
import './PaymentMethod.css';
import paypal from '../images/paypal.svg';
import linepay from '../images/LinePay.png';

export default function PaymentMethod() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'PayPal'
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const handlePaymentMethodChange = (newMethod) => {
    setPaymentMethod(newMethod);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };

  return (
    <Container>
      <div className="container small-container paycon ">
        <CheckoutSteps step1 step2 step3></CheckoutSteps>
        <Helmet>
          <title>付款方式</title>
        </Helmet>
        <h1 className="my-3">付款方式</h1>
        <Form onSubmit={submitHandler}>
          <div className="mb-3">
            <label htmlFor="PayPal">
              <Form.Check
                type="radio"
                id="PayPal"
                value="PayPal"
                checked={paymentMethodName === 'PayPal'}
                onChange={() => handlePaymentMethodChange('PayPal')}
              />
              <img
                src={paypal}
                alt="paypal"
                className={`paypal mb-4 ${
                  paymentMethodName === 'PayPal' ? 'selected' : ''
                }`}
              />
            </label>
          </div>
          <div className="mb-3">
            <label htmlFor="LinePay">
              <Form.Check
                type="radio"
                id="LinePay"
                value="LinePay"
                checked={paymentMethodName === 'LinePay'}
                onChange={() => handlePaymentMethodChange('LinePay')}
              />
              <img
                src={linepay}
                alt="linepay"
                className={`linepay ${
                  paymentMethodName === 'LinePay' ? 'selected' : ''
                }`}
              />
            </label>
          </div>
          <div className="mb-3">
            <Button
              type="submit"
              className="btn-color"
              style={{ backgroundColor: '#9a2540' }}
            >
              下一步
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}
