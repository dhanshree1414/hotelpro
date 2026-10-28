import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import API from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const location = useLocation();

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/my-bookings');
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.successMessage) {
      setMessage(location.state.successMessage);
    }
    fetchBookings();
  }, [location.state]);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await API.put(`/bookings/${id}/cancel`);
      fetchBookings();
      setMessage('Booking cancelled successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="badge bg-success">Confirmed</span>;
      case 'Checked-In':
        return <span className="badge bg-primary">Checked-In</span>;
      case 'Checked-Out':
        return <span className="badge bg-secondary">Checked-Out</span>;
      case 'Cancelled':
        return <span className="badge bg-danger">Cancelled</span>;
      default:
        return <span className="badge bg-warning text-dark">{status}</span>;
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="brand-font fw-bold mb-1">My Reservations & Stays</h2>
          <p className="text-muted small mb-0">Track your past, active, and upcoming bookings</p>
        </div>
        <Link to="/rooms" className="btn btn-hotelpro fw-semibold">
          <i className="bi bi-plus-circle me-1"></i> Book Another Room
        </Link>
      </div>

      {message && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle me-2"></i> {message}
          <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card text-center p-5 border-0 shadow-sm">
          <i className="bi bi-calendar2-range display-3 text-muted mb-3"></i>
          <h4>No Bookings Found</h4>
          <p className="text-muted">You haven't made any reservations yet. Discover our rooms and plan your stay.</p>
          <Link to="/rooms" className="btn btn-outline-dark mx-auto mt-2">Explore Accommodations</Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {bookings.map((booking) => {
            const room = booking.room;
            const primaryImg = room?.images && room.images.length > 0
              ? room.images[0]
              : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80';

            return (
              <div key={booking._id} className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '12px' }}>
                <div className="row g-0">
                  <div className="col-md-3">
                    <img
                      src={primaryImg}
                      alt={room?.title || 'Room'}
                      className="w-100 h-100 object-fit-cover"
                      style={{ minHeight: '180px' }}
                    />
                  </div>
                  <div className="col-md-9 p-4 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
                        <div>
                          <h5 className="fw-bold mb-1">{room?.title || 'Luxury Room'}</h5>
                          <span className="text-muted small">
                            Booking ID: <code className="text-dark fw-bold">{booking._id}</code> • Room #{room?.roomNumber || 'N/A'}
                          </span>
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                          {getStatusBadge(booking.bookingStatus)}
                          <span className="badge bg-light text-dark border">
                            {booking.paymentStatus === 'Paid' ? '💳 Paid' : booking.paymentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="row g-3 py-2 text-secondary small">
                        <div className="col-sm-4">
                          <span className="text-muted d-block">Check-In:</span>
                          <strong className="text-dark">
                            {new Date(booking.checkInDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                          </strong>
                        </div>
                        <div className="col-sm-4">
                          <span className="text-muted d-block">Check-Out:</span>
                          <strong className="text-dark">
                            {new Date(booking.checkOutDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                          </strong>
                        </div>
                        <div className="col-sm-4">
                          <span className="text-muted d-block">Total Paid ({booking.totalNights} nights):</span>
                          <strong className="text-success fs-6">${booking.totalAmount}</strong>
                        </div>
                      </div>

                      {booking.specialRequests && (
                        <div className="small text-muted bg-light p-2 rounded mt-2">
                          <strong>Note:</strong> {booking.specialRequests}
                        </div>
                      )}
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-3 pt-2 border-top">
                      {booking.bookingStatus === 'Confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          <i className="bi bi-x-circle me-1"></i> Cancel Booking
                        </button>
                      )}
                      <button
                        onClick={() => window.print()}
                        className="btn btn-sm btn-outline-secondary"
                      >
                        <i className="bi bi-printer me-1"></i> Print Invoice
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
