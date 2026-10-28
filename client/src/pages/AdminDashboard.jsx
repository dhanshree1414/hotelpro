import React, { useState, useEffect } from 'react';
import API from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Room Form state
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    title: '',
    type: 'Deluxe',
    pricePerNight: '',
    capacity: 2,
    bedType: 'King Bed',
    sizeSqFt: 400,
    amenities: 'Free Wi-Fi, Air Conditioning, 4K TV, Mini Bar',
    images: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    description: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes, roomsRes] = await Promise.all([
        API.get('/stats/dashboard'),
        API.get('/bookings'),
        API.get('/rooms')
      ]);
      setStats(statsRes.data);
      setBookings(bookingsRes.data);
      setRooms(roomsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await API.put(`/bookings/${bookingId}/status`, { bookingStatus: newStatus });
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to remove this room from inventory?')) return;
    try {
      await API.delete(`/rooms/${roomId}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete room');
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newRoom,
        pricePerNight: Number(newRoom.pricePerNight),
        capacity: Number(newRoom.capacity),
        sizeSqFt: Number(newRoom.sizeSqFt),
        amenities: newRoom.amenities.split(',').map((s) => s.trim()),
        images: newRoom.images.split(',').map((s) => s.trim())
      };

      await API.post('/rooms', payload);
      setShowAddRoom(false);
      setNewRoom({
        roomNumber: '',
        title: '',
        type: 'Deluxe',
        pricePerNight: '',
        capacity: 2,
        bedType: 'King Bed',
        sizeSqFt: 400,
        amenities: 'Free Wi-Fi, Air Conditioning, 4K TV, Mini Bar',
        images: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
        description: ''
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create room');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="mt-2 text-muted">Loading hotel management analytics...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Title */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <span className="badge bg-warning text-dark px-3 py-1 rounded-pill fw-semibold text-uppercase">
            Staff & Manager Portal
          </span>
          <h2 className="brand-font fw-bold mt-1 mb-0">Hotel Operations Dashboard</h2>
        </div>
        <button onClick={() => setShowAddRoom(!showAddRoom)} className="btn btn-hotelpro fw-semibold">
          <i className="bi bi-plus-lg me-1"></i> {showAddRoom ? 'Close Room Form' : 'Add New Room'}
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="row g-3 mb-5">
        <div className="col-md-3 col-sm-6">
          <div className="dashboard-card d-flex align-items-center gap-3">
            <div className="stat-icon bg-success-subtle text-success">
              <i className="bi bi-currency-dollar"></i>
            </div>
            <div>
              <div className="small text-muted fw-semibold">Total Revenue</div>
              <h4 className="fw-bold mb-0 text-dark">${stats?.totalRevenue || 0}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="dashboard-card d-flex align-items-center gap-3">
            <div className="stat-icon bg-primary-subtle text-primary">
              <i className="bi bi-pie-chart"></i>
            </div>
            <div>
              <div className="small text-muted fw-semibold">Occupancy Rate</div>
              <h4 className="fw-bold mb-0 text-dark">{stats?.occupancyRate || 0}%</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="dashboard-card d-flex align-items-center gap-3">
            <div className="stat-icon bg-warning-subtle text-warning">
              <i className="bi bi-journal-check"></i>
            </div>
            <div>
              <div className="small text-muted fw-semibold">Total Bookings</div>
              <h4 className="fw-bold mb-0 text-dark">{stats?.totalBookings || 0}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="dashboard-card d-flex align-items-center gap-3">
            <div className="stat-icon bg-secondary-subtle text-dark">
              <i className="bi bi-door-open"></i>
            </div>
            <div>
              <div className="small text-muted fw-semibold">Total Rooms</div>
              <h4 className="fw-bold mb-0 text-dark">{stats?.totalRooms || 0}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Room Modal / Collapse */}
      {showAddRoom && (
        <div className="card shadow border-0 p-4 mb-5" style={{ borderRadius: '16px' }}>
          <h5 className="fw-bold mb-3"><i className="bi bi-building-add me-2 text-warning"></i> Add New Room to Inventory</h5>
          <form onSubmit={handleCreateRoom} className="row g-3">
            <div className="col-md-3">
              <label className="form-label small fw-semibold">Room Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 301"
                value={newRoom.roomNumber}
                onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                required
              />
            </div>
            <div className="col-md-5">
              <label className="form-label small fw-semibold">Room Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Royal Horizon Suite"
                value={newRoom.title}
                onChange={(e) => setNewRoom({ ...newRoom, title: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold">Room Type</label>
              <select
                className="form-select"
                value={newRoom.type}
                onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
              >
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Executive Suite">Executive Suite</option>
                <option value="Presidential Suite">Presidential Suite</option>
                <option value="Family Suite">Family Suite</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-semibold">Price per Night ($)</label>
              <input
                type="number"
                className="form-control"
                placeholder="150"
                value={newRoom.pricePerNight}
                onChange={(e) => setNewRoom({ ...newRoom, pricePerNight: e.target.value })}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold">Max Guests</label>
              <input
                type="number"
                className="form-control"
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold">Bed Type</label>
              <input
                type="text"
                className="form-control"
                placeholder="1 King Bed"
                value={newRoom.bedType}
                onChange={(e) => setNewRoom({ ...newRoom, bedType: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold">Size (sq ft)</label>
              <input
                type="number"
                className="form-control"
                value={newRoom.sizeSqFt}
                onChange={(e) => setNewRoom({ ...newRoom, sizeSqFt: e.target.value })}
              />
            </div>

            <div className="col-md-12">
              <label className="form-label small fw-semibold">Amenities (comma-separated)</label>
              <input
                type="text"
                className="form-control"
                value={newRoom.amenities}
                onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })}
              />
            </div>

            <div className="col-md-12">
              <label className="form-label small fw-semibold">Image URLs (comma-separated)</label>
              <input
                type="text"
                className="form-control"
                value={newRoom.images}
                onChange={(e) => setNewRoom({ ...newRoom, images: e.target.value })}
              />
            </div>

            <div className="col-md-12">
              <label className="form-label small fw-semibold">Description</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Describe room features and views..."
                value={newRoom.description}
                onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                required
              ></textarea>
            </div>

            <div className="col-12 d-flex justify-content-end gap-2">
              <button type="button" onClick={() => setShowAddRoom(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-hotelpro">Save Room</button>
            </div>
          </form>
        </div>
      )}

      {/* Navigation Tabs */}
      <ul className="nav nav-pills mb-4 gap-2 border-bottom pb-3">
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold ${activeTab === 'bookings' ? 'active bg-dark' : 'text-dark'}`}
            onClick={() => setActiveTab('bookings')}
          >
            <i className="bi bi-calendar2-check me-2"></i> Guest Reservations ({bookings.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold ${activeTab === 'rooms' ? 'active bg-dark' : 'text-dark'}`}
            onClick={() => setActiveTab('rooms')}
          >
            <i className="bi bi-door-closed me-2"></i> Room Inventory ({rooms.length})
          </button>
        </li>
      </ul>

      {/* Bookings Management Table */}
      {activeTab === 'bookings' && (
        <div className="card shadow-sm border-0 p-0 overflow-hidden" style={{ borderRadius: '12px' }}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Booking ID</th>
                  <th>Guest Name</th>
                  <th>Room Info</th>
                  <th>Dates</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td><code className="text-dark small fw-bold">{b._id.slice(-6).toUpperCase()}</code></td>
                    <td>
                      <div className="fw-semibold text-dark">{b.guestName}</div>
                      <div className="small text-muted">{b.guestEmail}</div>
                    </td>
                    <td>
                      <div className="fw-semibold">{b.room?.title || 'Unknown Room'}</div>
                      <span className="badge bg-secondary-subtle text-secondary small">Room #{b.room?.roomNumber}</span>
                    </td>
                    <td>
                      <div className="small">
                        <strong>In:</strong> {new Date(b.checkInDate).toLocaleDateString()}
                      </div>
                      <div className="small">
                        <strong>Out:</strong> {new Date(b.checkOutDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td><strong className="text-success">${b.totalAmount}</strong></td>
                    <td>
                      <span className={`badge ${
                        b.bookingStatus === 'Confirmed' ? 'bg-success' :
                        b.bookingStatus === 'Checked-In' ? 'bg-primary' :
                        b.bookingStatus === 'Checked-Out' ? 'bg-secondary' : 'bg-danger'
                      }`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        style={{ width: '135px' }}
                        value={b.bookingStatus}
                        onChange={(e) => handleStatusChange(b._id, e.target.value)}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Checked-In">Checked-In</option>
                        <option value="Checked-Out">Checked-Out</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rooms Inventory Table */}
      {activeTab === 'rooms' && (
        <div className="card shadow-sm border-0 p-0 overflow-hidden" style={{ borderRadius: '12px' }}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Room #</th>
                  <th>Title & Category</th>
                  <th>Capacity</th>
                  <th>Nightly Rate</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r._id}>
                    <td><strong className="text-dark">#{r.roomNumber}</strong></td>
                    <td>
                      <div className="fw-semibold">{r.title}</div>
                      <span className="badge badge-luxury small">{r.type}</span>
                    </td>
                    <td>{r.capacity} Guests ({r.bedType})</td>
                    <td><strong className="text-dark">${r.pricePerNight}</strong> / night</td>
                    <td><span className="badge bg-success-subtle text-success">{r.status}</span></td>
                    <td>
                      <button
                        onClick={() => handleDeleteRoom(r._id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
