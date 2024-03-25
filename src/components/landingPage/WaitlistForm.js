import React, { useState } from "react";

function WaitlistForm({ toggleWaitlistModal, waitlistModalRef }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmittedError, setFormSubmittedError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmission = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Set loading to true before the fetch call

    const formData = {
      fullName: event.target.fullName?.value,
      email: event.target.email?.value,
      companyName: event.target.companyName?.value,
    };

    try {
      const response = await fetch("/api/public/submitWaitlistForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormSubmitted(true);
      } else {
        // Handle errors
        console.error("Form submission failed");
      }
    } catch (error) {
      // Handle errors
      console.error("There was an error submitting the form", error);
    }
    setFormSubmittedError(true);
    setIsLoading(false); // Set loading to false after the fetch
  };
  if (formSubmitted) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg text-center">
          <h3 className="text-lg font-medium text-gray-900">
            Welcome to Prosights
          </h3>
          <p className="mt-2 md:mt-4">
            Thank you! Your submission has been received!
          </p>
          <button
            id="cancel-btn"
            className="mt-2 md:mt-4 text-sm inline-flex justify-center underline"
            onClick={toggleWaitlistModal}
          >
            Back
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
        <div
          className="relative top-20 md:top-28 mx-auto p-5 border w-96 md:w-96 shadow-lg rounded-md bg-white"
          ref={waitlistModalRef}
        >
          {/* Form content */}

          <div className="mt-2 md:mt-3 text-center">
            <h3 className="text-lg leading-4 md:leading-6 font-medium text-gray-900">
              Welcome to ProSights
            </h3>
            <p className="mt-4 text-sm text-gray-500">
              Fill this form to join our waitlist
            </p>
            {/* <div className="px-7 py-2">
              <input
                className="mt-4 p-3 border rounded-md w-full text-sm"
                placeholder="Full name"
              />
              <input
                className="mt-4 p-3 border rounded-md w-full text-sm"
                placeholder="Work email"
              />
              <input
                className="mt-4 p-3 border rounded-md w-full text-sm"
                placeholder="Company name"
              />
              <button
                id="ok-btn"
                className="mt-6 px-4 py-2 bg-primary text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-primaryHover focus:outline-none focus:ring-2 focus:ring-primaryHover"
                onClick={handleFormSubmission}
              >
                Join Waitlist
              </button>
            </div> */}
            {formSubmitted ? (
              <p className="mt-4 text-wrap">
                Thank you! Your submission has been received!
              </p>
            ) : (
              <div className="px-4 md:px-7 py-2">
                {/* Form fields */}
                <form onSubmit={handleFormSubmission}>
                  <input
                    name="fullName"
                    className="mt-2 md:mt-4 p-3 border rounded-md w-full text-sm"
                    placeholder="Full name"
                    required
                  />
                  <input
                    name="email"
                    type="email"
                    className="mt-2 md:mt-4 p-3 border rounded-md w-full text-sm"
                    placeholder="Work email"
                    required
                  />
                  <input
                    name="companyName"
                    className="mt-2 md:mt-4 p-3 border rounded-md w-full text-sm"
                    placeholder="Company name"
                    required
                  />
                  <button
                    type="submit"
                    id="ok-btn"
                    className="mt-6 px-4 py-2 bg-primary text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-primaryHover focus:outline-none focus:ring-2 focus:ring-primaryHover"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Join Waitlist"}
                  </button>
                  {formSubmittedError && (
                    <div className="mt-2 text-xs text-red-500">
                      Error Submitting From. Please try again.
                    </div>
                  )}
                </form>
              </div>
            )}
            <button
              id="cancel-btn"
              className="mt-2 text-sm inline-flex justify-center underline"
              onClick={toggleWaitlistModal}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default WaitlistForm;
