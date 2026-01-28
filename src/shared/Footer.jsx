import React, { useEffect, useState } from 'react'
import { AiOutlineMail } from "react-icons/ai";
import { LuPhone } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import { API_BASE_URL } from '../config/api';
import { toast } from 'react-toastify';
import SkeletonLoader from '../components/HomeComponents/SkeletonLoader';
import { Link } from 'react-router-dom';
import { FaPinterest } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";

export default function Footer() {
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/category`);
        const data = await res.json();
        if (data.success) {
          setCategories(data.data.filter(cat => cat.isActive))
        }
      }
      catch (error) {
        toast.error("Failed to fetch categories", error)
      }
      finally {
        setLoadingCategories(false)
      }
    };
    fetchCategories();
  }, [])

  return (
    <section className=' pt-10 bg-primary border-t'>
      <div className='grid px-10 pb-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
        <div className='flex flex-col text-white gap-3'>
          <h1 className='font-baijamjuree text-3xl text-secondary tracking-widest'>KACHIDHAM</h1>
          <h2 className='font-josefin text-xl leading-loose font-medium'>Timeless elegance crafted for modern women.</h2>
          <p className='font-josefin text-xl leading-loose'>We bring you thoughtfully designed ethnic and contemporary wear that blends comfort, style, and tradition
            for every occasion.</p>
        </div>
        <div className='flex flex-col text-white gap-5'>
          <h3 className='font-baijamjuree text-xl text-secondary font-bold tracking-widest'>Shop by Categories</h3>
          <ul className='flex flex-col gap-5'>
            {loadingCategories ? (
              <li><SkeletonLoader /></li>
            ) : (
              categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/shop/category/${category.id}`}
                  className="hover:text-secondary transition"
                >
                  <li className='font-josefin text-lg'>
                    {category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase()}
                  </li>
                </Link>
              ))
            )}
          </ul>
        </div>

        <div className='flex flex-col text-white gap-5'>
          <h3 className='font-baijamjuree font-bold text-secondary text-xl tracking-widest'>Useful Links</h3>
          <ul className='flex flex-col gap-5'>
            <Link className='font-josefin text-lg hover:text-secondary transition' to={'/'}>Home</Link>
            <Link className='font-josefin text-lg hover:text-secondary transition' to={'/faqs'}>Faq's</Link>
            <Link className='font-josefin text-lg hover:text-secondary transition' to={'/book-an-appointment'}>Book an appointment</Link>
            <Link className='font-josefin text-lg hover:text-secondary transition' to={'/contact'}>Contact us</Link>
          </ul>
        </div>

        {/* Contact */}
        <div className='flex flex-col gap-5'>
          <h3 className='font-baijamjuree text-xl font-bold tracking-widest text-secondary'>Contact us</h3>
          <div className='flex flex-col gap-5'>
            <div className='flex items-center gap-3'>
              <span className='border rounded-full border-secondary p-3 text-secondary'><AiOutlineMail /></span>
              <a className='font-josefin tracking-wider hover:text-secondary text-white transition-all duration-200 ease-in-out' href="mailto:customersupport@kachidham.com">customersupport@kachidham.com</a>
            </div>
            <div className='flex items-center gap-3'>
              <span className='border rounded-full border-secondary p-3 text-secondary'><LuPhone /></span>
              <a className='font-josefin tracking-wider hover:text-secondary text-white transition-all duration-200 ease-in-out' href="tel:+918508896699">8508896699</a>
            </div>

            {/* Social links */}
            <div className='flex gap-5'>
              <a className='text-white hover:text-secondary hover:border-none transition-all ease-in-out duration-300 text-3xl rounded-full' href="https://pin.it/Ga5EOZSt4" target='_blank'><span><FaPinterest /></span></a>
              <a className='text-white hover:text-secondary hover:border-none transition-all ease-in-out duration-300 text-3xl rounded-full' href="https://www.instagram.com/kachidham?igsh=MXZqNGUzcm10YjV0OA==" target='_blank'><span><FaInstagram /></span></a>
            </div>
          </div>
        </div>
      </div>

      <div className='flex justify-center py-3 border-t text-white font-baijamjuree text-base md:text-lg bg-primary items-center'>
        <p>Kachidham @2025. All rights reserved</p>
      </div>
    </section>
  )
}
