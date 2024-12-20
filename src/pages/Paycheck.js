/**
 * Paycheck component.
 * Displays a list of user paychecks and allows adding new paychecks.
 *
 * @component
 * @returns {JSX.Element} The rendered Paycheck page.
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/Paycheck.css';


const Paycheck = () => {
    /**
     * React Router's location object.
     * Used to access the state passed via navigation.
     * @type {import('react-router-dom').Location}
     */
    const location = useLocation();

    /**
     * React Router's navigate function.
     * Used to programmatically navigate between routes.
     * @type {import('react-router-dom').NavigateFunction}
     */
    const navigate = useNavigate();

    /**
     * State to store the list of paychecks.
     * @type {[Array<Object>, Function]}
     * @property {string} source - The source of the paycheck.
     * @property {number} amount - The amount of the paycheck.
     * @property {string} date - The date of the paycheck.
     */
    const [paychecks, setPaychecks] = useState([]);

    /**
     * useEffect hook to handle new paycheck data passed via navigation.
     * Adds the new paycheck to the existing list when the component mounts or when location.state changes.
     */
    useEffect(() => {
        // Check if there's new paycheck data in the location state
        if (location.state && location.state.newPaycheck) {
            setPaychecks((prevPaychecks) => [...prevPaychecks, location.state.newPaycheck]);
        }
    }, [location.state]);

    /**
     * Handles navigation to the Add Paycheck page.
     *
     * @function handleAddPaycheck
     * @returns {void}
     */
    const handleAddPaycheck = () => {
        navigate('/add-paycheck');
    };

    return (
        <div className="paycheck-page">
            {/* Sidebar component for navigation */}
            <Sidebar />
            <div className="paycheck-container">
                <h1 className="paycheck-heading">Your Paychecks</h1>
                
                {/* Card to navigate to the Add Paycheck page */}
                <div className="paycheck-card add-card" onClick={handleAddPaycheck}>
                    <p className="paycheck-card-title">Add a New Paycheck</p>
                    <span className="paycheck-arrow">→</span>
                </div>

                {/* Render each paycheck as a card */}
                {paychecks.map((paycheck, index) => (
                    <div key={index} className="paycheck-card">
                        <p className="paycheck-card-title">{paycheck.source}</p>
                        <p>Amount: {paycheck.amount}</p>
                        <p>Date: {paycheck.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * Styles object for the Paycheck component.
 * Note: Styles are managed via the imported 'Paycheck.css' file.
 *
 * @constant
 * @type {Object}
 */
const styles = {
    // Styles are defined in 'Paycheck.css'
};

export default Paycheck;
