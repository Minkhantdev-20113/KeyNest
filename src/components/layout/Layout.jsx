import Sidebar from './Sidebar';
import Header from './Header';
import ToastContainer from '../ui/ToastContainer';

export default function Layout({ children, activePage, onNavigate }) {
  return (
    <div className="min-h-screen bg-surface-50">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <div className="lg:ml-64 min-h-screen flex flex-col transition-all duration-300">
        <Header />
        <main className="flex-1 p-6 animate-in">
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
