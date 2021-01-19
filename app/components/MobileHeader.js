import React, { useEffect } from "react";

function MobileHeader(props) {
  function menuToggle() {
    var isClassExist = document.getElementsByClassName('toggled');
    console.log('Mobile Header', isClassExist.length);
    if (isClassExist.length == 0) {
      document.getElementById('app').classList.add("toggled");
    }else {
      document.getElementById('app').classList.remove("toggled");
    }
  }
  function closeMenu() {
    var isClassExist = document.getElementsByClassName('toggled');
    if (isClassExist.length > 0) {
      document.getElementById('app').classList.remove("toggled");
    }
  }
  return (
    <>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"></link>
      <nav className="navbar navbar-expand navbar-light bg-gradient border-bottom d-flex d-md-none">
        <button type="button" className="btn shadow-none text-white" id="menu-toggle" onClick={() => menuToggle()}>
          <img src="resources/svg/hamburgerMenu.svg" className="img-hamburger" />
        </button>

        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

          <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
            {/* <li className="nav-item active">
              <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
            </li> */}
            {/* <li className="nav-item active">
              <a className="nav-link mob-nav-link text-white" href="#">
                <img src="resources/svg/bell.svg" className="img-bell-topmenu" />
              </a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link mob-nav-link dropdown-toggle remove-caret text-white" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
              </a>
              <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="#">Action</a>
                <a className="dropdown-item" href="#">Another action</a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#">Something else here</a>
              </div>
            </li> */}
          </ul>
      </nav>
      <div className="overlay" onClick={()=>closeMenu()}></div>
    </>
  );
}

export default MobileHeader;