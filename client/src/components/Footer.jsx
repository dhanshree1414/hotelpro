import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto border-top border-secondary">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h4 className="brand-font mb-3">
              <span style={{ color: 'var(--accent-color)' }}>🏨 Hotel</span>Pro
            </h4>
            <p className="text-secondary small">
              A comprehensive hospitality and hotel management platform delivering seamless guest reservations, real-time room tracking, and automated staff workflows.
            </p>
            <div className="d-flex gap-3 fs-5 text-secondary">
              <a href="#" className="text-secondary"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-secondary"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-secondary"><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="text-secondary"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-uppercase fw-semibold mb-3 text-warning">Quick Links</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li><Link to="/" className="text-decoration-none text-secondary">Home</Link></li>
              <li><Link to="/rooms" className="text-decoration-none text-secondary">Available Rooms</Link></li>
              <li><Link to="/my-bookings" className="text-decoration-none text-secondary">Manage Bookings</Link></li>
              <li><Link to="/admin" className="text-decoration-none text-secondary">Admin Portal</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-semibold mb-3 text-warning">Room Collections</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li>Executive Suites</li>
              <li>Grand Deluxe King Rooms</li>
              <li>Presidential Penthouses</li>
              <li>Family Courtyard Suites</li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-semibold mb-3 text-warning">Concierge & Support</h6>
            <p className="text-secondary small mb-1"><i className="bi bi-geo-alt me-2 text-warning"></i>742 Evergreen Boulevard, Suite 500</p>
            <p className="text-secondary small mb-1"><i className="bi bi-telephone me-2 text-warning"></i>+1 (800) 555-HOTEL</p>
            <p className="text-secondary small"><i className="bi bi-envelope me-2 text-warning"></i>concierge@hotelpro.com</p>
          </div>
        </div>

        <hr className="my-4 border-secondary" />

        <div className="d-flex flex-wrap justify-content-between align-items-center small text-secondary">
          <p className="mb-0">© {new Date().getFullYear()} HotelPro Management System. All rights reserved.</p>
          <p className="mb-0">Built for Portfolio & Mentor Evaluation (MERN Stack)</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
