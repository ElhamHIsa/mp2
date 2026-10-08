import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { SearchProvider } from './state/SearchContext';
import DetailView from './views/DetailView';
import GalleryView from './views/GalleryView';
import ListView from './views/ListView';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <SearchProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ListView />} />
            <Route path="gallery" element={<GalleryView />} />
            <Route path="item/:id" element={<DetailView />} />
          </Route>
        </Routes>
      </SearchProvider>
    </BrowserRouter>
  );
}