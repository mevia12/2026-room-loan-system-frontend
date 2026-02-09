import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import "./index.css";

import RoomLoanListPage from "./pages/RoomLoanListPage";
import RoomLoanCreatePage from "./pages/RoomLoanCreatePage";
import RoomLoanDetailPage from "./pages/RoomLoanDetailPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to="/room-loans" replace />} />
          <Route path="room-loans" element={<RoomLoanListPage />} />
          <Route path="room-loans/create" element={<RoomLoanCreatePage />} />
          <Route path="room-loans/:id" element={<RoomLoanDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
