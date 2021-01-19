import React, { useEffect } from "react";
import { useState } from "react";
import Axios from "axios";
import { Link, withRouter } from "react-router-dom";
import { useContext } from "react";
import StateContext from "../StateContext";
import Pagination from "react-js-pagination";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Moment from 'moment';
import PhoneVerify from './PhoneVerify';
import Carousel from "./Carousel_Short";
import Shortlisted_modal from "./Shortlisted_modal";
import { useAlert, withAlert } from 'react-alert';
import MobileHeader from "./MobileHeader";
// require("bootstrap/less/bootstrap.less");
import dateFormat from 'dateformat';

function Shortlist(props) {
  const appState = useContext(StateContext);
  const [open, setOpen] = useState(false);
  const [property, setProperty] = useState([]);
  const [shortlist, setShortlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [propertyPerPage, setPropertyPerPage] = useState(3);
  const [propertyPerPageMobile, setPropertyPerPageMobile] = useState(1);

  const [id, setid] = useState();
  const [PhoneShow, setPhoneShow] = useState();
  const [showform, setShowform] = useState(false);
  const [setData, setDataForm] = useState();

  const alert = useAlert();

  const handleClickOpen = (id) => {
    setOpen(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function displayform(id) {
    const response = await Axios.get(`/shortlist/getShortListedData/${id}`, { headers: { Authorization: `Bearer ${appState.user.token}` } });
    if (response) {
      setShowform(true);
      setDataForm(response.data)
    }
  }

  async function handlePhoneShow(aa, isVerified) {
    if (!isVerified) {
      setid(aa);
      const response1 = await Axios.get("/shortlist/send", { headers: { Authorization: `Bearer ${appState.user.token}` } });
      if (response1) {
        setPhoneShow(true);
        alert.show(<div style={{ color: '#2E9AFE' }}>OTP SENT</div>)
      }
      else {
        console.log("something went wrong");
      }
    }
  }

  async function deleteShortlisted(id, shortlistIndex) {
    try {
      const deleteResponse = await Axios.get(`/shortlist/remove/${id}`, { headers: { Authorization: `Bearer ${appState.user.token}` } })
      handleClose();
      if (deleteResponse) {
        alert.success(<div style={{ color: '#00cc00' }}>DELETED</div>);
        if (shortlistIndex % 3 === 1) {
          setCurrentPage(currentPage === 1 ? currentPage : currentPage - 1);
        }
        props.history.push("/shortlist");
      } else {
        console.log("Something went Wrong")
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchProperty() {
      try {
        const response = await Axios.get("/shortlist", { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token });
        setProperty(response.data);
        setShortlist(response.data);
      } catch (error) {
        console.log("Something went wrong");
      }
    }
    fetchProperty();
    return () => {
      ourRequest.cancel();
    };
  }, [open]);

  // const indexOfLastProperty = currentPage * propertyPerPage;
  // const indexOfFirstProperty = indexOfLastProperty - propertyPerPage;
  // const currentProperties = shortlist.slice(indexOfFirstProperty, indexOfLastProperty);

  let currentProperties = [];
  if ($(window).width() > 767) {
    const indexOfLastProperty = currentPage * propertyPerPage;
    const indexOfFirstProperty = indexOfLastProperty - propertyPerPage;
    currentProperties = property.slice(indexOfFirstProperty, indexOfLastProperty);
  } else {
    const indexOfLastProperty = currentPage * propertyPerPageMobile;
    const indexOfFirstProperty = indexOfLastProperty - propertyPerPageMobile;
    console.log(property)
    currentProperties = property.slice(indexOfFirstProperty, indexOfLastProperty);
  }

  function showPagination(currentPage, propertyPerPage, shortlist) {
    if ($(window).width() > 767) {
      if (shortlist.length > 3) {
        return (
          <div className="slide-indicator">
            <Pagination className="pagination" activePage={currentPage} itemsCountPerPage={propertyPerPage} totalItemsCount={shortlist.length} pageRangeDisplayed={5} onChange={(e) => setCurrentPage(e)} hideFirstLastPages={true} hideNavigation={true} />
          </div>
        )
      }
    } else {
      if (shortlist.length > 1) {
        return (
          <div className="slide-indicator">
            <Pagination className="pagination" activePage={currentPage} itemsCountPerPage={propertyPerPageMobile} totalItemsCount={shortlist.length} pageRangeDisplayed={5} onChange={(e) => setCurrentPage(e)} hideFirstLastPages={true} hideNavigation={true} />
          </div>
        )
      }
    }
  }

  function ViewContact(numberShow) {
    if (!numberShow) {
      return <small style={{ color: "blue", cursor: "pointer" }}>View Contact&nbsp;&nbsp;&nbsp;&nbsp;</small>
    }
  }
  return (
    <>
      {/* mobile view */}
      <MobileHeader></MobileHeader>
      {/* mobile view end */}
      <div id="shortlist" className="shortlist-mobile-fix">
        <div className="d-none d-md-block">
          <Link to="/">
            <img id="shortlistcancel" src="resources/svg/cancel.svg" />
          </Link>
        </div>
        <div id="shortlistbody" className="shortlistbody-mobile-fix">
          <div id="descbar" className="d-none d-md-block"> &nbsp; &nbsp; &nbsp;My Shortlisted Properties</div>
          <div className="propdetails sl-propdetail">
            {currentProperties.map((Property) => {
              return (

                <div id="propdetail" key={Property.id}>
                  <div className="delete" onClick={() => handleClickOpen(Property.id)}>
                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                  </div>
                  <Dialog
                    open={open == Property.id ? true : false}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description" style={{ width: "300px", height: "80px" }}>
                        <div style={{ textAlign: "center", paddingTop: "15%" }}>Delete Selected Property ?</div>
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <div className="cnfrm_btns">
                        <button className="btn_delete_modal_Red" onClick={() => deleteShortlisted(Property.id, shortlist.length)}>Delete</button>
                        <button className="btn_delete_modal" onClick={handleClose}>Cancel</button>
                      </div>
                    </DialogActions>
                  </Dialog>

                  <div className="card-img-container list-prop shortlist-prop">
                    {/* <img src={Property.prop.img} /> */}
                    <Carousel property={Property.prop} />
                  </div>
                  <div className="idf">
                    &nbsp;&nbsp;&nbsp;&nbsp;
                  <div className="propboxcontent">
                      <i className="fa fa-building" aria-hidden="true"></i>&nbsp; PROPERTY ID
                  </div>
                    <div className="propboxcontentdata">{Property.prop.pId} &nbsp;&nbsp;&nbsp;&nbsp;</div>
                  </div>
                  <div className="namef">
                    &nbsp;&nbsp;&nbsp;&nbsp;
                  <div className="propboxcontent">
                      <i className="fa fa-user-circle-o" aria-hidden="true"></i>&nbsp; NAME
                  </div>
                    <div className="propboxcontentdata">{Property.prop.name} &nbsp;&nbsp;&nbsp;&nbsp;</div>
                  </div>
                  <div className="numberf">
                    &nbsp;&nbsp;&nbsp;&nbsp;
                  <div className="propboxcontent">
                      <i className="fa fa-phone" style={{ transform: 'rotate(180deg)' }} aria-hidden="true"></i> &nbsp; NUMBER
                  </div>
                    <div className="propboxcontentdata" onClick={() => handlePhoneShow(Property.id, Property.isVerified)}>
                      <u>{Property.prop.phone}</u>&nbsp;&nbsp;&nbsp;&nbsp;
                    <div style={{ textAlign: 'center', fontSize: '13px', margin: '-7px' }}>
                        {ViewContact(Property.isVerified)}
                      </div>
                    </div>

                  </div>
                  <div className="datef">
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="propboxcontent">
                      <i className="fa fa-calendar" aria-hidden="true"></i>&nbsp; SHORTLISTED DATE
                    </div>
                    <div className="propboxcontentdata" > {dateFormat(Property.prop.ShortlistedDate, "dS mmm , yyyy")} &nbsp;&nbsp;&nbsp;&nbsp; </div>
                  </div>
                  {/* <div className="msgf">
                    &nbsp;&nbsp;&nbsp;&nbsp;
                  <div className="propboxcontent">
                    <i className="fa fa-comments" aria-hidden="true"></i>&nbsp; MESSAGE RECEIVED
                  </div>
                  <div className="propboxcontentdata">{Property.id}</div>
                  </div> */}
                  <div className="msgf show-prop-btn">
                    <span className="d-none d-md-block">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <button id="nextshortlist" onClick={() => displayform(Property.prop.id)} className="btn btnshowprop">Show Property</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {showPagination(currentPage, propertyPerPage, shortlist)}
        <PhoneVerify show={PhoneShow} setShow={setPhoneShow} id={id} />
      </div>

      <Shortlisted_modal show={showform} setShow={setShowform} data={setData} />
    </>
  );
}


export default withRouter(Shortlist);
