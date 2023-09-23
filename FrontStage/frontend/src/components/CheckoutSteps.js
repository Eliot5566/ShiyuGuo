import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function CheckoutSteps(props) {
  return (
    <div>
      <Row className="checkout-steps">
        <Col className={props.step1 ? 'active' : ''}>登入帳號</Col>
        <Col className={props.step2 ? 'active' : ''}>運送地址</Col>
        <Col className={props.step3 ? 'active' : ''}>付款方式</Col>
        <Col className={props.step4 ? 'active' : ''}>送出訂單</Col>
      </Row>
    </div>
  );
}
