import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";
import Shop from "../pages/Shop";
import Contact from "../pages/Contact";
import MyAccount from "../pages/MyAccount";
import Cart from "../pages/Cart";
import MyOrders from "../pages/MyOrders";
import Checkout from "../pages/Checkout";
import Success from "../pages/Success";
import Logo from "../components/CommonComponents/Logo";
import Faqs from "../pages/Faqs";
import BookAppointment from "../pages/BookAppointment";
import ForgotPassword from "../components/Auth/ForgotPassword";
import ResetPassword from "../components/Auth/ResetPassword";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/admin/auth/ProductedRoute";
import Dashboard from "../pages/Dashboard/Admin/Dashboard";
import Analytics from "../pages/Dashboard/Admin/Analytics";
import AddQuantityPrice from "../pages/Dashboard/Admin/quantity-pricing/AddQuantityPrice";
import AdminProducts from "../pages/Dashboard/Admin/products/AdminProducts";
import AddProduct from "../pages/Dashboard/Admin/products/AddProduct";
import EditProduct from "../pages/Dashboard/Admin/products/EditProduct";
import ViewProduct from "../pages/Dashboard/Admin/products/ViewProduct";
import AddCategory from "../pages/Dashboard/Admin/categories/AddCategory";
import EditCategory from "../pages/Dashboard/Admin/categories/EditCategory";
import ViewCategory from "../pages/Dashboard/Admin/categories/ViewCategory";
import AdminSubCategories from "../pages/Dashboard/Admin/subCategories/AdminSubCategories";
import AddSubCategory from "../pages/Dashboard/Admin/subCategories/AddSubCategory";
import EditSubCategory from "../pages/Dashboard/Admin/subCategories/EditSubCategory";
import ViewSubCategory from "../pages/Dashboard/Admin/subCategories/ViewSubCategory";
import AddUser from "../pages/Dashboard/Admin/users/AddUser";
import EditUser from "../pages/Dashboard/Admin/users/EditUser";
import ViewUser from "../pages/Dashboard/Admin/users/ViewUser";
import AddCustomer from "../pages/Dashboard/Admin/users/AddCustomer";
import AddAdmin from "../pages/Dashboard/Admin/users/AddAdmin";
import AddWholesaler from "../pages/Dashboard/Admin/users/AddWholesaler";
import ViewContact from "../pages/Dashboard/Admin/contacts/ViewContact";
import AdminRatings from "../pages/Dashboard/Admin/ratings/AdminRatings";
import ViewRating from "../pages/Dashboard/Admin/ratings/ViewRating";
import AddCoupon from "../pages/Dashboard/Admin/coupons/AddCoupon";
import EditCoupon from "../pages/Dashboard/Admin/coupons/EditCoupon";
import ViewCoupon from "../pages/Dashboard/Admin/coupons/ViewCoupon";
import EditSlider from "../pages/Dashboard/Admin/sliders/EditSlider";
import AdminSliders from "../pages/Dashboard/Admin/sliders/AdminSliders";
import AddSlider from "../pages/Dashboard/Admin/sliders/AddSlider";
import ViewSlider from "../pages/Dashboard/Admin/sliders/ViewSlider";
import ViewFaq from "../pages/Dashboard/Admin/faqs/ViewFaq";
import EditFaq from "../pages/Dashboard/Admin/faqs/EditFaq";
import AddFaq from "../pages/Dashboard/Admin/faqs/AddFaq";
import AdminFaqs from "../pages/Dashboard/Admin/faqs/AdminFaqs";
import AdminQuantityPricing from "../pages/Dashboard/Admin/quantity-pricing/AdminQuantityPricing";
import EditQuantityPrice from "../pages/Dashboard/Admin/quantity-pricing/EditQuantityPrice";
import ViewQuantityPrice from "../pages/Dashboard/Admin/quantity-pricing/ViewQuantityPrice";
import AdminCategories from "../pages/Dashboard/Admin/categories/AdminCategories";
import AdminCustomization from "../pages/Dashboard/Admin/customization/AdminCustomization";
import CustomizationForm from "../pages/Dashboard/Admin/customization/CustomizationForm";
import AdminUsers from "../pages/Dashboard/Admin/users/AdminUsers";
import AdminOrders from "../pages/Dashboard/Admin/orders/AdminOrders";
import ViewOrder from "../pages/Dashboard/Admin/orders/ViewOrder";
import AdminContacts from "../pages/Dashboard/Admin/contacts/AdminContacts";
import AdminCoupons from "../pages/Dashboard/Admin/coupons/AdminCoupons";
import AdminLogin from "../pages/Auth/AdminLogin";
import AdminForgotPassword from "../pages/Auth/AdminForgotPassword";
import AdminResetPassword from "../pages/Auth/AdminResetPassword";
import AdminDesignInquiries from "../pages/Dashboard/Admin/design-inquiries/AdminDesignInquiries";
import ViewDesignInquiry from "../pages/Dashboard/Admin/design-inquiries/ViewDesignInquiry";
import EditDesignInquiry from "../pages/Dashboard/Admin/design-inquiries/EditDesignInquiry";
import ViewDiscount from "../pages/Dashboard/Admin/discounts/ViewDiscount";
import EditDiscount from "../pages/Dashboard/Admin/discounts/EditDiscount";
import AddDiscount from "../pages/Dashboard/Admin/discounts/AddDiscount";
import AdminDiscounts from "../pages/Dashboard/Admin/discounts/AdminDiscounts";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/logo",
        element: <Logo />
      },
      {
        path: "/shop",
        element: <Shop />
      },
      {
        path: "/shop/category/:categoryId",
        element: <Shop />
      },
      {
        path: "/shop/subcategory/:subcategoryId",
        element: <Shop />
      },
      {
        path: "/contact",
        element: <Contact />
      },
      {
        path: "/product-details/:id",
        element: <ProductDetails />
      },
      {
        path: "/my-account",
        element: <MyAccount />
      },
      {
        path: "/cart",
        element: <Cart />
      },
      {
        path: "my-orders",
        element: <MyOrders />
      },
      {
        path: "/checkout",
        element: <Checkout />
      },
      {
        path: "/order-success",
        element: <Success />
      },
      {
        path: "/faqs",
        element: <Faqs />
      },
      {
        path: "/book-an-appointment",
        element: <BookAppointment />
      },

    ]
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/sign-up',
        element: <Signup />
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />
      },
      {
        path: "/reset-password",
        element: <ResetPassword />
      }
    ]
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />, // Remove ProtectedRoute wrapper
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: "analytics",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Analytics />
          </ProtectedRoute>
        )
      },
      {
        path: "quantity-pricing",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminQuantityPricing />
          </ProtectedRoute>
        )
      },

      {
        path: "quantity-pricing/add",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AddQuantityPrice />
          </ProtectedRoute>
        )
      },

      {
        path: "quantity-pricing/edit/:subcategoryId/:priceId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <EditQuantityPrice />
          </ProtectedRoute>
        )
      },
      {
        path: "quantity-pricing/view/:subcategoryId/:priceId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ViewQuantityPrice />
          </ProtectedRoute>
        )
      },
      {
        path: "products",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminProducts />
          </ProtectedRoute>
        )
      },
      {
        path: "products/add",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AddProduct />
          </ProtectedRoute>
        )
      },
      {
        path: "products/edit/:productId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <EditProduct />
          </ProtectedRoute>
        )
      },
      {
        path: "products/view/:productId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ViewProduct />
          </ProtectedRoute>
        )
      },
      {
        path: "faqs",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminFaqs />
          </ProtectedRoute>
        )
      },
      {
        path: "faqs/add",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AddFaq />
          </ProtectedRoute>
        )
      },
      {
        path: "faqs/edit/:faqId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <EditFaq />
          </ProtectedRoute>
        )
      },
      {
        path: "faqs/view/:faqId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ViewFaq />
          </ProtectedRoute>
        )
      },
      {
        path: "discounts",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDiscounts />
          </ProtectedRoute>
        )
      },
      {
        path: "discounts/add",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AddDiscount />
          </ProtectedRoute>
        )
      },
      {
        path: "discounts/edit/:discountId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <EditDiscount />
          </ProtectedRoute>
        )
      },
      {
        path: "discounts/view/:discountId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ViewDiscount />
          </ProtectedRoute>
        )
      },
      {
        path: "design-inquiries",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDesignInquiries />
          </ProtectedRoute>
        )
      },
      {
        path: "design-inquiries/view/:inquiryId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ViewDesignInquiry />
          </ProtectedRoute>
        )
      },
      {
        path: "design-inquiries/edit/:inquiryId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <EditDesignInquiry />
          </ProtectedRoute>
        )
      },
      {
        path: "categories",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminCategories />
          </ProtectedRoute>
        )
      },
      {
        path: "categories/add",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AddCategory />
          </ProtectedRoute>
        )
      },
      {
        path: "categories/edit/:categoryId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <EditCategory />
          </ProtectedRoute>
        )
      },
      {
        path: "categories/view/:categoryId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ViewCategory />
          </ProtectedRoute>
        )
      },
      {
        path: "subcategories",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminSubCategories />
          </ProtectedRoute>
        )
      },
      {
        path: "subcategories/add",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AddSubCategory />
          </ProtectedRoute>
        )
      },
      {
        path: "subcategories/edit/:subcategoryId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <EditSubCategory />
          </ProtectedRoute>
        )
      },
      {
        path: "subcategories/view/:subcategoryId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ViewSubCategory />
          </ProtectedRoute>
        )
      },

      {
        path: "products/customization/:productId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminCustomization />
          </ProtectedRoute>
        )
      },
      {
        path: "products/customization/add/:productId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <CustomizationForm />
          </ProtectedRoute>
        )
      },
      {
        path: "products/customization/edit/:customizationId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <CustomizationForm />
          </ProtectedRoute>
        )
      },
      {
        path: "products/customization/view/:subcategoryId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ViewSubCategory />
          </ProtectedRoute>
        )
      },
      {
        path: "users",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminUsers />
          </ProtectedRoute>
        )
      },
      {
        path: "users/add",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AddUser />
          </ProtectedRoute>
        )
      },
      {
        path: "users/edit/:userId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <EditUser />
          </ProtectedRoute>
        )
      },
      {
        path: "users/view/:userId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ViewUser />
          </ProtectedRoute>
        )
      },
      {
        path: "users/create/customer",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AddCustomer />
          </ProtectedRoute>
        )
      },
      {
        path: "users/create/admin",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AddAdmin />
          </ProtectedRoute>
        )
      },
      {
        path: "users/create/wholesaler",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AddWholesaler />
          </ProtectedRoute>
        )
      },
      {
        path: "sliders",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminSliders />
          </ProtectedRoute>
        )
      },
      {
        path: "sliders/add",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AddSlider />
          </ProtectedRoute>
        )
      },
      {
        path: "sliders/edit/:sliderId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <EditSlider />
          </ProtectedRoute>
        )
      },
      {
        path: "sliders/view/:sliderId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ViewSlider />
          </ProtectedRoute>
        )
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminOrders />
          </ProtectedRoute>
        )
      },
      {
        path: "orders/view/:orderId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ViewOrder />
          </ProtectedRoute>
        )
      },

      {
        path: "contacts",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminContacts />
          </ProtectedRoute>
        )
      },
      {
        path: "contacts/view/:contactId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ViewContact />
          </ProtectedRoute>
        )
      },
      {
        path: "ratings",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminRatings />
          </ProtectedRoute>
        )
      },
      {
        path: "ratings/view/:ratingId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ViewRating />
          </ProtectedRoute>
        )
      },
      {
        path: "coupons",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminCoupons />
          </ProtectedRoute>
        )
      },

      {
        path: "coupons/add",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AddCoupon />
          </ProtectedRoute>
        )
      },
      {
        path: "coupons/edit/:couponId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <EditCoupon />
          </ProtectedRoute>
        )
      },
      {
        path: "coupons/view/:couponId",
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ViewCoupon />
          </ProtectedRoute>
        )
      },


      // User Routes

    ]
  },
  {
    path: "/admin/login",
    element: <AdminLogin />
  },
  {
    path: "/admin/forgot-password",
    element: <AdminForgotPassword />
  },
  {
    path: "/admin/reset-password",
    element: <AdminResetPassword />
  },
])