import React, { useContext, useState } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import { Link, withRouter } from "react-router-dom";
import Axios from "axios";
import { useAlert } from 'react-alert';
import PlacesAutocomplete from "react-places-autocomplete";
import MobileHeader from './MobileHeader';


function Filter(props) {
    const alert = useAlert();
    const appState = useContext(StateContext);
    const appDispatch = useContext(DispatchContext);
    const [propFor, setPropFor] = useState(appState.filter.pFor);

    const [type, setType] = useState(appState.filter.typ);
    const [propAge, setPropAge] = useState(appState.filter.yr);
    const [st, setSt] = useState(appState.filter.st);
    let [cities, setCities] = useState([]);
    const [ct, setCt] = useState(appState.filter.ct);
    const [locality, setLocality] = useState(appState.filter.locality);

    const [otherAddress, setOtherAddress] = useState('');
    const [ar, setAr] = useState('');
    const statesData = appState.states;
    const updateState = async (value) => {
        let state = statesData.filter(state => state.name === value)
        let cities = await Axios.get(`/getCities?id=${state[0].id}`);
        if (cities.data) {
            setCities(cities.data);
        }
        setCt('');
        setSt(value);
    }
    const searchOptions = {
        componentRestrictions: { country: "in" },
        // location: new google.maps.LatLng(26.8467, 80.9462),
        // radius: 2000,
        types: ["(regions)"]
    };

    const applyFilter = async () => {
        appDispatch({ type: "filter", data: { typ: type, pFor: propFor, yr: propAge, ct, st, locality } });
        props.history.push("/");

    }

    const resetFilter = async () => {
        setType('');
        setPropFor('');
        setPropAge('');
        setCt('');
        setSt('');
        setLocality('');
        appDispatch({ type: "filter", data: { typ: '', pFor: '', yr: '', st: '', ct: '', locality: '' } });
    }

    return (
        <>
            {/* mobile view */}
            <MobileHeader></MobileHeader>
            {/* mobile view end */}
            <div id="shortlist" className="fixfor-mobile-sidemenu mob-filter">
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"></link>
                <link rel="stylesheet" href="resources/css/newProperty.css"></link>
                {/* <h3 className="m-0 pl-3 py-2 new-prop-h3-left">Filters</h3> */}
                <div className="d-none d-md-block">
                    <Link to="/">
                        <img id="shortlistcancel" src="resources/svg/cancel.svg" />
                    </Link>
                </div>

                <div id="shortlistbody" className="mob-filter-body">
                    <div className="container">
                        <div className="row no-gutters mt-3 new-prop d-none d-md-flex">
                            <div className="col-12">
                                <h3 className="m-0 pl-3 py-2 new-prop-h3-left">Filters</h3>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-5 mt-2 d-none d-md-block">
                                <div id="propdetail" className="newpropdetail w-100 m-0">
                                    <div className="shortlist-img-container">
                                        <img className="" src="https://res.cloudinary.com/www-propshots-in/image/upload/v1604054786/Test/p4fbrivnxxuzkwn9p9fx.jpg" />
                                    </div>
                                    <div className="fix-div-height">
                                        <div className="details">
                                            <div className="blankData">
                                                {
                                                    (propFor || type) ?
                                                        <>
                                                            <img src="resources/svg/Path%2099-1.svg " className="prop-icon" />
                                                            {propFor} {propFor && type && ','} {type}
                                                        </> :
                                                        <>
                                                            <span className="d-none"></span>
                                                            <span></span>
                                                        </>
                                                }
                                            </div>
                                        </div>
                                        <div className="details">
                                            <div className="blankData">
                                                {
                                                    propAge ?
                                                        <>
                                                            <img src="resources/svg/Group%20172.svg" className="prop-icon" />
                                                            {propAge}
                                                        </> :
                                                        <>
                                                            <span className="d-none"></span>
                                                            <span></span>
                                                        </>
                                                }
                                            </div>
                                        </div>
                                        <div className="details">
                                            {
                                                ct || st ?
                                                    <>
                                                        <img src="resources/svg/Path%20132.svg" className="prop-icon icone-prop-home" />
                                                        <span className="detail-text">
                                                            {ct} {st}
                                                        </span>
                                                    </>
                                                    :
                                                    <div className="blankData">
                                                        <span className="d-none"></span>
                                                        {/* <span>
                                            <input type="checkbox" className="cus-checkbox" id="test3" />
                                            <label htmlFor="test3"></label>
                                        </span> */}
                                                        <span></span>
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-7 border-left-1 align-items-stretch">
                                <div className="row mb-4 mt-4">
                                    <div className="col-12 col-md-5 pr-0">
                                        <h6 className="heading-txt-clr">Property For</h6>
                                        <ul className="prop-type-ul">
                                            <li className={(propFor == 'Sale') ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
                                                <label htmlFor="Sale">
                                                    Sale
                                    </label>
                                                <input type="radio" name="for" id="Sale" className="d-hide" onClick={() => setPropFor('Sale')} />
                                            </li>
                                            <li className={(propFor == 'Rent') ? "mb-2 activate" : "mb-2"}>
                                                <label htmlFor="Rent">
                                                    Rent
                                    </label>
                                                <input type="radio" name="for" id="Rent" className="d-hide" onClick={() => setPropFor('Rent')} />
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-12 col-md-7 mt-4 mt-md-0">
                                        <h6 className="heading-txt-clr">Property Type</h6>
                                        <ul className="prop-type-ul">
                                            <li className={(type == 'Residential') ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
                                                <label htmlFor="Residential">
                                                    Residential
                                    </label>
                                                <input type="radio" name="type" id="Residential" className="d-hide" onClick={() => setType('Residential')} />
                                            </li>
                                            <li className={(type == 'Commercial') ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
                                                <label htmlFor="Commercial">
                                                    Commercial
                                    </label>
                                                <input type="radio" name="type" id="Commercial" className="d-hide" onClick={() => setType('Commercial')} />
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="row mb-4 mt-4">
                                    <div className="col-12">
                                        <h6 className="heading-txt-clr">Select your preference</h6>
                                        <ul className="prop-type-ul">
                                            {/* <li className={st == 'property_within_state'? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
                                    <label htmlFor="property_within_state">
                                        Property Within State
                                    </label>
                                    <input type="radio" name="state" id="property_within_state" className="d-hide"
                                        onClick={() => setSt('property_within_state')} />
                                    
                                </li> */}
                                            <li className="mb-2 mr-2 w-50">
                                                <select id="state" onChange={(e) => { updateState(e.target.value) }} value={st} placeholder="Select State" className="w-100 prop-type-input">
                                                    <option value="null">State</option>
                                                    {
                                                        statesData && statesData.map(state => {
                                                            return <option value={state.name} key={state._id}>{state.name}</option>
                                                        })
                                                    }
                                                </select>
                                            </li>
                                            <li className="mb-2 mr-2 w-50">
                                                <select id="city" onChange={(e) => { setCt(e.target.value) }} placeholder="Select City Name" value={ct} placeholder="State" className="w-100 prop-type-input">
                                                    <option value="null">City</option>
                                                    {
                                                        cities && cities.map(city => {
                                                            return <option value={city.name} key={city._id}>{city.name}</option>
                                                        })
                                                    }
                                                </select>
                                            </li>
                                            <li className="mb-2 mr-2 w-50">
                                                {/* <input className="w-100 prop-type-input" placeholder="Locality" onChange={(e) => { setLocality(e.target.value) }} value={locality} /> */}
                                                <PlacesAutocomplete value={locality.split(',')[0]} onChange={setLocality} searchOptions={searchOptions}>
                                                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                                        <div className="places-div">
                                                            <input {...getInputProps({ placeholder: "Locality", maxLength: "100" })} className="w-100 prop-type-input" />

                                                            <div className="floating-suggestion">
                                                                {loading ? <div>...loading</div> : null}

                                                                {suggestions.map((suggestion) => {
                                                                    const style = { backgroundColor: suggestion.active ? "#41b6e6" : "#fff"};
                                                                    const splitedKeys = suggestion.description.split(',');
                                                                    const optionValue = ([splitedKeys[0], splitedKeys[1]]).join(', ');

                                                                    return <div {...getSuggestionItemProps(suggestion, { style })} key={optionValue}>{optionValue}</div>;
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </PlacesAutocomplete>

                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                {/* <div className="row mb-4 mt-4">
                        <div className="col-12"> */}
                                {/* <ul className="prop-type-ul"> */}
                                {/* <li className={distance == 'property_near_me'? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
                                    <label htmlFor="property_near_me">
                                        Property Near me
                                    </label>
                                    <input type="radio" name="distance" id="property_near_me" className="d-hide"
                                        onClick={() => setDistance('property_near_me')} />
                                </li> */}
                                {/* <li className={distance == 'property_within_city'? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
                                    <label htmlFor="property_within_city">
                                        Property Within City
                                    </label>
                                    <input type="radio" name="distance" id="property_within_city" className="d-hide"  onClick={() => setDistance('property_within_city')} />
                                </li> */}
                                {/* </ul> */}

                                {/* </div> */}
                                {/* <div className="col-6">
                            <select id="city"  onChange={(e) => {setCt(e.target.value)}} placeholder="Select City Name" value={ct} placeholder="State" className="w-100 prop-type-input">
                                <option value="null">Select</option>
                                {
                                    cities && cities.map(city => {
                                        return <option value={city} key={city}>{city}</option>
                                    })
                                }
                            </select>
                        </div> */}

                                {/* </div> */}
                                <div className="row mb-4 mt-4">
                                    <div className="col-12">
                                        <h6 className="heading-txt-clr">Age of Property</h6>
                                        <ul className="prop-type-ul">
                                            <li className={(propAge == 'New property') ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
                                                <label htmlFor="New property"> New Property </label>
                                                <input type="radio" name="prop_age" id="New property" className="d-hide" onClick={() => setPropAge('New property')} />
                                            </li>
                                            <li className={(propAge == 'Under Construction') ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
                                                <label htmlFor="Under Construction"> Under Construction </label>
                                                <input type="radio" name="prop_age" id="Under Construction" className="d-hide" onClick={() => setPropAge('Under Construction')} />
                                            </li>
                                            <li className={(propAge == 'Time tested property') ? "mb-2 mr-5 activate" : "mb-2 mr-5"}>
                                                <label htmlFor="time_tested_property"> Time tested property </label>
                                                <input type="radio" name="prop_age" id="time_tested_property" className="d-hide" onClick={() => setPropAge('Time tested property')} />
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-12 d-block d-md-none text-center">
                                        <div className="row">
                                            <div className="col-6">
                                                <button className="m-pos-inherit" id="nextshortlist" onClick={() => applyFilter()}>Apply</button>
                                            </div>
                                            <div className="col-6 text-center">
                                                {
                                                    (appState.filter.ct || appState.filter.pFor || appState.filter.st || appState.filter.typ || appState.filter.yr || appState.filter.locality) &&
                                                    <button id="resetFilters" className="m-pos-inherit" onClick={() => resetFilter()}>Reset Filters</button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-none d-md-block">
                    <button id="nextshortlist" onClick={() => applyFilter()}>Apply</button>
                    {
                        (appState.filter.ct || appState.filter.pFor || appState.filter.st || appState.filter.typ || appState.filter.yr || appState.filter.locality) &&
                        <button id="resetFilters" onClick={() => resetFilter()}>Reset Filters</button>
                    }
                </div>
            </div>
        </>
    );
}

export default withRouter(Filter);
