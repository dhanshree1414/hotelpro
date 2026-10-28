import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import RoomCard from '../components/RoomCard';

const Home = () => {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search Bar State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [type, setType] = useState('All');
  const [capacity, setCapacity] = useState('2');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await API.get('/rooms');
        setFeaturedRooms(data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (checkIn) queryParams.append('checkIn', checkIn);
    if (checkOut) queryParams.append('checkOut', checkOut);
    if (type !== 'All') queryParams.append('type', type);
    if (capacity) queryParams.append('capacity', capacity);

    navigate(`/rooms?${queryParams.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-center position-relative">
        <div className="container py-4">
          <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold text-uppercase mb-3 tracking-wide">
            ★ Five-Star Luxury Hospitality
          </span>
          <h1 className="display-4 fw-bold brand-font mb-3">
            Experience Unmatched Comfort & Elegance
          </h1>
          <p className="lead text-light mb-5 mx-auto" style={{ maxWidth: '700px' }}>
            Book premier rooms and suites with state-of-the-art amenities, ocean views, and seamless concierge service.
          </p>

          {/* Quick Booking Engine Bar */}
          <div className="card shadow-lg border-0 p-4 mx-auto" style={{ maxWidth: '1000px', borderRadius: '16px' }}>
            <form onSubmit={handleSearchSubmit} className="row g-3 align-items-end text-start text-dark">
              <div className="col-md-3">
                <label className="form-label small fw-bold text-muted mb-1">
                  <i className="bi bi-calendar-event me-1 text-warning"></i> Check-In
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label small fw-bold text-muted mb-1">
                  <i className="bi bi-calendar-check me-1 text-warning"></i> Check-Out
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <label className="form-label small fw-bold text-muted mb-1">
                  <i className="bi bi-tag me-1 text-warning"></i> Room Type
                </label>
                <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="All">All Types</option>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Executive Suite">Executive</option>
                  <option value="Presidential Suite">Presidential</option>
                  <option value="Family Suite">Family</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label small fw-bold text-muted mb-1">
                  <i className="bi bi-people me-1 text-warning"></i> Guests
                </label>
                <select className="form-select" value={capacity} onChange={(e) => setCapacity(e.target.value)}>
                  <option value="1">1 Person</option>
                  <option value="2">2 Persons</option>
                  <option value="3">3 Persons</option>
                  <option value="4">4+ Persons</option>
                </select>
              </div>

              <div className="col-md-2">
                <button type="submit" className="btn btn-hotelpro w-100 py-2 fw-semibold">
                  <i className="bi bi-search me-1"></i> Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Value Proposition / Features */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h6 className="text-warning fw-bold text-uppercase">Why HotelPro</h6>
            <h2 className="brand-font fw-bold">Designed For Modern Hospitality</h2>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-3">
              <div className="p-4 rounded-3 border bg-light h-100">
                <div className="stat-icon bg-warning text-dark mx-auto mb-3">
                  <i className="bi bi-shield-check"></i>
                </div>
                <h5 className="fw-bold mb-2">Secure Reservations</h5>
                <p className="text-muted small mb-0">Encrypted JWT auth with instant booking confirmation and receipt tracking.</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-4 rounded-3 border bg-light h-100">
                <div className="stat-icon bg-dark text-warning mx-auto mb-3">
                  <i className="bi bi-clock-history"></i>
                </div>
                <h5 className="fw-bold mb-2">Real-Time Inventory</h5>
                <p className="text-muted small mb-0">Automated double-booking prevention and dynamic room availability status.</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-4 rounded-3 border bg-light h-100">
                <div className="stat-icon bg-warning text-dark mx-auto mb-3">
                  <i className="bi bi-gem"></i>
                </div>
                <h5 className="fw-bold mb-2">Luxury Accommodations</h5>
                <p className="text-muted small mb-0">Handpicked suites with premium bedding, spa baths, and skyline vistas.</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-4 rounded-3 border bg-light h-100">
                <div className="stat-icon bg-dark text-warning mx-auto mb-3">
                  <i className="bi bi-credit-card-2-front"></i>
                </div>
                <h5 className="fw-bold mb-2">Instant Invoicing</h5>
                <p className="text-muted small mb-0">Automated billing breakdown with zero hidden fees and transparent charges.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-5" style={{ backgroundColor: '#f1f5f9' }}>
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
            <div>
              <h6 className="text-warning fw-bold text-uppercase">Exclusive Selections</h6>
              <h2 className="brand-font fw-bold mb-0">Featured Rooms & Suites</h2>
            </div>
            <button onClick={() => navigate('/rooms')} className="btn btn-outline-dark fw-medium">
              View All Accommodations <i className="bi bi-arrow-right ms-1"></i>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status"></div>
            </div>
          ) : (
            <div className="row g-4">
              {featuredRooms.map((room) => (
                <div className="col-lg-4 col-md-6" key={room._id}>
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
