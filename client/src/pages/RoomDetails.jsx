import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking Form State
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 3);

  const [checkInDate, setCheckInDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [checkOutDate, setCheckOutDate] = useState(dayAfter.toISOString().split('T')[0]);
  const [specialRequests, setSpecialRequests] = useState('');
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '+1 (555) 123-4567');

  // Booking submit state
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await API.get(`/rooms/${id}`);
        setRoom(data);
      } catch (err) {
        setError('Room details could not be loaded.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  useEffect(() => {
    if (user) {
      if (!guestName) setGuestName(user.name);
      if (!guestEmail) setGuestEmail(user.email);
      if (!guestPhone && user.phone) setGuestPhone(user.phone);
    }
  }, [user]);

  // Pricing calculations
  const calculateDays = () => {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const nights = calculateDays();
  const baseCost = room ? nights * room.pricePerNight : 0;
  const serviceFee = Math.round(baseCost * 0.1);
  const totalAmount = baseCost + serviceFee;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { message: 'Please sign in to complete your reservation.' } });
      return;
    }

    if (nights <= 0) {
      setBookingError('Check-out date must be after check-in date.');
      return;
    }

    setBookingLoading(true);
    setBookingError('');

    try {
      await API.post('/bookings', {
        roomId: room._id,
        guestName,
        guestEmail,
        guestPhone,
        checkInDate,
        checkOutDate,
        specialRequests,
        paymentMethod: 'Credit Card (Simulated)'
      });

      navigate('/my-bookings', { state: { successMessage: 'Your reservation was confirmed successfully!' } });
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Booking could not be created.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-danger">{error || 'Room not found'}</h4>
        <button onClick={() => navigate('/rooms')} className="btn btn-dark mt-3">Back to Rooms</button>
      </div>
    );
  }

  const primaryImage = (room.images && room.images.length > 0)
    ? room.images[0]
    : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="container py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-muted">Home</a></li>
          <li className="breadcrumb-item"><a href="/rooms" className="text-decoration-none text-muted">Rooms</a></li>
          <li className="breadcrumb-item active text-dark fw-bold" aria-current="page">{room.title}</li>
        </ol>
      </nav>

      <div className="row g-4">
        {/* Left Column: Room Presentation */}
        <div className="col-lg-8">
          <div className="rounded-4 overflow-hidden shadow-sm mb-4" style={{ maxHeight: '460px' }}>
            <img src={primaryImage} alt={room.title} className="w-100 h-100 object-fit-cover" />
          </div>

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <div>
              <span className="badge badge-luxury fs-6 me-2">{room.type}</span>
              <span className="badge bg-dark fs-6">Room #{room.roomNumber}</span>
            </div>
            <div className="fs-5 text-warning fw-bold">
              <i className="bi bi-star-fill me-1"></i>{room.rating || 4.9} / 5.0
            </div>
          </div>

          <h2 className="brand-font fw-bold mb-3">{room.title}</h2>
          <p className="lead text-muted fs-6">{room.description}</p>

          <hr className="my-4" />

          {/* Key Room Specs */}
          <h5 className="fw-bold mb-3">Accommodation Overview</h5>
          <div className="row g-3 text-secondary mb-4">
            <div className="col-sm-4">
              <div className="p-3 bg-white border rounded-3 d-flex align-items-center gap-3">
                <i className="bi bi-people fs-3 text-warning"></i>
                <div>
                  <div className="small text-muted">Capacity</div>
                  <div className="fw-bold text-dark">{room.capacity} Guests</div>
                </div>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="p-3 bg-white border rounded-3 d-flex align-items-center gap-3">
                <i className="bi bi-moon-stars fs-3 text-warning"></i>
                <div>
                  <div className="small text-muted">Bedding</div>
                  <div className="fw-bold text-dark">{room.bedType || 'King Bed'}</div>
                </div>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="p-3 bg-white border rounded-3 d-flex align-items-center gap-3">
                <i className="bi bi-aspect-ratio fs-3 text-warning"></i>
                <div>
                  <div className="small text-muted">Room Size</div>
                  <div className="fw-bold text-dark">{room.sizeSqFt || 400} sq ft</div>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities List */}
          <h5 className="fw-bold mb-3">Included Amenities & Services</h5>
          <div className="row g-2 mb-4">
            {room.amenities && room.amenities.map((amenity, index) => (
              <div className="col-md-6" key={index}>
                <div className="d-flex align-items-center gap-2 text-dark">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span>{amenity}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="alert alert-light border small text-muted">
            <i className="bi bi-info-circle me-1 text-primary"></i> <strong>Check-in:</strong> From 3:00 PM • <strong>Check-out:</strong> Until 11:00 AM • Complimentary luggage storage and valet parking included.
          </div>
        </div>

        {/* Right Column: Reservation & Instant Checkout Widget */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-lg p-4 sticky-top" style={{ top: '90px', borderRadius: '16px' }}>
            <div className="d-flex justify-content-between align-items-baseline mb-3">
              <div>
                <span className="fs-3 fw-bold text-dark">${room.pricePerNight}</span>
                <span className="text-muted small"> / night</span>
              </div>
              <span className="badge bg-success-subtle text-success border border-success-subtle">
                Instant Confirmation
              </span>
            </div>

            {bookingError && (
              <div className="alert alert-danger small py-2">{bookingError}</div>
            )}

            <form onSubmit={handleBookingSubmit}>
              {/* Dates */}
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold">Check-In</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold">Check-Out</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Guest Details */}
              <div className="mb-2">
                <label className="form-label small fw-bold">Guest Full Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter guest name"
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label small fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control form-control-sm"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Phone Number</label>
                <input
                  type="tel"
                  className="form-control form-control-sm"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Special Requests</label>
                <textarea
                  className="form-control form-control-sm"
                  rows="2"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="High floor, quiet room, late check-in..."
                ></textarea>
              </div>

              {/* Payment simulation */}
              <div className="p-3 bg-light rounded-3 mb-3 border">
                <div className="small fw-bold text-dark mb-2">
                  <i className="bi bi-credit-card me-1 text-warning"></i> Payment Details (Simulated)
                </div>
                <div className="small text-muted mb-2">Card ending in •••• 4242 (Test Mode)</div>
                <div className="badge bg-secondary-subtle text-secondary small">Zero charge card simulation</div>
              </div>

              {/* Price Calculation breakdown */}
              <div className="border-top pt-3 mb-3 small">
                <div className="d-flex justify-content-between mb-1">
                  <span>${room.pricePerNight} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                  <span>${baseCost}</span>
                </div>
                <div className="d-flex justify-content-between mb-1 text-muted">
                  <span>Service & Hospitality Tax (10%)</span>
                  <span>${serviceFee}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between fw-bold text-dark fs-6">
                  <span>Total Due</span>
                  <span>${totalAmount}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading || nights <= 0}
                className="btn btn-hotelpro w-100 py-2 fw-semibold"
              >
                {bookingLoading ? (
                  <span><span className="spinner-border spinner-border-sm me-2"></span>Confirming...</span>
                ) : user ? (
                  <span>Confirm & Book Now (${totalAmount})</span>
                ) : (
                  <span>Sign In & Book Now</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
