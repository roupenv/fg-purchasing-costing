import { BrowserRouter as Router, Route, Switch, useRouteMatch } from 'react-router-dom';
import ProtectedRoute from '../../Hooks/ProtectedRoute';
import AuthLayout from '../../Layouts/AuthLayout';
//Pages
import Home from '../../Pages/Home';
import InvoiceDetails from '../../Pages/InvoiceDetails';
import Invoices from '../../Pages/Invoices';
import PaymentDetails from '../../Pages/PaymentDetails';
import Payments from '../../Pages/Payments';
import ProductDetails from '../../Pages/ProductDetails';
import Products from '../../Pages/Products';
import AvgUnitCostPerProduct from '../../Pages/Reports/AvgUnitCostPerProduct';
import AvgUnitCostPerYear from '../../Pages/Reports/AvgUnitCostPerYear';
import TotalCostsOverTime from '../../Pages/Reports/TotalCostsOverTime';
import VendorPaymentSummary from '../../Pages/Reports/VendorPaymentSummary';
import ShipmentDetails from '../../Pages/ShipmentDetails';
import Shipments from '../../Pages/Shipments';
import TarrifDetails from '../../Pages/TarrifDetails';
import Tarrifs from '../../Pages/Tarrifs';
import Unauthorized from '../../Pages/Unauthorized';
import Unknown404 from '../../Pages/Unknown404';
import UserDetails from '../../Pages/UserDetails';
import VendorDetails from '../../Pages/VendorDetails';
import Vendors from '../../Pages/Vendors';


export default function Admin() {
  const { path } = useRouteMatch();
  return (
    <Router>
      <AuthLayout>
        <Switch>
          <Route path={`${path}/unauthorized`}>
            <Unauthorized />
          </Route>
          <Route path={`${path}/accounts/:userId`}>
            <UserDetails />
          </Route>
          <Route path={`${path}/invoices/:id`}>
            <InvoiceDetails />
          </Route>
          <Route path={`${path}/invoices`}>
            <Invoices />
          </Route>
          <Route path={`${path}/shipments/:id`}>
            <ShipmentDetails />
          </Route>
          <Route path={`${path}/shipments`}>
            <Shipments />
          </Route>
          <Route path={`${path}/products/:id`}>
            <ProductDetails />
          </Route>
          <Route path={`${path}/products`}>
            <Products />
          </Route>
          <Route path={`${path}/tarrifs/:id`}>
            <TarrifDetails />
          </Route>
          <Route path={`${path}/tarrifs`}>
            <Tarrifs />
          </Route>
          <Route path={`${path}/payments/:id`}>
            <PaymentDetails />
          </Route>
          <Route path={`${path}/payments`}>
            <Payments />
          </Route>
          <Route path={`${path}/vendors/:id`}>
            <VendorDetails />
          </Route>
          <Route path={`${path}/vendors`}>
            <Vendors />
          </Route>
          <ProtectedRoute path={`${path}/reports/total-costs-over-time`}>
            <TotalCostsOverTime />
          </ProtectedRoute>
          <ProtectedRoute path={`${path}/reports/vendor-payment-summary`}>
            <VendorPaymentSummary />
          </ProtectedRoute>
          <ProtectedRoute path={`${path}/reports/avg-unit-cost-per-year`}>
            <AvgUnitCostPerYear />
          </ProtectedRoute>
          <ProtectedRoute path={`${path}/reports/avg-unit-cost-per-product`}>
            <AvgUnitCostPerProduct />
          </ProtectedRoute>
          <ProtectedRoute exact path={path}>
            <Home/>
          </ProtectedRoute>
          <Route path='*'>
            <Unknown404 />
          </Route>
        </Switch>
      </AuthLayout>
    </Router>
  );
}
