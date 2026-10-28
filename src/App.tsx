import { Route, Routes } from 'react-router-dom';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import PostDetailPage from './pages/PostDetailPage';
import PostEditorPage from './pages/PostEditorPage';
import PostListPage from './pages/PostListPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="posts" element={<PostListPage />} />
        <Route path="posts/:id" element={<PostDetailPage />} />
        <Route
          path="admin/new"
          element={
            <AdminRoute>
              <PostEditorPage />
            </AdminRoute>
          }
        />
        <Route
          path="admin/edit/:id"
          element={
            <AdminRoute>
              <PostEditorPage />
            </AdminRoute>
          }
        />
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
