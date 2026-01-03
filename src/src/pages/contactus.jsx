import React from "react";
import { MessageCircle, MapPin, Phone } from "lucide-react";
import ContactFormSection from "../components/core/AboutPage/ContactFormSection";

const Contactus = () => {


  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#020617] to-[#000814] flex items-center justify-center px-6">
      
      {/* MAIN WRAPPER */}
      <div className="flex w-full max-w-6xl items-start mt-20 gap-12">

        {/* LEFT CARD */}
        <div className="w-[420px] rounded-2xl bg-[#0b1220] p-10 text-gray-300 shadow-xl">
          <div className="space-y-10">

            {/* Chat */}
            <div className="flex gap-4">
              <MessageCircle className="h-6 w-6 text-yellow-400" />
              <div>
                <h4 className="font-semibold text-white">Chat on us</h4>
                <p className="text-sm text-gray-400">
                  Our friendly team is here to help.
                </p>
                <p className="text-sm text-gray-400">
                  info@studynotion.com
                </p>
              </div>
            </div>

            {/* Visit */}
            <div className="flex gap-4">
              <MapPin className="h-6 w-6 text-yellow-400" />
              <div>
                <h4 className="font-semibold text-white">Visit us</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Akshya Nagar 1st Block 1st Cross,  
                  Ramamurthy Nagar, Bangalore-560016
                </p>
              </div>
            </div>

            {/* Call */}
            <div className="flex gap-4">
              <Phone className="h-6 w-6 text-yellow-400" />
              <div>
                <h4 className="font-semibold text-white">Call us</h4>
                <p className="text-sm text-gray-400">
                  Mon - Fri From 8am to 5pm
                </p>
                <p className="text-sm text-gray-400">
                  +123 456 7869
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT FORM CARD */}
        <div className="flex-1 rounded-2xl border border-gray-700 bg-[#020617] p-10">
          <ContactFormSection />
        </div>

      </div>
    </div>
  );
};

export default Contactus;
