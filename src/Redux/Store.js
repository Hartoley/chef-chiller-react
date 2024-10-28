import { configureStore } from "@reduxjs/toolkit";
import Adminlogins from "./Adminlogins";
import Customersredux from "./Customers";

export default configureStore({
  reducer: {
    admins: Adminlogins,
    customers: Customersredux,
  },
});
