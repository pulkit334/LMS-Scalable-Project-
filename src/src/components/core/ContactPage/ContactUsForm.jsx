/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Enqiry, submitEnquiry } from "../../../services/auth"; 
import countrycode from "../../../data/countrycode.json";

export const ContactUsForm = () => {
  const [loading, setloading] = useState(false);

  const submitContactForm = async (data) => {
    try {
      setloading(true);
      await submitEnquiry(data);
    } catch {
      // error toast already handled in service
    } finally {
      setloading(false);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(
        {
          firstName: "",
          lastName: "",
          email: "",
          message: "",
          contactNumber: "",
        },
        {
          keepIsSubmitSuccessful: true,
        }
      );
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <>
      {/*  ADDED: SUCCESS SCREEN */}
      {isSubmitSuccessful && (
        <div className="mx-auto max-w-xl rounded-xl border border-green-500 bg-green-500/10 p-10 text-center text-green-400 animate-[successPop_0.4s_ease-out]">
          <h2 className="text-2xl font-bold">Form Submitted</h2>
          <p className="mt-2 text-sm">
            Thank you! We will contact you shortly.
          </p>
        </div>
      )}

      {/*  ADDED: FORM WRAPPER (NO INTERNAL CHANGE) */}
      {!isSubmitSuccessful && (
        <form onSubmit={handleSubmit(submitContactForm)}>
          <div className="mx-auto max-w-xl rounded-xl bg-linear-to-b from-[] to-[#000814] p-8 text-white">
            {/* Heading */}
            <h2 className="text-center text-3xl font-bold">Get in Touch</h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              We'd love to here for you, Please fill out this form.
            </p>

            <div className="mt-8 flex flex-col gap-6">
              {/* First + Last Name */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="Enter first name"
                    {...register("firstName", { required: true })}
                    className="rounded-md bg-gray-700 px-4 py-3 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-400"
                  />
                  {errors.firstName && (
                    <span className="text-sm text-red-400">
                      Please enter your first name
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Enter last name"
                    {...register("lastName")}
                    className="rounded-md bg-gray-700 px-4 py-3 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email address"
                  {...register("email", { required: true })}
                  className="rounded-md bg-gray-700 px-4 py-3 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-400"
                />
                {errors.email && (
                  <span className="text-sm text-red-400">
                    Please enter your email
                  </span>
                )}
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <label htmlFor="contactNumber">Phone Number</label>

                <div className="flex items-center gap-3">
                  <select
                    {...register("countrycode", { required: true })}
                    className="h-12 w-15 rounded-md bg-gray-700 px-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    {countrycode.map((element, index) => (
                      <option key={index}>
                        {element.code}-{element.country}
                      </option>
                    ))}
                  </select>

                  <input
                    type="tel"
                    placeholder="12345 67890"
                    {...register("contactNumber", {
                      required: "Phone number is required",
                      minLength: { value: 10, message: "Invalid Phone Number" },
                      maxLength: { value: 10, message: "Invalid Phone Number" },
                    })}
                    className="h-12 flex-1 rounded-md bg-gray-700 px-4 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                {errors.contactNumber && (
                  <span className="text-sm text-red-400">
                    {errors.contactNumber.message}
                  </span>
                )}
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="6"
                  placeholder="Enter your message here"
                  {...register("message", { required: true })}
                  className="rounded-md bg-gray-700 px-4 py-3 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-400 resize-none"
                />
                {errors.message && (
                  <span className="text-sm text-red-400">
                    Please enter your message
                  </span>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-md bg-yellow-400 py-3 font-bold text-black transition hover:bg-yellow-300 disabled:opacity-50"
              >
                Send Message
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};
