import Map from './Map';
import React, { useState, useEffect } from 'react';
import RestaurantList from "./RestaurantList";
import LoginForm from './LoginForm';
import { createCustomPoint, getCustomPoints, deleteCustomPoint } from './api/customPointApi';
import { createRoute, getRoutes, deleteRoute } from './api/routeApi';
import { logout } from './api/authApi';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

const apikey = '8kY020yd2oSy4ivQKBlxf_a5Bhtizzu0A9deSUakGz8';

const userPosition = { lat: 54.9783, lng: -1.6174 }; // Newcastle
const restaurantList = [
    {
        name: "Eldon Square",
        location: { lat: 54.9747, lng: -1.6134 },
    },
    {
        name: "Tesco Express",
        location: { lat: 54.9775, lng: -1.6142 },
    },
    {
        name: "Grainger Market",
        location: { lat: 54.9728, lng: -1.6145 },
    },
    {
        name: "The Gate",
        location: { lat: 54.9719, lng: -1.6175 },
    },
];

// Extract main app content into a separate component
const MainApp = () => {
    const navigate = useNavigate();
    const [selectedRestaurants, setSelectedRestaurants] = useState([]);
    const [customPoints, setCustomPoints] = useState([]);
    const [newPointName, setNewPointName] = useState('');
    const [newPointLocation, setNewPointLocation] = useState({ lat: null, lng: null });
    const [savedRoutes, setSavedRoutes] = useState([]);
    const [routeName, setRouteName] = useState('');
    const userId = localStorage.getItem('userId');

    // Load user's custom points and routes
    useEffect(() => {
        const loadUserData = async () => {
            try {
                // Load custom points
                const pointsResponse = await getCustomPoints();
                if (pointsResponse.success) {
                    setCustomPoints(pointsResponse.customPoints || []);
                }
                
                // Load routes
                const routesResponse = await getRoutes();
                if (routesResponse.success) {
                    setSavedRoutes(routesResponse.routes || []);
                }
            } catch (error) {
                console.error('Failed to load user data:', error);
            }
        };
        
        loadUserData();
    }, []);

    // Handle login success
    const handleLoginSuccess = (newUserId) => {
        localStorage.setItem('userId', newUserId);
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem('userId');
            // Clear user data
            setSelectedRestaurants([]);
            setCustomPoints([]);
            setSavedRoutes([]);
            // Navigate to login page
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            // Even if API call fails, clear local state and navigate to login page
            localStorage.removeItem('userId');
            setSelectedRestaurants([]);
            setCustomPoints([]);
            setSavedRoutes([]);
            navigate('/login');
        }
    };

    // New: Save current route
    const handleSaveRoute = async (e) => {
        e.preventDefault();
        if (routeName && selectedRestaurants.length > 0) {
            try {
                const newRoute = {
                    name: routeName,
                    locations: [...selectedRestaurants], // Copy current selected locations
                    createdAt: new Date().toISOString(),
                    userId: userId // Add userId association
                };
                
                const response = await createRoute(newRoute);
                
                if (response.success) {
                    console.log('Route saved successfully:', response);
                    // If backend returns a route object with id, use it, otherwise use locally created
                    const savedRoute = response.route || newRoute;
                    setSavedRoutes(prev => [...prev, savedRoute]);
                } else {
                    console.error('Failed to save route:', response.message);
                }
                
                setRouteName('');
            } catch (error) {
                console.error('Error saving route:', error);
            }
        }
    };

    // New: Load saved route
    const loadSavedRoute = (route) => {
        setSelectedRestaurants(route.locations);
    };

    // Handle restaurant click event
    const handleRestaurantClick = (location) => {
        setSelectedRestaurants(prev => {
            const exists = prev.some(l => l.lat === location.lat && l.lng === location.lng);
            return exists
                ? prev.filter(l => !(l.lat === location.lat && l.lng === location.lng))
                : [...prev, location];
        });
    };

    // Handle custom point form submission
    const handleAddCustomPoint = async (e) => {
        e.preventDefault();
        console.log('Form submitted'); // Log submission
        if (newPointName && newPointLocation.lat && newPointLocation.lng) {
            try {
                const newPoint = {
                    name: newPointName,
                    location: newPointLocation,
                    isCustom: true, // Mark as custom point
                    userId: userId // Add userId association
                };
                
                // Send request to backend to create custom point
                const response = await createCustomPoint(newPoint);
                
                if (response.success) {
                    console.log('Custom point saved successfully:', response);
                    // If backend returns a point object with id, use it, otherwise use locally created
                    const savedPoint = response.point || newPoint;
                    setCustomPoints(prev => [...prev, savedPoint]);
                } else {
                    console.error('Failed to save custom point:', response.message);
                }
                
                setNewPointName('');
                setNewPointLocation({ lat: null, lng: null });
            } catch (error) {
                console.error('Error saving custom point:', error);
            }
        } else {
            console.error('Missing name or location'); // Log error
        }
    };

    // Handle map click event (to get custom point location)
    const handleMapClick = (lat, lng) => {
        console.log('Map click received:', lat, lng); // Log map click
        setNewPointLocation({ lat, lng });
    };

    // Merge predefined points and custom points
    const allPoints = [...restaurantList, ...customPoints];

    // Listen for changes in customPoints state
    useEffect(() => {
        console.log('Custom points updated:', customPoints); // Log custom points update
    }, [customPoints]);

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Left Panel */}
            <div style={{
                width: '300px',
                padding: '20px',
                backgroundColor: '#f5f5f5',
                boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)'
            }}>
                {/* User info and logout button */}
                <div style={{marginBottom: '20px', textAlign: 'center'}}>
                    <h3 style={{margin: '0 0 10px 0'}}>Welcome user: {userId}</h3>
                    <button 
                        onClick={handleLogout}
                        style={{...styles.button, backgroundColor: '#dc3545'}}
                    >
                        退出登录
                    </button>
                </div>

                <form onSubmit={handleSaveRoute} style={{marginBottom: '20px'}}>
                    <h3 style={styles.heading}>Save Current Route</h3>
                    <input
                        type="text"
                        placeholder="Route name"
                        value={routeName}
                        onChange={(e) => setRouteName(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <button
                        type="submit"
                        style={styles.button}
                    >
                        Save Route
                    </button>
                </form>
                {/* Add Custom Point Form */}
                <form onSubmit={handleAddCustomPoint} style={{marginBottom: '20px'}}>
                    <h3 style={styles.heading}>Add Custom Point</h3>
                    <input
                        type="text"
                        placeholder="Enter custom point name"
                        value={newPointName}
                        onChange={(e) => setNewPointName(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <div style={{marginTop: '10px'}}>
                        <span style={styles.label}>Click on map to select location</span>
                        <div style={styles.locationDisplay}>
                            {newPointLocation.lat && newPointLocation.lng
                                ? `Selected location: ${newPointLocation.lat.toFixed(4)}, ${newPointLocation.lng.toFixed(4)}`
                                : 'No location selected'}
                        </div>
                    </div>
                    <button
                        type="submit"
                        style={styles.button}
                    >
                        Add Custom Point
                    </button>
                </form>

                {/* Clear Selection Button */}
                <button
                    onClick={() => setSelectedRestaurants([])}
                    style={styles.button}
                >
                    Clear Selection
                </button>

                {/* Display All Points (including custom points) */}
                <RestaurantList
                    list={allPoints}
                    selectedLocations={selectedRestaurants}
                    onClickHandler={handleRestaurantClick}
                />
            </div>

            {/* Map Component */}
            <div style={{flex: 1}}>
                <Map
                    apikey={apikey}
                    userPosition={userPosition}
                    selectedLocations={selectedRestaurants}
                    onMapClick={handleMapClick}
                    customPoints={customPoints}
                    restaurantList={restaurantList}
                />
            </div>
            {/* New: Saved routes list */}
            <div style={{ marginBottom: '20px' }}>
                <h3 style={styles.heading}>Saved Routes</h3>
                <div style={styles.savedRoutesList}>
                    {savedRoutes.map(route => (
                        <div
                            key={route.createdAt}
                            style={styles.routeItem}
                            onClick={() => loadSavedRoute(route)}
                        >
                            <span>{route.name}</span>
                            <small style={styles.dateText}>
                                {new Date(route.createdAt).toLocaleDateString()}
                            </small>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Main App component
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginForm onLoginSuccess={() => {}} />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <MainApp />
                        </ProtectedRoute>
                    }
                />
                {/* Catch all other routes and redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

// CSS Styles
const styles = {
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        marginBottom: '20px',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '16px',
    },
    heading: {
        fontSize: '18px',
        marginBottom: '10px',
        color: '#333',
    },
    label: {
        fontSize: '14px',
        color: '#666',
    },
    locationDisplay: {
        padding: '10px',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '5px',
        marginTop: '5px',
        fontSize: '14px',
        color: '#333',
    },
    savedRoutesList: {
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: '#fff',
    },
    routeItem: {
        padding: '10px',
        cursor: 'pointer',
        borderBottom: '1px solid #eee',
        '&:hover': {
            backgroundColor: '#f8f9fa'
        }
    },
    dateText: {
        color: '#666',
        fontSize: '0.8em',
        marginLeft: '8px'
    }
};

export default App;