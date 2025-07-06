//import modules
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

//import css
import "./App.css";

//import Components
import Home from "./components/Home/Home";
import Form from "./components/Form/Form";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Account from "./components/Account/Account";
import Header from "./components/common/Header/Header";
import Footer from "./components/common/Footer/Footer";
import Contact from "./components/Contact/Contact";
import About from "./components/About/About";

//export function
function App() {
    return (
        <>
            <AuthProvider>
                {/* configurations of the routers and routes */}
                <Router>
                    {/* render the fixed header component */}
                    <Header />

                    <Routes>
                        {/* render the home component based on the path specified*/}
                        <Route path='/' element={<Home />} />

                        <Route path='/signup' element={<Signup />} />

                        <Route path='/login' element={<Login />} />

                        <Route path='/form' element={<Form />} />

                        <Route path='/account' element={<Account />} />

                        <Route path='/contact' element={<Contact />} />

                        <Route path='/about' element={<About />} />
                    </Routes>

                    {/* render the fixed footer component */}
                    <Footer />
                </Router>
            </AuthProvider>
        </>
    );
}

//export the App render
export default App;
