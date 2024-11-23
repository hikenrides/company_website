import React, { useState } from 'react';

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index); // Toggle visibility
  };

  const faqs = [
    { question: "What is the process for verifying my account?", answer: "To verify your account, navigate to the 'Profile' section in the sidebar and click on the 'Verify Account' button. Follow the instructions provided after clicking the button to complete the verification process." },
    { question: "What is the procedure for requesting a trip or ride?", answer: "To request a trip or ride, go to the 'Request Trip' section under 'My Profile' in the sidebar and submit your trip or ride request by following the prompts provided." },
    { question: "What is the procedure for creating a trip offer?", answer: "To create a trip offer, navigate to the 'Create Trip Offer' section under 'My Profile' in the sidebar and click the 'Add Trip Offer' button. Follow the provided instructions to complete the process." },
    { question: "Can I change the domain you give me?", answer: "Laboris qui labore cillum culpa in sunt quis sint veniam. Dolore ex aute deserunt esse ipsum elit aliqua." },
    { question: "How many sites I can create at once?", answer: "Laboris qui labore cillum culpa in sunt quis sint veniam. Dolore ex aute deserunt esse ipsum elit aliqua." },
    { question: "How can I communicate with you?", answer: "Laboris qui labore cillum culpa in sunt quis sint veniam. Dolore ex aute deserunt esse ipsum elit aliqua." },
  ];

  return (
    <div className="w-full text-gray-700">
      <section className="container px-3 py-14 mx-auto">
        <div className="text-center mb-2">
          <h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-gray-300 mb-4">
            Frequently Asked Questions
          </h1>
          <p className=" text-white text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
            The most common questions about how our business works and what we can do for you.
          </p>
        </div>
        <div className="w-full sm:mx-auto sm:mb-2 -mx-2">
          {/* FAQ List */}
          <div className="w-full px-4 py-2">
            {faqs.map((faq, index) => (
              <div className="mb-4" key={index}>
                <summary
                  onClick={() => toggleAnswer(index)}
                  className="font-semibold bg-gray-200 rounded-md py-3 px-5 cursor-pointer hover:bg-gray-300 transition-all ease-in-out duration-200"
                >
                  {faq.question}
                </summary>
                {activeIndex === index && (
                  <div className="px-5 py-2 rounded-md mt-2 text-white">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default FAQ;
