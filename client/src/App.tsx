import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Layout = lazy(() => import("./components/Layout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Scheduler = lazy(() => import("./pages/Scheduler"));
const Accounts = lazy(() => import("./pages/Accounts"));
const Aicomposer = lazy(() => import("./pages/Aicomposer"));
const Settings = lazy(() => import("./pages/Settings"));

const PageLoader = () => (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-coral-500" />
    </div>
);

export default function App() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route element={<Layout />} >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/accounts" element={<Accounts />} />
                    <Route path="/schedule" element={<Scheduler />} />
                    <Route path="/ai-composer" element={<Aicomposer />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>

            </Routes>
        </Suspense>
    );
}
