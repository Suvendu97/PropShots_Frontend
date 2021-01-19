import React, { Component, useState } from "react";
import Signup from "./SignUp";
import Login from "./Login";
function HomeOld() {
  const [show, setShow] = useState(false);
  const [showlogin, setShowlogin] = useState(false);

  return (
    <>
      <div>
        <link rel="stylesheet" href="resources/css/homeOld.css" />
        <div id="Web_1920__2-_Home_Page">
          <img id="webaliser-_TPTXZd9mOo-unsplash" src="resources\img\image.png" alt="home-img" />
          <div id="Group_2">
            <svg className="Rectangle_25_bw">
              <linearGradient id="Rectangle_25_bw">
                <stop offset="0" stopColor="#fd4270" stopOpacity="1"></stop>
                <stop offset="1" stopColor="#fd6d5a" stopOpacity="1"></stop>
              </linearGradient>
              <rect id="Rectangle_25_bw"></rect>
            </svg>
          </div>
          <svg className="Rectangle_26">
            <rect id="Rectangle_26"></rect>
          </svg>
          <div id="PropShots">
            <span>PropShots</span>
          </div>
          <div id="Group_3">
            <svg className="Rectangle_27_b">
              <linearGradient id="Rectangle_27_b">
                <stop offset="0" stopColor="#fd466e"></stop>
                <stop offset="1" stopColor="#fd6b5b"></stop>
              </linearGradient>
              <rect id="Rectangle_27_b"></rect>
            </svg>
            <svg className="Rectangle_31_b">
              <linearGradient id="Rectangle_31_b">
                <stop offset="0" stopColor="#fd466e"></stop>
                <stop offset="1" stopColor="#fd6b5b"></stop>
              </linearGradient>
              <rect id="Rectangle_31_b"></rect>
            </svg>
            <div id="Let_us_Tell_The_World_About_it">
              <span>Let us Tell The World About it</span>
            </div>
            <svg className="Rectangle_30_b">
              <linearGradient id="Rectangle_30_b">
                <stop offset="0" stopColor="#fd466e"></stop>
                <stop offset="1" stopColor="#fd6b5b"></stop>
              </linearGradient>
              <rect id="Rectangle_30_b"></rect>
            </svg>
            <div id="Willing_to_Offer">
              <span>WILLING TO OFFER</span>
            </div>
            <div id="_Discount">
              <span> DISCOUNT</span>
            </div>
            <div id="your_Property">
              <span>YOUR PROPERTY?</span>
            </div>
            <div id="On">
              <span>ON</span>
            </div>
            <div id="A">
              <span>A</span>
            </div>
          </div>

          <div id="Group_7" onClick={() => setShow(true)}>
            <svg className="Rectangle_32">
              <rect id="Rectangle_32"></rect>
            </svg>
            <div id="Sign_up">
              <span>SIGN UP</span>
            </div>
          </div>
          <div id="Group_8" onClick={() => setShowlogin(true)}>
            <svg className="Rectangle_32">
              <rect id="Rectangle_32"></rect>
            </svg>
            <div id="Log_in">
              <span>LOG IN</span>
            </div>
          </div>
        </div>
      </div>

      <Signup show={show} setShow={setShow} />
      <Login show={showlogin} setShow={setShowlogin} />
    </>
  );
}

export default HomeOld;
