import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import Contactus from "./Contactus";
// import { Document, Page } from 'react-pdf';
// import { Document } from 'react-pdf/dist/esm/entry.webpack';
import PrivacyPolicyPropshots from "../resources/pdf/PrivacyPolicypropshots.pdf";
import TermsOfUsePropshots from "../resources/pdf/TermsofusePropshots.pdf";
import MobileHeader from "./MobileHeader";

function MoreLinks() {
  const [showform, setShowform] = useState(false);

  function displayform(){
    setShowform(true);
  }

  function ToggleFaIocn() {
    var isClassExist = document.getElementsByClassName('show');
    if (isClassExist.length > 0) {
      console.log('exist');
    }
    console.log(isClassExist);
  }
  
//   var outDiv = document.getElementById('DivForHoverItem');
// var inDiv = document.getElementById('HiddenText');

// outDiv.onmouseover = function() {
//      inDiv.style.display = 'inline';
// };

// outDiv.onmouseout = function() {
//      inDiv.style.display = 'none';
// };

  return (
    <>
      {/* mobile view */}
      <MobileHeader></MobileHeader>
      {/* mobile view end */}
      <div id="moreinplinksbody" className="fixfor-mobile-sidemenu mobile-morelinks">
        <div className="d-none d-md-flex">
          <h1 id="propshot1">PropShots</h1>
          <Link to="/">
            <img id="delete" src="resources/svg/cancel.svg" alt="icon" />
          </Link>
          <hr id="line1" /> 
        </div>
        <div className="container d-block d-md-none">
          {/* accordian */}
          <div className="row h-75">
            <div className="col-12">
              <div id="accordion">
                {/* <div className="card acc-card">
                  <div className="card-header" data-toggle="collapse" href="#collapseOne" onClick={()=>ToggleFaIocn()}>
                    <a className="card-link">
                    Company
                    </a>
                    <i className="fa fa-chevron-up fa-fw mt-1 float-right" aria-hidden="true"></i>
                  </div>
                  <div id="collapseOne" className="collapse show" data-parent="#accordion">
                    <div className="card-body acc-card-body py-1">
                      <a><p className="font-weight-normal mb-0 py-2" onClick={displayform} style={{ cursor:"pointer", marginLeft:"3px"}}>&nbsp; Contact Us</p> </a>
                    </div>
                  </div>
                </div> */}
                <div className="card acc-card">
                  <div className="card-header" href="#collapseTwo">
                    <a className="collapsed card-link" >
                    LEGAL
                    </a>
                    {/* <i className="fa fa-chevron-down fa-fw mt-1 float-right" aria-hidden="true"></i> */}
                  </div>
                  <div id="collapseTwo" className="collapse show" data-parent="#accordion">
                    <div className="card-body acc-card-body py-1">
                      <a href={PrivacyPolicyPropshots} target = "_blank">
                        <p className="font-weight-normal mb-0 acc-link-p py-2">Privacy Policy</p>
                      </a>
                      <a href={TermsOfUsePropshots} target = "_blank">
                        <p className="font-weight-normal acc-link-p mb-0 py-2">Terms & Conditions</p>
                      </a>
                    </div>
                  </div>
                </div>
                {/* <div className="card acc-card">
                  <div className="card-header" data-toggle="collapse" href="#collapseThree">
                    <a className="collapsed card-link" >
                    Partners
                    </a>
                    <i className="fa fa-chevron-down fa-fw mt-1 float-right" aria-hidden="true"></i>
                  </div>
                  <div id="collapseThree" className="collapse" data-parent="#accordion">
                    <div className="card-body">
                      Lorem ipsum dolor sit amet.
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          {/* accordian end */}
          {/* social button */}
          <div className="row h-25">
            <div className="col-12 text-center align-self-center">
              {/* <div className="fb-div"> */}
              {/* <div className="staysociallogos cus-modal-div"> */}
              <a onClick={displayform} style={{cursor:"pointer"}} className="fa-mob-contact mr-4">
                <img id="icon-contact-us" src="resources/img/contactuslogo1.png" alt="icon" />
              </a> 
              {/* <a> <span className="staysociallogostext" onClick={displayform} style={{ cursor:"pointer", marginLeft:"3px"}}>&nbsp; Contact Us</span> </a> */}
              {/* </div> */}
              <a href="https://www.facebook.com/propshots.in" target="_blank">
                <i className="fa fa-facebook mr-4 fa-lg fa-mob-social" aria-hidden="true"></i>
              </a>
              <a href="https://www.instagram.com/propshots_in/" target="_blank">
                <i className="fa fa-instagram mr-4 fa-lg fa-mob-social" aria-hidden="true"></i>
              </a>
              <a href="https://www.instagram.com/propshots_in/" target="_blank">
                <i className="fab fa-blogger-b fa-lg fa-mob-social" aria-hidden="true"></i>
              </a>
              {/* </div> 
              <div className="fb-div">
              </div>
              <div className="fb-div">
              </div>*/}
            </div>
          </div>
          {/* social button end*/}
        </div>
        <div id="moreinplinks" className="d-none d-md-flex">
          <div id="type1">
            <h2>STAY SOCIAL</h2>
            <div className="staysociallogos">
              <a href="https://www.facebook.com/propshots.in" target="_blank"><img id="insta" style={{marginLeft:"7px"}}  src="resources/img/facebooklogo1.png" alt="icon" /></a>
              <a href="https://www.facebook.com/propshots.in" target="_blank"> <span className="staysociallogostext" style={{cursor:"pointer", marginLeft:"3px"}}>&nbsp; Facebook</span ></a>
            </div>
            <div className="staysociallogos">
              <a href="https://www.instagram.com/propshots_in/" target="_blank"><img id="insta" style={{width:"37px"}} src="resources/img/instagramlogo1.png" alt="icon" /></a> 
              <a href="https://www.instagram.com/propshots_in/" target="_blank"> <span className="staysociallogostext" style={{ cursor:"pointer", marginLeft:"-1px"}}>&nbsp; Instagram</span> </a> 
            </div>
            <div className="staysociallogos">
              <a href="https://www.instagram.com/propshots_in/" target="_blank"><img id="insta" style={{marginLeft:"7px"}}   src="resources/img/bloglogo1.png" alt="icon" /></a> 
              <a href="https://www.instagram.com/propshots_in/" target="_blank"> <span className="staysociallogostext" style={{ cursor:"pointer", marginLeft:"3px"}}>&nbsp; Blog</span> </a>
              
            </div>   
            <div className="staysociallogos cus-modal-div">
              <a  onClick={displayform} style={{cursor:"pointer"}}><img id="insta" style={{marginLeft:"7px"}}   src="resources/img/contactuslogo1.png" alt="icon" /></a> 
              <a> <span className="staysociallogostext" onClick={displayform} style={{ cursor:"pointer", marginLeft:"3px"}}>&nbsp; Contact Us</span> </a>
            </div>   
              {/* <a onClick={displayform}>Contact</a> */}
            {/* <p>Security</p> */}
          </div>
          <div id="type2">
            <h2>LEGAL</h2>
            <a className="priv-policy" href={PrivacyPolicyPropshots} target = "_blank"> <p>Privacy Policy</p> </a>
            <a className="priv-policy" href={TermsOfUsePropshots} target = "_blank"> <p>Terms & Conditions</p> </a>
            {/* <a onClick={displayform} style={{cursor:"pointer"}}>Contact Us</a> */}
            {/* <p>Press</p>
            <p>Support</p>
            <p>Promo Code</p> */}
          </div>
          {/* <div id="type3">
            <h2>PARTNERS</h2>
            <p>Lorem Ipsum</p>
            <p>Lorem Ipsum</p>
            <p>Lorem Ipsum</p>
          </div> */}
          <div id="type4">
            {/* <h2>LEGAL</h2>
            <p>Privacy</p>
            <p>Terms</p>
            <p>Cookie Policy</p>
            <p>Safety & Policy Centre</p>
            <p>Safety Tips</p>
            <p>Community Guidelines</p>
            <p>Intellectual Property</p> */}
          </div>
          <div id="type5"></div>
        </div>
        <div id="bottomdesc" className="d-none d-md-flex">
          <div id="bottomdesc1">
            <hr id="line2" />
            <h2 id="gettheapp1">APP COMING SOON</h2>
            <div id="gettheapplogo">
              <img id="gettheapplogoimg1" src="resources/svg/apple.svg" alt="icon" />
              <img id="gettheapplogoimg2" src="resources/svg/google.svg" alt="icon" />
            </div>
            {/* <h4 id="comingsoon1" >Coming Soon</h4> */}
          </div>
          {/* <div id="bottomdesc2">
            <div id="">
              <h2> STAY SOCIAL</h2>
              <ul className="social-links" >
                <li><a href="https://www.facebook.com/propshots.in" target="_blank"><img id="fb" src="resources/svg/facebooklogo.svg" alt="icon" /></a></li>
                <li><a href="https://www.instagram.com/propshots_in/" target="_blank"><img id="insta" src="resources/svg/instagramlogo.svg" alt="icon" /></a></li>
              </ul>
            </div>
          </div> */}
        </div>
      </div>
      <Contactus show={showform} setShow={setShowform} />
    </>
  );
}

export default MoreLinks;
