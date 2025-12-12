import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Toaster } from '@/components/ui/toaster';
import routes from './routes';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen dark">
        <Header />
        <main className="flex-grow">
          <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
};

export default App;
