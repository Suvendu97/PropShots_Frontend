import React, { useEffect } from "react";
import { useState } from "react";
import Axios from "axios";
import { useContext } from "react";
import { Link, withRouter } from "react-router-dom";
import StateContext from "../StateContext";
import Pagination from "react-js-pagination";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Moment from 'moment';
import Carousel from "./Carousel_prop";
import Shortlisted_modal from "./Shortlisted_modal";
import MobileHeader from './MobileHeader';

function MyProperties() {
  const appState = useContext(StateContext);
  const [open, setOpen] = useState(false);
  const [property, setProperty] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [propertyPerPage, setPropertyPerPage] = useState(3);
  const [propertyPerPageMobile, setPropertyPerPageMobile] = useState(1);
  const [showform, setShowform] = useState(false);
  const [setData, setDataForm] = useState();


  const handleClickOpen = (id) => {
    setOpen(id);
  };

  async function displayform(id) {
    const response = await Axios.get(`/shortlist/getShortListedData/${id}`, { headers: { Authorization: `Bearer ${appState.user.token}` } });
    if (response) {
      setShowform(true);
      setDataForm(response.data)
    }
  }
  const handleClose = () => {
    setOpen(false);
  };

  async function deletePosted(id, propertyIndex) {
    try {
      const deleteResponse = await Axios.delete(`/property/${id}`, { headers: { Authorization: `Bearer ${appState.user.token}` } })
      handleClose();
      if (deleteResponse) {
        if (propertyIndex % 3 === 1) {
          setCurrentPage(currentPage === 1 ? currentPage : currentPage - 1);
        }
        props.history.push("/post-prop");
        console.log("Deleted");
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
        const response = await Axios.get("/property/myProperties", { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token });
        setProperty(response.data);
      } catch (error) {
        console.log("Something went wrong");
      }
    }
    fetchProperty();
    return () => {
      ourRequest.cancel();
    };
  }, [open]);
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


  function showPagination(currentPage, propertyPerPage, property) {
    // if (property.length > 3) {
    //   return (
    //     <div className="slide-indicator">
    //       <Pagination className="pagination" activePage={currentPage} itemsCountPerPage={propertyPerPage} totalItemsCount={property.length} pageRangeDisplayed={5} onChange={(e) => setCurrentPage(e)} hideFirstLastPages={true} hideNavigation={true} />
    //     </div>
    //   )
    // }
    if ($(window).width() > 767) {
      if (property.length > 3) {
        return (
          <div className="slide-indicator">
            <Pagination className="pagination" activePage={currentPage} itemsCountPerPage={propertyPerPage} totalItemsCount={property.length} pageRangeDisplayed={5} onChange={(e) => setCurrentPage(e)} hideFirstLastPages={true} hideNavigation={true} />
          </div>
        )
      }
    } else {
      if (property.length > 1) {
        return (
          <div className="slide-indicator">
            <Pagination className="pagination" activePage={currentPage} itemsCountPerPage={propertyPerPageMobile} totalItemsCount={property.length} pageRangeDisplayed={5} onChange={(e) => setCurrentPage(e)} hideFirstLastPages={true} hideNavigation={true} />
          </div>
        )
      }
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
        <div className="container d-block d-md-none">
        </div>
        <div id="shortlistbody" className="shortlistbody-mobile-fix">
          <div id="descbar" className="d-none d-md-block"> &nbsp; &nbsp; &nbsp;My Posted Properties</div>
          <div className="propdetails mob-propdetails">
            {currentProperties.map((Property) => {
              return (
                <div id="propdetail" key={Property._id}>
                  <div className="delete" onClick={() => handleClickOpen(Property._id)}>
                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                  </div>
                  <Dialog
                    open={open == Property._id ? true : false}
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
                        <button className="btn_delete_modal_Red" onClick={() => deletePosted(Property._id, property.length)}>Delete</button>
                        <button className="btn_delete_modal" onClick={handleClose}>Cancel</button>
                      </div>
                    </DialogActions>
                  </Dialog>
                  <div className="card-img-container list-prop">
                    {/* <img src={Property.photo[0]} /> */}
                    <Carousel property={Property} />
                  </div>
                  <div className="idf">&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="propboxcontent">
                      <i className="fa fa-building" aria-hidden="true"></i>&nbsp; PROPERTY ID
                    </div>
                    <div className="propboxcontentdata">{Property.pId} &nbsp;&nbsp;&nbsp;&nbsp;</div>
                  </div>
                  <div className="namef"> &nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="propboxcontent">
                      <i className="fa fa-user-circle-o" aria-hidden="true"></i>&nbsp; NAME
                    </div>
                    <div className="propboxcontentdata">{Property.by.name} &nbsp;&nbsp;&nbsp;&nbsp;</div>
                  </div>
                  <div className="numberf">&nbsp;&nbsp;&nbsp;&nbsp;
                  <div className="propboxcontent">
                      <i className="fa fa-phone" aria-hidden="true" style={{ transform: 'rotate(180deg)' }}
                      ></i> &nbsp; NUMBER
                  </div>
                    <div className="propboxcontentdata">{Property.by.phone} &nbsp;&nbsp;&nbsp;&nbsp;</div>
                  </div>
                  <div className="datef"> &nbsp;&nbsp;&nbsp;&nbsp;
                  <div className="propboxcontent">
                      <i className="fa fa-calendar" aria-hidden="true"></i>&nbsp; POSTED DATE
                  </div>
                    <div className="propboxcontentdata">{Moment(Property.createdAt).format('Do MMM YYYY')} &nbsp;&nbsp;&nbsp;&nbsp;</div>
                  </div>
                  <div className="msgf"> &nbsp;&nbsp;&nbsp;&nbsp;

                    <div className="propboxcontentdata"> &nbsp;&nbsp;&nbsp;&nbsp;</div>
                    <div className="msgf show-prop-btn">
                      <button id="nextshortlist" onClick={() => displayform(Property._id)} className="btn btnshowprop">Show Property</button>
                    </div>
                  </div>

                </div>

              );
            })}
          </div>
        </div>
        {showPagination(currentPage, propertyPerPage, property)}
      </div >
      <Shortlisted_modal show={showform} setShow={setShowform} data={setData} />
    </>

  );
}

export default withRouter(MyProperties);
