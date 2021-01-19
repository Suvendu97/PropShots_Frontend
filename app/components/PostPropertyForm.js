import Axios from "axios";
import React, { useContext, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import PlacesAutocomplete from "react-places-autocomplete";
import StateContext from "../StateContext";
import FileBase64 from 'react-file-base64'
import { useAlert } from 'react-alert';

function PostPropertyForm(props) {
  const appState = useContext(StateContext);
  const [pFor, setPFor] = useState();
  const [typ, setTyp] = useState();
  const [subCat, setSubCat] = useState();
  const [exCat, setExCat] = useState();
  const [loc, setLoc] = useState('');
  const [yr, setYr] = useState();
  const [st, setSt] = useState();
  const [ct, setCt] = useState('');
  const [ar, setAr] = useState();
  const [arUnit, setArUnit] = useState();
  const [mv, setMv] = useState();
  const [disPer, setDisPer] = useState();
  const [photo, setPhoto] = useState([]);
  const [desc, setDesc] = useState();
  const [preview, setPreview] = useState();
  const photoArray = [];

  const searchOptions = {
    componentRestrictions: { country: "in" },
  };

  const searchOptions1 = {
    types: ["(cities)"],
    componentRestrictions: { country: "in" },
  };

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }
  const alert = useAlert();

  async function displayRazorpay() {
    console.log("starting payment");
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert.error("Razorpay SDK Failed to load. Please check your internet connection");
      return;
    }

    const response = await Axios.get("/razorpay/order");
    const { data } = response;
    if (data) {
      console.log(data);
    } else {
      alert.error("server error during payment");
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      name: "Propshot",
      description: "one time payment",
      order_id: data.id,
      handler: async (response) => {
        try {
          const paymentId = response.razorpay_payment_id;
          const url = `/razorpay/capture/${paymentId}`;
          const captureResponse = await Axios.post(url, {});
          const successObj = JSON.parse(captureResponse.data);
          const captured = successObj.captured;
          if (captured) {
            alert.success("Payment success");
            uploadData(photoArray);
          } else {
            alert.error("Payment Failed");
            props.history.push("/");
          }
        } catch (err) {
          alert.error(err);
        }
      },
      theme: {
        color: "#686CFD",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  }

  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    previewFile(file);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreview(reader.result);
    };
  };

  // async function handleSubmit(e) {
  //   e.preventDefault();
  //   displayRazorpay();
  // }

  async function handleSubmit(e) {
    e.preventDefault();
    photo.map(pic => {
      photoArray.push(pic.base64);
    })
    uploadData(photoArray);
    // displayRazorpay();
  }

  const uploadData = async (base64EncodedImage) => {
    try {
      console.log("posting property....")
      const response = await Axios.post("/property", { pFor, typ, subCat, exCat, add: { loc, ct, st }, yr, ar, arUnit, mv, disPer, photo: base64EncodedImage, desc }, { headers: { Authorization: `Bearer ${appState.user.token}` } });
      if (response.data) {
        console.log(response.data);
        props.history.push("/");
      } else {
        console.log("something went wrong");
      }
    } catch {
      console.log("something went wrong");
    }
  };

  const handleFiles = (files) => {
    if (files.length > 5) {
      console.log('Max 5 images are allowed.');
    }
    setPhoto(files.slice(0, 5))
  }

  return (
    <>
      <section className="post-property clearfix">
        <div className="prop-form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-col">
                <label htmlFor="property-for">Property For</label>
                <select id="country" name="for" onChange={(e) => setPFor(e.target.value)} required>
                  <option value="">Select</option>
                  <option value="Rent">Rent</option>
                  <option value="Sale">Sale</option>
                </select>
              </div>
              <div className="form-col">
                <label htmlFor="property-type">Property Type</label>
                <select id="country" name="typ" onChange={(e) => setTyp(e.target.value)} required>
                  <option value="">Select</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label htmlFor="property-subType">Property Sub-Type</label>
                <select id="country" name="subCat" onChange={(e) => setSubCat(e.target.value)} required>
                  <option value="">Select</option>
                  <option value="Apartment /Flat / Builder Floor">Apartment /Flat / Builder Floor</option>
                  <option value="House Villa">House Villa</option>
                  <option value="Office">Office</option>
                  <option value="Retail">Retail</option>
                  <option value="Land">Land</option>
                  <option value="Industry">Industry</option>
                  <option value="Storage">Storage</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-col">
                <label htmlFor="property-Exact-Type">Property Exact-Type</label>
                <select id="country" name="exCat" onChange={(e) => setExCat(e.target.value)} required>
                  <option value="">Select</option>
                  <option value="Residential Apartment">Residential Apartment</option>
                  <option value="Independent / builder floor">Independent / builder floor</option>
                  <option value="Residential Land">Residential Land</option>
                  <option value="Farm House">Farm House</option>
                  <option value="Society Villa">Society Villa</option>
                  <option value="Commercial / Institutional Land">Commercial / Institutional Land</option>
                  <option value="Agriculture / Farm Land">Agriculture / Farm Land</option>
                  <option value="Factory">Factory</option>
                  <option value="Guest House">Guest House</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Resort">Resort</option>
                  <option value="Banquet Halls">Banquet Halls</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-col" id="locationField">
                <label htmlFor="property-subType">Property Location</label>
                <PlacesAutocomplete value={loc} onChange={setLoc} searchOptions={searchOptions}>
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                      <input {...getInputProps({ placeholder: "Address" })} />

                      <div>
                        {loading ? <div>...loading</div> : null}

                        {suggestions.map((suggestion) => {
                          const style = {
                            backgroundColor: suggestion.active ? "#41b6e6" : "#fff",
                          };

                          return <div {...getSuggestionItemProps(suggestion, { style })} key={suggestion.description}>{suggestion.description}</div>;
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
              </div>

              <div className="form-col">
                <label htmlFor="Property-Area">Property Age</label>
                <select id="Property-Area" name="yr" onChange={(e) => setYr(e.target.value)} required>
                  <option value="">Select</option>
                  <option value="New Property">New Property</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="Old Age Property">Old Age Property</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label htmlFor="property-subType">City</label>
                <PlacesAutocomplete value={ct} onChange={setCt} searchOptions={searchOptions1}>
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                      <input {...getInputProps({ placeholder: "City" })} />

                      <div>
                        {loading ? <div>...loading</div> : null}

                        {suggestions.map((suggestion) => {
                          const style = {
                            backgroundColor: suggestion.active ? "#41b6e6" : "#fff",
                          };

                          return <div {...getSuggestionItemProps(suggestion, { style })} key={suggestion.description}>{suggestion.description}</div>;
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
              </div>
              <div className="form-col">
                <label htmlFor="property-subType">State</label>
                <select id="country" name="st" onChange={(e) => setSt(e.target.value)} required>
                  <option value="">Select</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Dadar and Nagar Haveli">Dadar and Nagar Haveli</option>
                  <option value="Daman and Diu">Daman and Diu</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Lakshadweep">Lakshadweep</option>
                  <option value="Puducherry">Puducherry</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label htmlFor="Property Area">Property Area</label>
                <input type="number" name="ar" min="0" onChange={(e) => setAr(e.target.value)} required />
              </div>
              <div className="form-col">
                <label htmlFor="arUnit">Area Unit</label>
                <select id="country" name="arUnit" onChange={(e) => setArUnit(e.target.value)} required>
                  <option value="">Select</option>
                  <option value="SQ.FT">SQ.FT</option>
                  <option value="ACR">ACR</option>
                  <option value="CM">CM</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label htmlFor="property-subType">Property Price</label>
                <input type="number" name="mv" min="0" onChange={(e) => setMv(e.target.value)} required />
              </div>
              <div className="form-col">
                <label htmlFor="property-subType">Discount %</label>
                <input type="number" name="disPer" min="0" step="0.1" onChange={(e) => setDisPer(e.target.value)} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <label htmlFor="Description">Description</label>
                <div>
                  <textarea name="desc" style={{ resize: "none" }} rows="4" cols="66" maxLength="250" onChange={(e) => setDesc(e.target.value)}>
                    {desc}
                  </textarea>
                </div>
              </div>
              <div className="form-col">
                <label htmlFor="property-subType">Property Pictures </label>
                <FileBase64 multiple={true} onDone={handleFiles} />
                <div>{
                  photo.map((pic, i) => {
                    return (<img src={pic.base64} key={pic.name} alt="pic" style={{ height: "50px", margin: "5px" }} />)
                  }
                  )}</div>
              </div>
            </div>
            <button className="post-form">Preview and Post</button>
          </form>
        </div>
      </section>
    </>
  );
}

export default withRouter(PostPropertyForm);
