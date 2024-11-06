import React from "react";

const Footer2 = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Us Section */}
        <div className="footer-column">
          <h2 className="footer-title">About Us</h2>
          <p className="footer-text">
            We take pride in serving fresh, flavorful meals with the highest
            quality ingredients. Your satisfaction is our mission!
          </p>
          <p className="footer-text">
            <strong>Hours:</strong> Mon-Sun: 9 AM - 11 PM
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h2 className="footer-title">Quick Links</h2>
          <ul className="footer-links">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Menu</a>
            </li>
            <li>
              <a href="#">Order Now</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className="footer-column">
          <h2 className="footer-title">Stay Updated</h2>
          <p className="footer-text">
            Subscribe to our newsletter for the latest updates and exclusive
            offers.
          </p>
          <form className="newsletter-form">
            <input
              type="email"
              className="newsletter-input text-gray-700"
              placeholder="Enter your email"
            />
            <button type="submit" className="newsletter-btn">
              Subscribe
            </button>
          </form>
        </div>

        <div className="footer-column">
          <h2 className="footer-title">Follow Us</h2>
          <div className="social-icons">
            <a href="#" className="social-icon">
              🐦 Twitter
            </a>
            <a href="#" className="social-icon">
              📸 Instagram
            </a>
            <a href="#" className="social-icon">
              📘 Facebook
            </a>
          </div>

          <h2 className="footer-title">We Accept</h2>
          <div className="payment-icons">
            <span className="payment-icon">💳 Visa</span>
            <span className="payment-icon">💳 MasterCard</span>
            <span className="payment-icon">💳 PayPal</span>
            <span className="payment-icon">📦 Payment on Delivery</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Your Restaurant. All Rights Reserved.</p>
        <p>
          <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer2;
