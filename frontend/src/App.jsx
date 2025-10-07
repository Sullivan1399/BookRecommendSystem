import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePageLayout from "./pages/HomePageLayout";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ProfileLayout from "./pages/ProfileLayout";
import InfoPage from "./pages/profile/InfoPage";
import EditProfile from "./pages/profile/EditProfile";
import SettingsPage from "./pages/profile/SettingsPage";
import OrdersPage from "./pages/profile/OrdersPage";
import FavoriteBooksPage from "./pages/profile/FavoriteBooksPage";
import BooksListPage from "./pages/shop/BookListPage";
import BookListLayout from "./pages/shop/BookListLayout";
import BookDetails from "./pages/shop/BookDetails";
import AdminLayout from "./pages/admin/AdminLayout";
import ManageBook from "./pages/admin/ManageBook";
import ManageUser from "./pages/admin/ManageUser";
import AdminDashboard from "./pages/admin/AdminDashboard";
import GenreSurvey from "./pages/GenreSurvey";
import BooksSearchResultPage from "./pages/shop/BookSearchResultPage";
import FavoriteGenrePage from "./pages/FavoritesGenrePage";
import FavoriteGenresListPage from "./pages/profile/FavoriteGenresListPage";
import AdminRoute from "./components/AdminRoute";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/choose-genres" element={<FavoriteGenrePage/>}/>
          <Route path="/" element={<HomePageLayout />}>
            <Route path="survey" element={<GenreSurvey />} />
            <Route index element={<HomePage />} />
            <Route path="/profile" element={<ProfileLayout />}>
              <Route path="favorite-books" element={<FavoriteBooksPage />} />
              <Route index element={<InfoPage />} />
              <Route path="genre" element={<FavoriteGenresListPage />} />
              <Route path="edit" element={<EditProfile />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<div>404 Not Found</div>} />
            <Route path="/books" element={<BookListLayout />}>
              <Route path="list" element={<BooksListPage />} />
              <Route path="search" element={<BooksSearchResultPage />} />
              <Route path="search-vector" element={<BooksSearchResultPage />} />
              <Route path="details" element={<BookDetails />} />
            </Route>
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
              <Route index element={
              <AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="manage-books" element={<AdminRoute><ManageBook /></AdminRoute>} />
              <Route path="manage-users" element={<AdminRoute><ManageUser /></AdminRoute>} />
          </Route>
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
