import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import Homepage from './pages/Homepage';
import Product from './pages/Product';

const Routes = () => {
  return (
    <BrowserRouter>
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/shops1/" element={<Homepage />} />
        <Route path="/shops1/homepage/" element={<Homepage />} />
        <Route path="/shops1/product/" element={<Product />} />
      </RouterRoutes>
    </BrowserRouter>
  );
};

export default Routes;
