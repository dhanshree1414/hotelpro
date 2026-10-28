import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import RoomCard from '../components/RoomCard';

const Rooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States initialized from URL params if present
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || 'All');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '600');
  const [capacity, setCapacity] = useState(searchParams.get('capacity') || 'All');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');

  const fetchFilteredRooms = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (type !== 'All') params.type = type;
      if (maxPrice) params.maxPrice = maxPrice;
      if (capacity !== 'All') params.capacity = capacity;
      if (checkIn) params.checkIn = checkIn;
      if (checkOut) params.checkOut = checkOut;

      const { data } = await API.get('/rooms', { params });
      setRooms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredRooms();
  }, [type, maxPrice, capacity, checkIn, checkOut]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFilteredRooms();
  };

  const handleResetFilters = () => {
    setSearch('');
    setType('All');
    setMaxPrice('600');
    setCapacity('All');
    setCheckIn('');
    setCheckOut('');
    setSearchParams({});
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <span className="badge bg-warning text-dark px-3 py-1 rounded-pill fw-semibold text-uppercase">
          Inventory & Availability
        </span>
        <h1 className="brand-font fw-bold mt-2">Explore Available Rooms & Suites</h1>
        <p className="text-muted">Browse through our luxury inventory and check real-time availability</p>
      </div>

      <div className="row g-4">
        {/* Filters Sidebar */}
        <div className="col-lg-3">
          <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: '90px', borderRadius: '12px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0"><i className="bi bi-funnel me-1 text-warning"></i> Filters</h5>
              <button onClick={handleResetFilters} className="btn btn-sm text-muted p-0">
                <i className="bi bi-arrow-counterclockwise"></i> Reset
              </button>
            </div>

            {/* Keyword Search */}
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <label className="form-label small fw-semibold">Search by Name or #</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Deluxe, Penthouse"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-dark" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>

            {/* Room Type */}
            <div className="mb-4">
              <label className="form-label small fw-semibold">Room Collection</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="All">All Categories</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Executive Suite">Executive Suite</option>
                <option value="Presidential Suite">Presidential Suite</option>
                <option value="Family Suite">Family Suite</option>
              </select>
            </div>

            {/* Maximum Price */}
            <div className="mb-4">
              <div className="d-flex justify-content-between">
                <label className="form-label small fw-semibold">Max Price / Night</label>
                <span className="fw-bold text-dark">${maxPrice}</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="50"
                max="800"
                step="25"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            {/* Capacity */}
            <div className="mb-4">
              <label className="form-label small fw-semibold">Minimum Capacity</label>
              <select className="form-select" value={capacity} onChange={(e) => setCapacity(e.target.value)}>
                <option value="All">Any Size</option>
                <option value="1">1 Person</option>
                <option value="2">2 Persons</option>
                <option value="3">3 Persons</option>
                <option value="4">4+ Persons</option>
              </select>
            </div>

            {/* Dates */}
            <div className="mb-3">
              <label className="form-label small fw-semibold">Stay Dates</label>
              <input
                type="date"
                className="form-control mb-2"
                placeholder="Check-In"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
              <input
                type="date"
                className="form-control"
                placeholder="Check-Out"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Room Cards Grid */}
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-3 text-muted small">
            <span>Showing <strong className="text-dark">{rooms.length}</strong> available options</span>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status"></div>
              <p className="mt-2 text-muted">Checking real-time room availability...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="card text-center p-5 border-0 shadow-sm">
              <i className="bi bi-calendar-x display-4 text-warning mb-3"></i>
              <h4 className="fw-bold">No Rooms Found</h4>
              <p className="text-muted">Try adjusting your filters or selecting alternate dates.</p>
              <button onClick={handleResetFilters} className="btn btn-outline-dark mx-auto mt-2">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {rooms.map((room) => (
                <div className="col-md-6" key={room._id}>
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rooms;
