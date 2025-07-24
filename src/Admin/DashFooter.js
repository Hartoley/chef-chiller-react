import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#0B1220] text-[#D1D5DB] ">
      {/* Newsletter Section */}
      <div className=" px-2 py-12 w-full flex items-center justify-center md:px-20 lg:px-32 h-[60vh] text-center">
        <div className="newsletter px-0 py-12 w-[90%] flex flex-col items-center md:px-20 lg:px-32 rounded-lg bg-[#111827] h-[40vh] text-center">
          <h2 className="text-white text-3xl font-semibold mb-3">
            Stay Updated
          </h2>
          <p className="text-[#9CA3AF] mb-6 text-lg">
            Subscribe to our newsletter for the latest updates and exclusive
            offers.
          </p>
          <div className="emailInput flex justify-center items-center gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-[#1F2937] text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F43F5E] placeholder-[#9CA3AF]"
            />
            <button
              type="button"
              className="px-6 py-3 bg-[#F43F5E] text-white font-medium rounded-md hover:bg-[#E11D48] transition duration-200"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="px-6 py-10 md:px-20 lg:px-32 border-t border-[#1F2937]">
        <div className="footer1 grid grid-cols-1 md:grid-cols-3 gap-40">
          {/* About Section */}
          <div>
            <p className="text-[#9CA3AF] leading-relaxed">
              We take pride in serving fresh, flavorful meals with the highest
              quality ingredients. Your satisfaction is our mission!
            </p>
            <p className="mt-4 text-white">
              <span className="font-semibold">Hours:</span> Mon-Sun: 9 AM - 11
              PM
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-start w-60 flex flex-col items-start md:text-left ">
            <p className="text-white font-semibold mb-4">Quick Links</p>
            <ul className="space-y-2 pl-0">
              <li>
                <p
                  href="/"
                  className="hover:text-[#F43F5E] transition duration-200"
                >
                  Home
                </p>
              </li>
              <li>
                <p
                  href="/menu"
                  className="hover:text-[#F43F5E] transition duration-200"
                >
                  Menu
                </p>
              </li>
              <li>
                <p
                  href="/order"
                  className="hover:text-[#F43F5E] transition duration-200"
                >
                  Order
                </p>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="text-start flex flex-col items-start ">
            <p className="text-white font-semibold mb-4">Company</p>
            <ul className="space-y-2 w-60 pl-0">
              <li>
                <p
                  href="/about"
                  className="hover:text-[#F43F5E] transition duration-200"
                >
                  About Us
                </p>
              </li>
              <li>
                <p
                  href="/contact"
                  className="hover:text-[#F43F5E] transition duration-200"
                >
                  Contact Us
                </p>
              </li>
              <li>
                <p
                  href="/privacy"
                  className="hover:text-[#F43F5E] transition duration-200"
                >
                  Privacy Policy
                </p>
              </li>
              <li>
                <p
                  href="/terms"
                  className="hover:text-[#F43F5E] transition duration-200"
                >
                  Terms of Service
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-[#1F2937] py-6 px-6 md:px-20 lg:px-32 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-[#9CA3AF]">
          © 2024 Chef Keena. All Rights Reserved
        </p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a
            href="#"
            className="text-[#9CA3AF] hover:text-[#F43F5E] transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M22.54 6.42a9.21 9.21 0 0 1-2.66.73 4.6 4.6 0 0 0 2.02-2.54 9.3 9.3 0 0 1-2.92 1.11 4.56 4.56 0 0 0-7.76 4.15A12.94 12.94 0 0 1 1.64 4.15a4.56 4.56 0 0 0 1.41 6.08 4.56 4.56 0 0 1-2.07-.57v.06a4.56 4.56 0 0 0 3.65 4.47 4.56 4.56 0 0 1-2.06.08 4.56 4.56 0 0 0 4.26 3.17A9.13 9.13 0 0 1 .58 18.9a12.87 12.87 0 0 0 6.95 2.04c8.35 0 12.91-6.91 12.91-12.91 0-.2 0-.41-.01-.61a9.21 9.21 0 0 0 2.27-2.35z" />
            </svg>
          </a>
          <a
            href="#"
            className="text-[#9CA3AF] hover:text-[#F43F5E] transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 .5a11.8 11.8 0 0 0-3.74.58 11.66 11.66 0 0 0-2.84 1.69 11.72 11.72 0 0 0-2.15 2.15 11.62 11.62 0 0 0-1.69 2.84A11.8 11.8 0 0 0 .5 12a11.8 11.8 0 0 0 .58 3.74 11.66 11.66 0 0 0 1.69 2.84 11.72 11.72 0 0 0 2.15 2.15 11.62 11.62 0 0 0 2.84 1.69A11.8 11.8 0 0 0 12 23.5a11.8 11.8 0 0 0 3.74-.58 11.66 11.66 0 0 0 2.84-1.69 11.72 11.72 0 0 0 2.15-2.15 11.62 11.62 0 0 0 1.69-2.84A11.8 11.8 0 0 0 23.5 12a11.8 11.8 0 0 0-.58-3.74 11.66 11.66 0 0 0-1.69-2.84 11.72 11.72 0 0 0-2.15-2.15 11.62 11.62 0 0 0-2.84-1.69A11.8 11.8 0 0 0 12 .5zm0 21a9.65 9.65 0 0 1-7.25-3.01A9.65 9.65 0 0 1 1.74 12a9.65 9.65 0 0 1 3.01-7.25A9.65 9.65 0 0 1 12 1.74a9.65 9.65 0 0 1 7.25 3.01A9.65 9.65 0 0 1 22.26 12a9.65 9.65 0 0 1-3.01 7.25A9.65 9.65 0 0 1 12 22.26z" />
            </svg>
          </a>
          <a
            href="#"
            className="text-[#9CA3AF] hover:text-[#F43F5E] transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2.04c-5.5 0-9.96 4.47-9.96 9.96 0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.29-3.37-1.29-.45-1.14-1.1-1.44-1.1-1.44-.9-.61.07-.6.07-.6 1 .07 1.52 1.02 1.52 1.02.9 1.53 2.36 1.09 2.93.83.09-.65.36-1.09.65-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.03.8-.22 1.65-.33 2.5-.33s1.7.11 2.5.33c1.91-1.3 2.75-1.03 2.75-1.03.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.35 4.68-4.58 4.93.37.32.7.94.7 1.91 0 1.38-.01 2.49-.01 2.83 0 .27.18.59.7.49 3.98-1.33 6.85-5.08 6.85-9.5-.02-5.49-4.48-9.96-9.98-9.96z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
