import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../shared/Footer";
import FloatingCartButton from "../components/CommonComponents/FloatingCartButton";
import Logo from "../components/CommonComponents/Logo";

export default function Main() {
  const [loading, setLoading] = useState(true);
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(()=>{
    window.scrollTo({
      top: 0 ,
      left: 0 ,
      behavior: "smooth"
    })
  } , [location.pathname])

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center bg-white">
        <Logo />
      </div>
    );
  }

  return (
    <main>
      <Navbar />
      <FloatingCartButton />
      <Outlet />
      <Footer />
    </main>
  );
}
