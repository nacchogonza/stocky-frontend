import React from "react";
import Header from "./Header";
import "../../App.css";

const AppLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <main className="app-body">{children}</main>
    </div>
  );
};

export default AppLayout;
