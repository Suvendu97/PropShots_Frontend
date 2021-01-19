import React, { useEffect, useState, useMemo } from "react";
import TinderCard from "react-tinder-card";
import Axios from "axios";
import { useContext } from "react";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext"
import { getDistance } from "geolib";
import { useAlert } from 'react-alert';
import { useParams } from "react-router-dom";
import Filter from "./filter";
import MobileHeader from "./MobileHeader";

// import {
//   FacebookShareButton,
//   FacebookIcon,
//   TwitterShareButton,
//   TwitterIcon,
//   WhatsappIcon,
//   WhatsappShareButton,
// } from "react-share";
import Carousel from "./Carousel";
function Properties() {

  const [properties, setProperties] = useState([]);
  const [currentLat, setCurrentLat] = useState([]);
  const [currentLng, setCurrentLng] = useState([]);
  const [currentPropertyId, setCurrentPropertyId] = useState();
  const [shareableURL, setShareableURL] = useState();
  const [showButtons, setShowButtons] = useState(true);
  const [showShare, setShowShare] = useState(false);
  const alredyRemoved = [];
  const showHint = localStorage.getItem('rememberMe');
  let childRefs = [];
  let slideIndex = 1;
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const alert = useAlert();
  const steps = [
    {
      element: '.selector1',
      intro: 'test 1',
      position: 'right',
      tooltipClass: 'myTooltipClass',
      highlightClass: 'myHighlightClass',
    },
    {
      element: '.selector2',
      intro: 'test 2',
    },
    {
      element: '.selector3',
      intro: 'test 3',
    },
  ];
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    let yr = appState.filter.yr;
    let pFor = appState.filter.pFor;
    let ct = appState.filter.ct;
    let st = appState.filter.st;
    let typ = appState.filter.typ;
    let locality = appState.filter.locality;
    async function fetchProperties() {
      try {
        const response = await Axios.get("/property", { headers: { Authorization: `Bearer ${appState.user.token}` }, params: { typ, pFor, yr, st, ct, locality } }, { cancelToken: ourRequest.token });
        if (response.data.length) {
          setProperties(response.data);
          // setCurrentPropertyId(response.data[0]._id);

        } else {
          alert.show(<div style={{ color: '#2E9AFE' }}>No Properties Found!</div>)

        }
        if (response.data.length === alredyRemoved.length) {
          setShowButtons(false)
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchProperties();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  const swiped = async (direction, id) => {
    alredyRemoved.push(id)
    if (properties.length === alredyRemoved.length) {
      setShowButtons(false)
    }
    let response;
    if (direction === "right") {
      response = await Axios.get(`shortlist/add/${id}`, { headers: { Authorization: `Bearer ${appState.user.token}` } });
    } else if (direction === "left") {
      response = await Axios.get(`ignore/${id}/add`, { headers: { Authorization: `Bearer ${appState.user.token}` } });
    }

    // let data = properties;
    // console.log(properties.shift())
    // setProperties([properties.shift()])
    // setCurrentPropertyId(id);
    // if(response.data !== 'Shortlisted' && response.data !== 'Shortlisted') {
    //   console.log(response.data)
    //   alert.error('Something went wrong');
    // }
  };


  const swipe = (dir) => {
    const cardsLeft = properties.filter(property => !alredyRemoved.includes(property._id))
    if (cardsLeft.length) {
      const toBeRemoved = cardsLeft[cardsLeft.length - 1]._id
      const index = properties.map(property => property._id).indexOf(toBeRemoved)
      childRefs[index].current.swipe(dir)
    }
  }

  const propertyDistance = (i, propertyLat, propertyLang) => {
    const dis = getDistance({ latitude: parseFloat(appState.location.lat), longitude: parseFloat(appState.location.long) }, { latitude: parseFloat(propertyLat), longitude: parseFloat(propertyLang) }) / 1000.0;
    if (Number.isNaN(dis)) {
      return 'Analysing...';
    } else {
      return `${dis.toFixed(2)} Kms away`;
    }
  }
  if ((!appState.location.lat) && (!appState.location.long)) {
    navigator.geolocation.getCurrentPosition(function (position) {
      appDispatch({ type: "location", data: { lat: position.coords.latitude, long: position.coords.longitude } });
    });
  }

  function plusDivs(n) {
    showDivs(slideIndex += n);
  }

  function showDivs(n) {
    var i;
    var x = document.getElementsByClassName("mySlides");
    if (n > x.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = x.length }
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    if (x[slideIndex - 1] && x[slideIndex - 1].style) {
      x[slideIndex - 1].style.display = "block";
    }
  }

  function handleShare() {
    if (showShare) {
      setShowShare(false);
    } else {
      setShowShare(true);
      setShareableURL(`${location.protocol}//${location.host}/property/${currentPropertyId}`);
    }
  }

  const getConverted = (value, pFor) => {
    var number = value;
    var strNumber = number.toString();
    var count = strNumber.length;
    var first = strNumber[0];
    var last;
    var second;
    if (count == 4 && pFor == "RENT") {
      last = strNumber.slice(1, 3);
      return (first + "." + last + " Thousand");
    } else if (count == 5 && pFor == "RENT") {
      second = strNumber[1];
      last = strNumber.slice(2, 4);
      return (first + second + "." + last + " Thousand");
    } else if (count == 6) {
      last = strNumber.slice(1, 3);
      return (first + "." + last + " Lakhs");
    } else if (count == 7) {
      second = strNumber[1];
      last = strNumber.slice(2, 4);
      return (first + second + "." + last + " Lakhs");
    } else if (count == 8) {
      last = strNumber.slice(1, 3);
      return (first + "." + last + " Crore")
    } else if (count == 9) {
      second = strNumber[1];
      last = strNumber.slice(2, 4);
      return (first + second + "." + last + " Crore");
    }
  }


  const price_in_words = (price) => {
    var sglDigit = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"],
      dblDigit = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"],
      tensPlace = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    // var number =100000;
    var strNumber = price.toString();
    var count = strNumber.length;

    if (count == 6) {
      var first = strNumber[0];
      var last = strNumber.slice(1, 3);
      if (last[0] == 0 && last[1] == 0) {
        var result = first + "," + last + " lacs";
        return (result);
      }
      else if (last[0] != 0 && last[1] == 0) {
        var second = last[0];
        return (first + " lacs " + tensPlace[second] + " Thousand");
      } else if (last[0] != 0 && last[1] != 0) {
        second = last[0];
        var third = last[1];
        if (second == 1) {
          return (first + " lacs " + dblDigit[third] + " Thousand");
        } else if (second != 1 && second > 0) {
          second = last[0];
          third = last[1];
          return (first + " lacs " + tensPlace[second] + ' ' + sglDigit[third] + " Thousand");
        }
      }
    } else if (count == 7) {
      var first = strNumber[0] + strNumber[1];
      var last = strNumber.slice(2, 4);
      if (last[0] == 0 && last[1] == 0) {
        var result = first + " lacs";
        return (result);
      }
      else if (last[0] != 0 && last[1] == 0) {
        var second = last[0];
        return (first + " lacs " + tensPlace[second] + " Thousand");
      } else if (last[0] != 0 && last[1] != 0) {
        second = last[0];
        var third = last[1];
        if (second == 1) {
          return (first + " lacs " + dblDigit[third] + " Thousand");
        } else if (second != 1 && second > 0) {
          second = last[0];
          third = last[1];
          return (first + " lacs " + tensPlace[second] + ' ' + sglDigit[third] + " Thousand");
        }
      }
    } else if (count == 8) {
      var first = strNumber[0];
      var last = strNumber.slice(1, 3);
      if (last[0] == 0 && last[1] == 0) {
        var result = first + "," + last + " crore";
        return (result);
      }
      else if (last[0] != 0 && last[1] == 0) {
        var second = last[0];
        return (first + " crore " + tensPlace[second] + " lacs");
      } else if (last[0] != 0 && last[1] != 0) {
        second = last[0];
        var third = last[1];
        if (second == 1) {
          return (first + " crore " + dblDigit[third] + " lacs");
        } else if (second != 1 && second > 0) {
          second = last[0];
          third = last[1];
          return (first + " crore " + tensPlace[second] + ' ' + sglDigit[third] + " lacs");
        }
      } else if (last[0] == 0 && last[1] != 0) {
        var result = first + "," + last + " crore";
        return (result);
      }
    } else if (count == 9) {
      var first = strNumber[0] + strNumber[1];
      var last = strNumber.slice(2, 4);
      if (last[0] == 0 && last[1] == 0) {
        var result = first + " crore";
        return (result);
      }
      else if (last[0] != 0 && last[1] == 0) {
        var second = last[0];
        return (first + " crore " + tensPlace[second] + " lacs");
      } else if (last[0] != 0 && last[1] != 0) {
        second = last[0];
        var third = last[1];
        if (second == 1) {
          return (first + " crore " + dblDigit[third] + " lacs");
        } else if (second != 1 && second > 0) {
          second = last[0];
          third = last[1];
          return (first + " crore " + tensPlace[second] + ' ' + sglDigit[third] + " lacs");
        }
      }
    }
  }
  function hintnext() {
    document.getElementById("overlay2").style.display = "block";
    document.getElementById("overlay").style.display = "none";
  }
  function hintprev() {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("overlay2").style.display = "none";
  }
  function hintok() {
    localStorage.setItem('rememberMe', "logged_in");
    document.getElementById("overlay").style.display = "none";
    document.getElementById("overlay2").style.display = "none";
  }
  return (
    <>
    {
      !showHint &&
      <>
        <div id="overlay" >
          <div id="mobile1" style={{ display: 'none' }}>
            <i className="fas fa-arrow-left arrow-n"></i>
          </div>
          <div id="text">
            Swipe left to Ignore
          </div>
          <div id="hint-single-btn">
            <button id="overlay-btn" onClick={() => hintnext()} className="btn">Next</button>
          </div>
        </div>
        <div id="overlay2">
          <div id="mobile" style={{ display: 'none' }}>
            <i className="fas fa-arrow-right arrow-n"></i>
          </div>
          <div id="text2">
            Swipe right to Shortlist
          </div>
          <div id="hint-dual-btn">
            <button id="overlay-btn1" onClick={() => hintprev()} className="btn">Prev</button>
            <button id="overlay-ok" onClick={() => hintok()} className="btn">Okay</button>
          </div>
        </div>
      </>
    }    
      {/* hint layout close */}
      <section className="property-display home-card-property-display clearfix">

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"></link>

        <MobileHeader></MobileHeader>
        <div className="container">
          <div className="row ht-row-fix myprop-ht-row-fix">
            {showButtons &&
              <>
                <div className="col d-none d-md-block text-right pr-0 align-self-end">
                  <div className="ignore pos" onClick={() => swipe('left')}>
                    <p>Ignore</p>
                    <img src="resources/svg/Group%20225.svg" className="img-ignore" />
                  </div>
                </div>
              </>
            }
            <div className="col-md-6 col-lg-6 col-xl-6 col-12">
              {properties.map((Property, i) => {
                if (i == 0) {
                  childRefs = Array(properties.length).fill(0).map(i => React.createRef())
                }
                return (
                  <TinderCard key={i} ref={childRefs[i]} className="card swipe home_card" onSwipe={(dir) => swiped(dir, Property._id)} preventSwipe={["down", "up"]}>
                    <div className="card-img-container">
                      <Carousel property={Property} />
                    </div>
                    <div className="card-body property">


                      <div className="card-body-top">
                        <ul className="dash-card-ul ml-2">
                          <li className="dash-card-ul-li">
                            <ul className="offered-dis-ul offered-dis-ul-last mb-2">
                              <li className="offered-dis-ul-li" style={{ width: '100%' }}>
                                <p className="font-cblack font-size-10 text-left">
                                  <b>&#x20B9;&nbsp;</b>
                                  {getConverted(Property.mv, Property.pFor)}
                                </p>
                              </li>
                            </ul>
                            <p style={{ fontSize: '13px' }}>Market Value</p>
                          </li>
                          <li className="dash-card-ul-li">
                            <ul className="offered-dis-ul offered-dis-ul-last mb-2">
                              <li className="offered-dis-ul-li" style={{ width: '100%' }}>
                                <p className="font-cblack font-size-10 text-left">
                                  <b>&#x20B9;&nbsp;</b>
                                  {getConverted(Property.disPer, Property.pFor)}
                                </p>
                              </li>
                            </ul>
                            <p style={{ fontSize: '13px' }}>Discounted Offer</p>
                          </li>
                        </ul>
                      </div>
                      <div className="card-body-bottom">
                        {/* <div className="details">
                      <span className="detail-head-text">
                        {Property.typ}&nbsp;{Property.exCat}&nbsp;For&nbsp;{Property.pFor}
                      </span>
                    </div> */}
                        <div className="details">
                          {/* <img src="resources/svg/type_icon.png" className="prop-icon type_img_home" />
                        <span className="detail-text font-weight-bold text-uppercase">{Property.typ} {Property.subCat} for {Property.pFor}</span> */}
                          {Property ?
                            <>
                              <img src="resources/svg/type_icon.png" className="prop-icon type_img_home" />
                              <span className="detail-text font-weight-bold text-uppercase">
                                {!Property.subCat.includes(Property.typ) ? !Property.exCat.includes(Property.typ) ? Property.typ : '' : ''}
                                {` ${Property.exCat}`} {Property.pFor && ' For'} {Property.pFor}
                              </span>
                            </>
                            :
                            <div className="blankData">
                              <span></span>
                            </div>
                          }
                        </div>
                        {appState.location.lat && appState.location.long ?
                          <div className="details">
                            <img src="resources/svg/Path%20132.svg" className="prop-icon" />
                            <span className="detail-text">{propertyDistance(i, Property.location.coordinates[1], Property.location.coordinates[0])}</span>
                          </div> : <div></div>}
                        <div className="details">
                          <img src="resources/svg/Group%20172.svg" className="prop-icon" />
                          <span className="detail-text">
                            Property Area {Property.ar} {Property.arUnit}
                          </span>
                        </div>
                        <div className="details fix_details">
                          <img src="resources/svg/Path%2099-1.svg" className="prop-icon icone-prop-home"></img>
                          <span className="detail-text">{Property.location.add}</span>
                        </div>
                        <div className="details fix_details">
                          <span className="detail-text pl-3 ml-1 text-capitalize font-14">{Property.desc}</span>
                        </div>
                      </div>
                    </div>
                  </TinderCard>
                );
              })}


            </div>
            {showButtons &&
              <>
                <div className="col d-none d-md-block pl-0 align-self-end">
                  <div className="shortlist pos" onClick={() => swipe('right')}>
                    <p>Shortlist</p>
                    <img src="resources/svg/Group%20224.svg" className="img-short-list" />
                  </div>
                </div>
              </>
            }
          </div>
          <div className="row">
            <div className="col">
              <span className="ignorehint"></span>
            </div>
            <div className="col text-right">
              <span className="shortlisthint"></span>
            </div>
          </div>
        </div>

        {/* <div className="container d-block d-md-none mt-60">
        <div className="row">
          <div className="col-6 text-left">
          <div className="ignore1" onClick={() => swipe('left')}>
            <img src="resources/svg/Group%20225.svg" className="img-ignore"/>
            <p className="ignore-text pl-2 mb-0">Ignore</p>
          </div>
          </div>
          <div className="col-6 text-right">
            <div className="shortlist1" onClick={() => swipe('right')}>
              <img src="resources/svg/Group%20224.svg" className="img-short-list"/>
              <p className="ignore-text pr-0 mb-0">Shortlist</p>
            </div>
          </div>
        </div>
      </div> */}
        {/* <div className="share-img pos">
              <img src="resources/svg/Group%20223.png" onClick={() => handleShare()} className="img-share"/>
              <p>Share</p>
            </div>
            {showShare &&
              <div className="sharing">
                <TwitterShareButton url={shareableURL}>
                  <TwitterIcon size={32} round={true} />
                </TwitterShareButton> 
                <WhatsappShareButton url={shareableURL}>
                  <WhatsappIcon size={32} round={true} />
                </WhatsappShareButton>
                <FacebookShareButton url={shareableURL}>
                  <FacebookIcon size={32} round={true} />
                </FacebookShareButton>
              </div>}  */}
      </section>
    </>

  );
}
export default Properties;
