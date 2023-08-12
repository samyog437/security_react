import React from "react";
import about_us from "../assets/images/about-us.jpg"
import about_us_2 from "../assets/images/about-us-2.jpg"

const AboutUs = () => {
  return (
    <div className="text-center about-us-parent">
        <h3 className="page-title">About AgriMart</h3>
      <div className="about-us-container">
        <div className="top-row">
          <div className="left-image">
            <img src={about_us_2} alt="AgriMart" className="agrimart-image" />
          </div>
          <div className="right-content">
            <p>
              Welcome to AgriMart, your one-stop online marketplace for fresh and
              high-quality agricultural products. Our mission is to connect farmers
              and consumers, making it easier for you to access the freshest
              produce from local farms.
            </p>
            <p>
              At AgriMart, we prioritize sustainability and supporting local
              farmers. We believe in the importance of promoting environmentally
              friendly practices and ensuring fair prices for both farmers and
              consumers.
            </p>
          </div>
        </div>
        <div className="bottom-row">
          <div className="left-content">
            <h3>Our Vision</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
              tincidunt diam vitae augue ullamcorper vulputate. Donec ac sagittis
              elit. Vivamus et sem a nunc placerat venenatis ut et purus.
            </p>
          </div>
          <div className="right-image">
            <img src={about_us} alt="AgriMart" className="agrimart-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
