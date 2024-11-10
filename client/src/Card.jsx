import React from 'react';
import { motion } from 'framer-motion';

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: 'easeInOut', duration: 0.5 },
  },
};

function Card() {
  const steps = [
    {
      icon: '1',
      title: 'Browse and Select a Trip',
      description: 'Find a suitable trip. Ensure your account is verified to proceed.',
      imageUrl: '/images/browsing.png',
    },
    {
      icon: '2',
      title: 'Book Your Trip',
      description: 'Fill in the required details and make sure your account has enough funds.',
      imageUrl: '/images/booking.png',
    },
    {
      icon: '3',
      title: 'Receive Trip Details',
      description: 'Driver info and a reference number will be sent to you.',
      imageUrl: '/images/message.png',
    },
    {
      icon: '4',
      title: 'Complete Payment',
      description: 'Provide the reference number at the pickup point to release payment to the driver.',
      imageUrl: '/images/payment-method.png',
    },
  ];

  return (
    <div className="min-h-screen py-6 flex flex-col justify-center items-center sm:py-12">
      {/* Title Section - visible on all screen sizes */}
      <div className="text-center mt-10">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-700 dark:text-white">
          How to Get a Ride on Hikenrides
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Follow these simple steps to book and enjoy your trip.
        </p>
      </div>

      {/* For large screens */}
      <div className="hidden sm:block sm:max-w-xl w-full px-2 sm:px-0">
        <div className="relative text-gray-700 antialiased text-sm font-semibold">
          {/* Vertical line in center */}
          <div className="hidden sm:block w-1 bg-blue-300 absolute h-full left-1/2 transform -translate-x-1/2"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={`mt-6 sm:mt-0 sm:mb-12 flex flex-col sm:flex-row items-center ${
                index % 2 === 0 ? 'justify-start' : 'justify-end'
              }`}
              variants={item}
              initial="hidden"
              animate="show"
            >
              <div className={`flex w-full sm:w-1/2 ${index % 2 === 0 ? 'sm:pr-8' : 'sm:pl-8'}`}>
                <div className="p-6 bg-white rounded shadow-lg text-center">
                  <img src={step.imageUrl} alt={`Step ${index + 1} icon`} className="w-10 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 mt-2">{step.description}</p>
                </div>
              </div>
              
              {/* Icon in center */}
              <div className="rounded-full bg-blue-500 border-white border-4 w-8 h-8 absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                <span className="text-white font-bold">{step.icon}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* For small screens */}
      <div className="sm:hidden p-8">
        <motion.div
          className="grid gap-8 grid-cols-1"
          initial="hidden"
          animate="show"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="group relative bg-white rounded-xl shadow-lg p-8 transition hover:shadow-2xl"
              variants={item}
            >
              <motion.img
                src={step.imageUrl}
                alt={`Icon for step ${index + 1}`}
                className="w-16 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-700 text-center">
                {step.title}
              </h3>
              <p className="text-gray-600 text-center mt-2">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div>
          <motion.img
            src="/images/paystack.jpg"
            alt="Paystack logo"
            className="w-full max-w-md mx-auto rounded-lg shadow-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          />
        </div>
    </div>
  );
}

export default Card;
