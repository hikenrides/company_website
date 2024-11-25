import { useState, useEffect } from 'react';
import { useTypewriter } from 'react-simple-typewriter';
import '../App.scss';
import { IoChevronForwardCircle } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../UserContext.jsx';
import Footer from '../footer';
import ProductValues from '../ProductValues.jsx';
import ProductCTA from '../ProductCTA.jsx';
import Card from '../Card.jsx';
import 'tailwindcss/tailwind.css';

let easing = [0.6, -0.05, 0.01, 0.99];

function IndexPage() {
  const { user } = useContext(UserContext);
  const [typeEffect, setTypeEffect] = useTypewriter({
    words: ["Your Way.", "Safe and Secure.", "Affordable Journeys.", "Our Connection."],
    loop: {},
    typeSpeed: 100,
    deleteSpeed: 50,
    delaySpeed: 1500,
  });

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300); // Adjust duration as needed
    return () => clearTimeout(timer);
  }, [typeEffect]);

  return (
    <motion.div initial="initial" animate="animate" className="font-sans">
      <main className="pt-14 md:pt-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 to-indigo-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1552937075-967cf58b74a4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            }}
          ></div>
          <div className="container mx-auto px-4 py-16 sm:py-24 md:py-32 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0">
              {/* Left Content */}
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-snug mb-4 md:mb-6">
                  Your Ride,
                </h1>
                <motion.h1
                  className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-snug mb-4 md:mb-6 min-h-[50px]" // Set a min height to avoid container shrinking
                  animate={{
                    scale: isAnimating ? 0.95 : 1, // Scale text slightly
                  }}
                  transition={{ duration: 0.3, ease: easing }}
                  style={{ display: 'inline-block' }} // Ensures the text scales independently
                >
                  <span style={{ fontWeight: 'bold', color: 'white' }}>{typeEffect}</span>
                </motion.h1>

                <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 font-extrabold">
                  Connecting drivers and passengers for cost-effective, secure, and collaborative journeys.
                </p>

                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link to="/account/trips">
                    <button className="w-full sm:w-auto bg-white text-blue-900 font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-100 transition duration-300">
                      Available Trips
                    </button>
                  </Link>
                  {!user && (
                    <Link to="/login">
                      <button className="w-full sm:w-auto bg-white text-blue-900 font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-100 transition duration-300">
                        Login/Register
                      </button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Right Content */}
              <div className="w-full md:w-1/2">
                <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-6">
                  <h2 className="text-xl sm:text-2xl font-semibold">Why Hikenrides?</h2>
                  <ul className="space-y-3 sm:space-y-4">
                    <li className="flex items-center">
                      <IoChevronForwardCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-yellow-400" />
                      <span className="text-sm sm:text-base">Cost-Effective Transportation</span>
                    </li>
                    <li className="flex items-center">
                      <IoChevronForwardCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-green-400" />
                      <span className="text-sm sm:text-base">Convenient and Flexible Travel</span>
                    </li>
                    <li className="flex items-center">
                      <IoChevronForwardCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-400" />
                      <span className="text-sm sm:text-base">Reduced Traffic and Environmental Impact</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Information Section */}
        <div className="w-full bg-white py-12 px-4 sm:py-16 sm:px-8">
          <div className="max-w-[1240px] mx-auto grid gap-8 md:grid-cols-2 items-center">
            <img
              className="w-[80%] sm:w-[500px] mx-auto my-4 rounded-md"
              src={'/images/hikenrides.png'}
              alt="Hikenrides"
            />
            <div className="flex flex-col justify-center text-center md:text-left">
              <p className="text-[#00df9a] font-bold mb-2">Receive Offers and Requests</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold py-2">
                Where do you want to drive to?
              </h1>
              <p className="text-sm sm:text-base">
                Our platform connects you with passengers heading in the same direction or to nearby destinations, ensuring no detours for drivers.
                Whether it’s a daily commute, a weekend trip, or a long-distance journey, share your route and find passengers easily.
                Make money on trips you already plan to take by picking up passengers going your way.
              </p>
              <button className="bg-black text-[#00df9a] w-full sm:w-[200px] rounded-md font-medium my-4 py-2 sm:py-3 mx-auto md:mx-0">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </main>

      <ProductValues />
      <Card />
      <ProductCTA />
      <Footer />
    </motion.div>
  );
}

export default IndexPage;
