/**
 * DashboardCard component.
 * Displays a card with a title, detail, and navigates to a specified link when clicked.
 * Can display different content based on the `isChart` and `isEarnings` props.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.title - The title to display on the card.
 * @param {string} props.detail - The detail information to display on the card.
 * @param {string} [props.link] - The route to navigate to when the card is clicked.
 * @param {boolean} [props.isChart=false] - If true, displays a placeholder for a chart.
 * @param {boolean} [props.isEarnings=false] - If true, formats the detail as earnings information.
 * @returns {JSX.Element} The rendered DashboardCard component.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardCard.css";

const DashboardCard = ({ title, detail, link, isChart = false, isEarnings = false }) => {
  /**
   * React Router's navigate function.
   * Used to programmatically navigate to different routes.
   *
   * @type {import('react-router-dom').NavigateFunction}
   */
  const navigate = useNavigate();

  /**
   * Handles the click event on the card.
   * Navigates to the specified link if provided.
   *
   * @function handleClick
   * @returns {void}
   */
  const handleClick = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <div className="card" onClick={handleClick}>
      <p>{title}</p>
      <span className="arrow">→</span>
      {isChart ? (
        // Placeholder for spending chart
        <div className="spending-chart-placeholder"></div>
      ) : isEarnings ? (
        // Display earnings details split into heading and paragraph
        <div>
          <h3>{detail.split("\n")[0]}</h3>
          <p>{detail.split("\n")[1]}</p>
        </div>
      ) : (
        // Display regular detail text
        <p className="card-detail">{detail}</p>
      )}
    </div>
  );
};

export default DashboardCard;
