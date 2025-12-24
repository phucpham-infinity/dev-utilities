import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import TailwindBuilderPage from '@/pages/TailwindBuilderPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<TailwindBuilderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
