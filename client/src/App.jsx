//import modules
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect } from "react";

//import context
import { AuthProvider } from "./context/AuthContext";

//import css
import "./App.css";

//import Components
import District from "./components/District/District";
import Clubs from "./components/Clubs/Clubs";
import Home from "./components/Home/Home";
import Form from "./components/Form/Form";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Account from "./components/Account/Account";
import Header from "./components/common/Header/Header";
import Footer from "./components/common/Footer/Footer";
import Contact from "./components/Contact/Contact";
import About from "./components/About/About";
import Council from "./components/District/Council/Council";
import Event from "./components/District/Event/Event";
import RSAMDIO from "./components/District/Event/RSAMDIO/RSAMDIO";
import NotFound from "./components/NotFound/NotFound";

//export function
function App() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <>
            <AuthProvider>
                {/* configurations of the routers and routes */}
                <Router>
                    {/* render the fixed header component */}
                    <Header />

                    <Routes>
                        {/* render the home component based on the path specified*/}
                        <Route exact path='/' element={<Home />} />

                        {/* <Route path='/signup' element={<Signup />} /> */}

                        <Route path='/login' element={<Login />} />

                        <Route path='/report' element={<Form />} />

                        <Route path='/account' element={<Account />} />

                        <Route path='/contact' element={<Contact />} />

                        <Route path='/about' element={<About />} />

                        <Route path='/district' element={<District />} />

                        <Route
                            path='/district/initiatives'
                            element={<District />}
                        />

                        <Route path='/district/council' element={<Council />} />

                        <Route path='/district/events' element={<Event />} />

                        <Route
                            path='/district/events/rsamdio'
                            element={<RSAMDIO />}
                        />

                        <Route path='/clubs' element={<Clubs />} />

                        <Route path='*' element={<NotFound />} />
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
