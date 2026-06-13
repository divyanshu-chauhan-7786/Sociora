import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Scheduler from "./pages/Scheduler";
import Accounts from "./pages/Accounts";
import Aicomposer from "./pages/Aicomposer";
import Settings from "./pages/Settings";

export default function App() {
    return (
        <>
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
        </>
    );
}
