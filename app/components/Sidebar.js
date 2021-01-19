import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Link, withRouter } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import Axios from "axios";
import EmailVerify from "./Emailverify";
import { useAlert } from 'react-alert';


function openProfile() {
  var ham = "../resources/svg/Component%207%20%E2%80%93%205.svg";
  var cros = "../resources/svg/Component%202%20%E2%80%93%2017.svg";

  var x = document.querySelector(".prof-detail");
  var y = document.querySelector("#hamberger");
  var a = document.querySelector(".prof-all-detail");
  var b = document.querySelector("#det-show");
  var c = document.querySelector(".property-opt");
  var d = document.querySelector(".edit-prof");

  if (x.style.display === "none" && d.style.display === "none") {
    x.style.display = "block";
    y.src = cros;
  } else {
    d.style.display = "none";
    c.style.display = "block";
    b.style.transform = "rotate(360deg)";
    b.style.marginTop = "5%";
    a.style.display = "none";
    x.style.display = "none";
    y.src = ham;
  }
}

function openProfileDetail() {
  var x = document.querySelector(".prof-all-detail");
  var y = document.querySelector("#det-show");
  if (x.style.display === "none") {
    x.style.display = "block";
    y.style.transform = "rotate(90deg)";
    y.style.marginTop = "8%";
  } else {
    x.style.display = "none";
    y.style.transform = "rotate(360deg)";
    y.style.marginTop = "5%";
  }
}

function editProfileDetail() {
  var x = document.querySelector(".prof-all-detail");
  var y = document.querySelector("#det-show");
  var z = document.querySelector(".property-opt");
  var m = document.querySelector(".edit-prof");
  var n = document.querySelector(".prof-detail");

  x.style.display = "none";
  y.style.transform = "rotate(360deg)";
  n.style.display = "none";
  m.style.display = "block";
  z.style.display = "none";
}

function Sidebar(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '' });
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [modified, setModified] = useState({ name: false, email: false });
  const [vOtp, setvOtp] = useState();
  const [email, setemail] = useState();
  const [showotpverify, setShowotpverify] = useState(false);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchProperty() {
      try {
        const response = await Axios.get("/users/userDetails", { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token });
        if (!response.data.user) {
          appDispatch({ type: "logout" });
        }
        setUserInfo(response.data.user);
        appDispatch({ type: "location", data: { lat: response.data.user.lat, long: response.data.user.lon } });
      } catch (error) {
        console.log("Something went wrong");
      }
    }
    fetchProperty();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  function handleLogout() {
    appDispatch({ type: "logout" });
    props.history.push("/");
  }

  const changeName = (e) => {
    let newUserInfo = { ...userInfo };
    newUserInfo.name = e.target.value;
    setModified({ name: true });
    setUserInfo(newUserInfo)
  }

  const changeEmail = (e) => {
    let newUserInfo = { ...userInfo };
    newUserInfo.email = e.target.value;
    setModified({ email: true });
    setUserInfo(newUserInfo)
  }

  function closeMenu() {
    var isClassExist = document.getElementsByClassName('toggled');
    if (isClassExist.length > 0) {
      document.getElementById('app').classList.remove("toggled");
    }
  }
  const alert = useAlert();

  async function updateProfile(key) {
    try {
      if (key == 'name') {
        if (userInfo.name.length === 0) {
          alert.error(<div style={{ color: '#FF0040' }}>Enter a valid name!</div>);
          return;
        } else {
          await Axios.put("/users/update", { name: userInfo.name }, { headers: { Authorization: `Bearer ${appState.user.token}` } });
          alert.success(<div style={{ color: '#00cc00' }}>Profile updated successfully!</div>);
        }
      } else if (key == 'email') {

        if (/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(userInfo.email)) {
          await Axios.post("/users/verifyMail", { email: userInfo.email }, { headers: { Authorization: `Bearer ${appState.user.token}` } }).then((result) => {
            if (typeof result.data[0].about_mail != 'number') {
              alert.error(<div style={{ color: '#FF0040' }}>{result.data[0].about_mail}</div>);
            } else {
              alert.show(<div style={{ color: '#2E9AFE' }}>Check your mailbox for OTP!</div>);
              setemail(userInfo.email);
              setvOtp(result.data[0].about_mail);
              setShowotpverify(true);
            }
          });
        } else {
          alert.error(<div style={{ color: '#FF0040' }}>Enter a valid email</div>);
          return;
        }
      }
      setModified({ email: false, name: false });

    } catch (err) {
      console.log("this something went wrong", err);
    }
  }

  return (
    <>
      <link rel="stylesheet" href="resources/css/homeOld.css" />

      {/* <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" /> */}
      <header className="clearfix" id="side-header">
        {/* ALL NAVIGATIONS DIVS */}
        <div className="nav1">
          {/* MAIN NAV LINKS */}
          <div className="nav-link">
            <span id="open-prof" onClick={openProfile}>
              <img src="resources/svg/Component%207%20%E2%80%93%205.svg" className="icons" id="hamberger" />
              <span className="link-text">{userInfo.name}</span>
            </span>
            <Link to="/" className="right" onClick={()=>closeMenu()}>
              <img src="resources/svg/Path%2099.svg" className="ico-right" />
            </Link>
          </div>

          {/* PROFILE OPTIONS */}
          <div className="prof-detail">
            <div className="nav-prof-link" onClick={openProfileDetail}>
              <span id="my-prof">
                <img src="resources/svg/Group%2090.svg" className="icons" />
                <span className="link-text">My Profile</span>
                <span className="symb" id="det-show">
                  &#8250;
                </span>
              </span>
            </div>

            {/* PROFILE DETAILS */}
            <div className="prof-all-detail">
              <div className="nav-prof-detail-link" onClick={editProfileDetail}>
                <img src="resources/svg/Group%2090.svg" className="icons-sm" />
                <span className="link-text-sm">Name</span>
                <span className="prof-detail-text">
                  {userInfo.name}
                  <span className="symb-sm">&#8250;</span>
                </span>
              </div>

              <div className="nav-prof-detail-link" onClick={editProfileDetail}>
                <img src="resources/svg/Group%20100.svg" className="icons-sm" />
                <span className="link-text-sm">Email</span>
                <span className="prof-detail-text">
                  {userInfo.email}
                  <span className="symb-sm">&#8250;</span>
                </span>
              </div>

              <div className="nav-prof-detail-link" onClick={editProfileDetail}>
                <img src="resources/svg/Component%2013%20%E2%80%93%203.svg" className="icons-sm" />
                <span className="link-text-sm">Phone Number</span>
                <span className="prof-detail-text">
                  {userInfo.phone}
                  <span className="symb-sm">&#8250;</span>
                </span>
              </div>
            </div>
            {/* PROFILE DETAILS END */}

            <div className="nav-prof-link d-none d-md-block">
              <Link to="/more-links">
                <img src="resources/svg/Component%207%20%E2%80%93%205.svg" className="icons" />
                <span className="link-text">More Important Links</span>
                <span className="symb" id="det-show">
                  &#8250;
                </span>
              </Link>
            </div>

            <div className="nav-prof-link d-none d-md-block" onClick={handleLogout}>
              <img src="resources/svg/Path%20100.svg" className="icons" />
              <span className="link-text">
                Logout
              </span>
            </div>
          </div>
          {/* PROFILE OPTIONS END */}

          <div className="edit-prof">
            <div className="nav-prof-edit">
              <img src="resources/svg/Component%2015%20%E2%80%93%204.svg" className="icons-sm" />
              <span className="link-text-sm-b">Name</span>
              <label htmlFor="nameInput" className="link-text-sm-R">Edit</label>
            </div>
            <div className="nav-prof-edit">
              <input className="edit-text-sm-b" id="nameInput" onChange={changeName} value={userInfo.name} />
              {modified.name && <i className="fa fa-2x fa-check" style={{ color: 'blue', alignSelf: 'center' }} onClick={() => updateProfile('name')}></i>}
            </div>
            <div className="nav-prof-edit">
              <img src="resources/svg/Component%2013%20%E2%80%93%205.svg" className="icons-sm" />
              <span className="link-text-sm-b">Phone Number</span>
              {/* <span className="link-text-sm-R">Edit</span> */}
            </div>
            <div className="nav-prof-edit">
              <span className="edit-text-sm-b">
                <div id="phoneedit" style={{ marginTop: "7%", marginLeft: "1.4%" }}> {userInfo.phone} </div></span>
            </div>
            <div className="nav-prof-edit">
              <img src="resources/svg/Component%2015%20%E2%80%93%204.svg" className="icons-sm" />
              <span className="link-text-sm-b">Email</span>
              <label htmlFor="emailInput" className="link-text-sm-R">Edit</label>
            </div>
            <div className="nav-prof-edit">
              {/* <span className="edit-text-sm-b">{userInfo.email}</span> */}
              <input className="edit-text-sm-b" id="emailInput" onChange={changeEmail} value={userInfo.email} />
              {modified.email && <i className="fa fa-2x fa-check" style={{ color: 'blue', alignSelf: 'center' }} onClick={() => updateProfile('email')}></i>}
            </div>
          </div>

          <div className="property-opt">
            {/* <div className={location.href.includes('/') ? "nav-link d-block d-md-none": "nav-link active d-block d-md-none"}>
              <Link to="/">
                <img src={location.href.includes('/')?"resources/svg/Path%2099.svg":"resources/svg/Component 14 – 5.svg"} className="icons" />
                <span className="link-text">My Properties</span>
              </Link>
            </div> */}
            {/* <div className={location.href.includes('shortlist') || location.href.includes('my-prop') || location.href.includes('filter') || location.href.includes('more-links') || location.href.includes('post-prop') ? "nav-link d-block d-md-none" : "nav-link active d-block d-md-none"}>
              <Link to="/" onClick={()=>closeMenu()}>
                <img src={location.href.includes('shortlist') || location.href.includes('my-prop') || location.href.includes('filter') || location.href.includes('more-links') || location.href.includes('post-prop') ? "resources/svg/Path%2099.svg" : "resources/svg/Component 14 – 5.svg"} className="icons" />
                <span className="link-text">My Properties</span>
              </Link>
            </div> */}
            <div className={!location.href.includes('shortlist') ? "nav-link" : "nav-link active"}>
              <Link to="/shortlist" onClick={()=>closeMenu()}>
                <img src={!location.href.includes('shortlist') ? "resources/svg/Component%2014%20%E2%80%93%201.svg" : "resources/svg/Component 14 – 5.svg"} className="icons" />
                <span className="link-text">My Shortlisted Properties</span>
              </Link>
            </div>
            <div className={!location.href.includes('my-prop') ? "nav-link" : "nav-link active"}>
              <Link to="/my-prop" onClick={()=>closeMenu()}>
                <img src={!location.href.includes('my-prop') ? "resources/svg/Group%2092.svg" : "resources/svg/postedBlack.svg"} className="icons" />
                <span className="link-text">My Posted Properties</span>
              </Link>
            </div>
            <div className={!location.href.includes('filter') ? "nav-link" : "nav-link active"}>
              <Link to="/filter" onClick={()=>closeMenu()}>
                <img src={!location.href.includes('filter') ? "resources/svg/Group%2095.svg" : "resources/svg/Group 95 (2).svg"} className="icons" />
                <span className="link-text">Filter</span>
              </Link>
            </div>
            <div className={!location.href.includes('more-links') ? "nav-link d-block d-md-none font-icon" : "nav-link active d-block d-md-none font-icon"} >
              <Link to="/more-links" onClick={()=>closeMenu()}>
                {/* <img src={!location.href.includes('more-links') ? "resources/svg/Component%207%20%E2%80%93%205.svg" : "resources/svg/hambergerblack.svg"} className="icons" /> */}
                <i className="fa fa-link"></i>
                <span className="link-text">More Important Links</span>
              </Link>
            </div>
            {/* <div className="nav-link d-block d-md-none">
              <Link to="/">
                <img src="resources/svg/bell.svg" className="icons" />
                <span className="link-text">Notification</span>
              </Link>
            </div> */}
            <div className="nav-link d-block d-md-none" onClick={handleLogout}>
              <img src="resources/svg/Path%20100.svg" className="icons" />
              <span className="link-text">
                Logout
              </span>
            </div>
            {/* MAIN NAV LINKS END */}
            <div className="w-100">
              <Link to="/post-prop" onClick={()=>closeMenu()} className="link link-upload-img p-3 post-btn text-center">
                {/* <img src="resources/svg/Component%206%20%E2%80%93%2013.svg" className="post-btn" /> */}
                POST YOUR PROPERTY
              </Link>
            </div>
          </div>
        </div>
        {/* ALL NAVIGATIONS END */}
      </header>
      <EmailVerify show={showotpverify} setShow={setShowotpverify} sethiddenOtp={setvOtp} email={email} vOtp={vOtp} />
    </>
  );
}

export default withRouter(Sidebar);
