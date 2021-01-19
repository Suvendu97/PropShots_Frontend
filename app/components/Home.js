import React, { useState } from "react";
import Signup from "./SignUp";
import Login from "./Login";
function Home() {
    const [show, setShow] = useState(false);
    const [showlogin, setShowlogin] = useState(false);
    return (
        <>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"></link>
            <link rel="stylesheet" href="resources/css/homeGuestNew.css" />
            <div className="bg-img">
                <div className="container h-100 hide-on-big-screen">
                    <div className="row justify-content-center align-self-center">
                        <div className="col-12 text-center pb-3">
                            <img src="./resources/img/Propshots_Logo-final.png" />
                        </div>
                        <div className="col-12 pb-4">
                            <div className="row">
                                <div className="col"></div>
                                <div className="col-9 col-sm-8">
                                    <div className="row">
                                        <div className="col-2 pr-2 text-center">
                                            <p className="mb-0 gr-div a-text font-cbold"><span>A</span></p>
                                        </div>
                                        <div className="col-9 px-0">
                                            <div className="row">
                                                <div className="col-9 pr-0">
                                                    <p className="mb-0 willing-to-txt font-hbold">WILLING TO OFFER</p>
                                                    <p className="mb-0 discount-txt font-cblack">DISCOUNT</p>
                                                </div>
                                                <div className="col-3 px-0 text-center">
                                                    <p className="mb-0 gr-div onn-txt font-cbold"><span>ON</span></p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <p className="mb-0 your-prop-txt font-cblack">YOUR PROPERTY?</p>
                                                </div>
                                                <div className="col-12 pr-0">
                                                    <p className="text-center mb-0 let-us-txt px-3 font-hthin">Let us Tell The World About it</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col"></div>
                            </div>
                        </div>
                        <div className="col-12 px-4">
                            <div className="row justify-content-center">
                                <div className="col-5 text-right">
                                    <a href="" className="sign-up-model-link" data-toggle="modal" data-target="#signupModal">SIGN UP</a>
                                </div>
                                <div className="col-5">
                                    <a href="" className="sign-up-model-link" data-toggle="modal" data-target="#loginModal">LOG IN</a>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-12 mt-5 px-4 align-self-end text-center">
                            <p>By creating an account you agree to our Terms of Service and Privacy Policy</p>
                        </div> */}
                    </div>
                </div>
                <div className="container pt-4 show-on-big-screen">
                    <div className="row">
                        <div className="col">
                            <h3 className="prop-shot-text font-hbold">  
                                <img src="./resources/img/logo.png" />
                            </h3>
                        </div>
                        <div className="col text-right align-self-center">
                            <div className="row mt-3">
                                <div className="col-md-6 col-lg-8 text-right mb-2 mb-md-0">
                                    <a href="" className="sign-up-model-link" data-toggle="modal" data-target="#signupModal">SIGN UP</a>
                                </div>
                                <div className="col-md-6 col-lg-4 text-right text-md-left mt-4 mt-md-0">
                                    <a href="" className="sign-up-model-link" data-toggle="modal" data-target="#loginModal">LOG IN</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fixed-bottom">
                        <div className="container">
                            <div className="row pb-5 mb-5 m-hide">
                                <div className="col"></div>
                                <div className="col-5 col-md-9 col-lg-7 col-xl-6 pb-5">
                                    <div className="row">
                                        <div className="col-2 text-center">
                                            <p className="mb-0 gr-div a-text font-cbold"><span>A</span></p>
                                        </div>
                                        <div className="col-9 px-0">
                                            <div className="row">
                                                <div className="col-9 pr-0">
                                                    <p className="mb-0 willing-to-txt font-hbold">WILLING TO OFFER</p>
                                                    <p className="mb-0 discount-txt font-cblack">DISCOUNT</p>
                                                </div>
                                                <div className="col-3 pr-0 text-center">
                                                    <p className="mb-0 gr-div onn-txt font-cbold"><span>ON</span></p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <p className="mb-0 your-prop-txt font-cblack">YOUR PROPERTY?</p>
                                                </div>
                                                <div className="col-12 pr-0">
                                                    <p className="text-center mb-0 let-us-txt px-3 font-hthin">Let us Tell The World About it</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Signup show={show} setShow={setShow} />
            <Login show={showlogin} setShow={setShowlogin} />
        </>
    )
}

export default Home;