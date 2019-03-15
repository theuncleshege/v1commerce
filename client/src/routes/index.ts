import Login from "../views/LoginPage/LoginPage";
import Products from "../views/Products/Products";
import EditProduct from "../views/admin/Products/EditProduct";
import NewProduct from "../views/admin/Products/NewProduct";

const indexRoutes = [
  { path: "/login", name: "Login", component: Login },
  { path: "/new-product", name: "Add Product", component: NewProduct },
  { path: "/products/:id", name: "Edit Product", component: EditProduct },
  { path: "/", name: "Products", component: Products }
];

export default indexRoutes;
