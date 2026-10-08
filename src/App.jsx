import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSession } from "./lib/session";
import { Empty } from "./components/ui";
import Landing from "./pages/Landing";
import { SignIn, SignUp } from "./pages/Auth";
import AppLayout from "./pages/app/AppLayout";
import MenuPage from "./pages/app/MenuPage";
import DishPage from "./pages/app/DishPage";
import BasketPage from "./pages/app/BasketPage";
import { HistoryPage, OrdersPage } from "./pages/app/OrdersPages";
import DeliveryPage from "./pages/app/DeliveryPage";
import AdminLayout from "./pages/admin/AdminLayout";
import KitchenOrders from "./pages/admin/KitchenOrders";
import { DishForm, KitchenMenu, KitchenMessages } from "./pages/admin/KitchenMenu";
import Portfolio from "./pages/portfolio/Portfolio";
import ProjectManager from "./pages/portfolio/ProjectManager";
import { Journal, JournalEditor, ReaderProfile } from "./pages/journal/Journal";

function RequireCustomer({ children }) {
  const { session, isAdmin } = useSession();
  const location = useLocation();
  if (!session) return <Navigate to="/signin" replace state={{ next: location.pathname }} />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { session, isAdmin } = useSession();
  const location = useLocation();
  if (!session) return <Navigate to="/signin" replace state={{ next: location.pathname }} />;
  if (!isAdmin) return <Navigate to="/app" replace />;
  return children;
}

function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center">
      <Empty title="This page isn't on the menu" action={<Link to="/" className="btn-primary">Go home</Link>}>
        The link may be old or mistyped.
      </Empty>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/app" element={<RequireCustomer><AppLayout /></RequireCustomer>}>
          <Route index element={<MenuPage />} />
          <Route path="dish/:productId" element={<DishPage />} />
          <Route path="basket" element={<BasketPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="delivery" element={<DeliveryPage />} />
        </Route>

        <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<KitchenOrders />} />
          <Route path="menu" element={<KitchenMenu />} />
          <Route path="menu/new" element={<DishForm />} />
          <Route path="menu/:productId" element={<DishForm />} />
          <Route path="messages" element={<KitchenMessages />} />
        </Route>

        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/projects" element={<RequireAdmin><ProjectManager /></RequireAdmin>} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/edit" element={<RequireAdmin><JournalEditor /></RequireAdmin>} />
        <Route path="/profile/:userId" element={<ReaderProfile />} />

        {/* old links keep working */}
        <Route path="/user/signin" element={<Navigate to="/signin" replace />} />
        <Route path="/user/signup" element={<Navigate to="/signup" replace />} />
        <Route path="/user/dashboard/:id" element={<Navigate to="/app" replace />} />
        <Route path="/admin/dashboard/:id" element={<Navigate to="/admin" replace />} />
        <Route path="/jimohSekinat" element={<Navigate to="/portfolio" replace />} />
        <Route path="/jimohSekinat/project" element={<Navigate to="/portfolio/projects" replace />} />
        <Route path="/blog" element={<Navigate to="/journal/edit" replace />} />
        <Route path="/blogpage" element={<Navigate to="/journal" replace />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop />
    </>
  );
}
