import React from 'react';
import { Document, Page, Text } from '@react-pdf/renderer';

const OrderReportPDF = ({ orders }) => {
  return (
    <Document>
      <Page size="A4">
        <Text>Order Report</Text>
        {orders.map((order) => (
          <Text key={order.order_id}>
            Order ID: {order.order_id}, Customer Name: {order.customer_name},
            Total Price: {order.total_price}
          </Text>
        ))}
      </Page>
    </Document>
  );
};

export default OrderReportPDF;
