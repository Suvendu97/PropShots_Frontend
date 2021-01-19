import React, { useContext, useState } from "react";
import { useAlert, withAlert } from 'react-alert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import StateContext from "../StateContext";
import FileBase64 from 'react-file-base64'
import CarouselNewProp from "./CarouselNewProp";
import Axios from "axios";
import PlacesAutocomplete from "react-places-autocomplete";
import { Link, withRouter } from "react-router-dom";
import Dropzone from 'react-dropzone';

const useStyles = makeStyles((theme) => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

function NewProperty(props) {
	const [step, setStep] = useState(1);
	const [formHead, setFormHead] = useState('Property For');
	const appState = useContext(StateContext);
	const [pFor, setPFor] = useState('');
	const [typeImg, setTypeImg] = useState('Group 198');
	const [propAge, setPropAge] = useState();
	const [type, setType] = useState();
	const [subCat, setSubCat] = useState('');
	const [exCat, setExCat] = useState('');
	const [loc, setLoc] = useState('');
	let [cities, setCities] = useState([]);
	const [base64, setbase64] = useState();
	const [yr, setYr] = useState('');
	const [st, setSt] = useState('');
	const [ct, setCt] = useState('');
	const [submitDisabled, setSubmitDisabled] = useState(false);
	const [otherAddress, setOtherAddress] = useState('');
	const [ar, setAr] = useState('');
	const [arUnit, setArUnit] = useState('Sq. Ft.');
	const [mv, setMv] = useState('');
	const [mvWords, setMvWords] = useState('');
	const [disPer, setDisPer] = useState(0);
	const [photo, setPhoto] = useState([]);
	const [actualPrice, setActualPrice] = useState(0);
	const [loading, setLoading] = useState(false);
	const classes = useStyles();
	let photoArray = [];
	const statesData = appState.states

	const units = ['Sq.Ft.', 'Sq.Mt.', 'Sq.Yd.', 'Acres', 'Marla', 'Cents',
		'Bigha', 'Kottah', 'Kanal', 'Grounds', 'Ares', 'Guntha',
		'Biswa', 'Hectares', 'Chataks', 'Perch', 'Rood', 'Aankadam'];
	const alert = useAlert();

	const searchOptions = {
		componentRestrictions: { country: "in" },
	};

	const searchOptions1 = {
		types: ["(cities)"],
		componentRestrictions: { country: "in" }
	};

	const handleAreaChange = (e) => {
		if ((e.target.value) > 999999999) {
			e.target.value = ar
			setAr(ar)
		} else {
			if ((ar / 1 === 0) && (e.target.value / 1 === 0)) {
				e.target.value = ''
				setAr('');
			} else {
				if (e.target.value > 0) {
					e.target.value = e.target.value / 1;
				}
				setAr(e.target.value);
			}
		}
	}

	const handlePriceChange = (e) => {
		if ((e.target.value) > 999999999) {
			e.target.value = mv;
			setMv(mv)
		} else {
			if ((mv / 1 === 0) && (e.target.value / 1 === 0)) {
				e.target.value = ''
				setMv('');
			} else {
				if (e.target.value) {
					e.target.value = e.target.value / 1;
				}
				setMv(e.target.value);
			}
		}
		calculateActualPrice(e.target.value, disPer);
		RupeeConversion(e.target.value)
	}

	const convertToIndianFortmate = (price) => {
		let x = price;
		x = x.toString();
		let lastThree = x.substring(x.length - 6);
		let otherNumbers = x.substring(0, x.length - 6);
		if (otherNumbers != '')
			lastThree = ',' + lastThree;
		let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
		return (res);
	}

	function convertNumberToWords(amount) {
		var words = new Array();
		words[0] = '';
		words[1] = 'One';
		words[2] = 'Two';
		words[3] = 'Three';
		words[4] = 'Four';
		words[5] = 'Five';
		words[6] = 'Six';
		words[7] = 'Seven';
		words[8] = 'Eight';
		words[9] = 'Nine';
		words[10] = 'Ten';
		words[11] = 'Eleven';
		words[12] = 'Twelve';
		words[13] = 'Thirteen';
		words[14] = 'Fourteen';
		words[15] = 'Fifteen';
		words[16] = 'Sixteen';
		words[17] = 'Seventeen';
		words[18] = 'Eighteen';
		words[19] = 'Nineteen';
		words[20] = 'Twenty';
		words[30] = 'Thirty';
		words[40] = 'Forty';
		words[50] = 'Fifty';
		words[60] = 'Sixty';
		words[70] = 'Seventy';
		words[80] = 'Eighty';
		words[90] = 'Ninety';
		amount = amount.toString();
		var atemp = amount.split(".");
		var number = atemp[0].split(",").join("");
		var n_length = number.length;
		var words_string = "";
		if (n_length <= 9) {
			var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
			var received_n_array = new Array();
			for (var i = 0; i < n_length; i++) {
				received_n_array[i] = number.substr(i, 1);
			}
			for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
				n_array[i] = received_n_array[j];
			}
			for (var i = 0, j = 1; i < 9; i++, j++) {
				if (i == 0 || i == 2 || i == 4 || i == 7) {
					if (n_array[i] == 1) {
						n_array[j] = 10 + parseInt(n_array[j]);
						n_array[i] = 0;
					}
				}
			}
			let value = amount;
			value = "";
			for (var i = 0; i < 9; i++) {
				if (i == 0 || i == 2 || i == 4 || i == 7) {
					value = n_array[i] * 10;
				} else {
					value = n_array[i];
				}
				if (value != 0) {
					words_string += words[value] + " ";
				}
				if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
					words_string += "Crores ";
				}
				if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
					words_string += "lacs ";
				}
				if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
					words_string += "Thousand ";
				}
				if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
					words_string += "Hundred and ";
				} else if (i == 6 && value != 0) {
					words_string += "Hundred ";
				}
			}
			words_string = words_string.split("  ").join(" ");
		}
		return words_string;
	}

	const uploadFile = () => {
		document.querySelector('.step1 input[type="file"]').click()
	}


	const handleFiles = (files) => {
		let Base64 = '';
		getBase64(files[0], (result) => {
			Base64 = result;
			files = [{ 'base64': Base64, 'file': files[0], 'name': files[0]['name'], 'size': files[0]['size'], 'type': files[0]['type'] }];
			let len = photo.length;
			let photoData = photo;
			let i;
			for (i = 0; i < (5 - len); i++) {
				if (!files[i]) {
					break;
				}
				photoData.push(files[i]);
			}
			setPhoto([...photoData])
			if (i !== 5 && files[i]) {
				alert.show(<div style={{ color: '#2E9AFE' }}>'You can upload 5 images only!'</div>);
			}
		});
	}

	function getBase64(file, cb) {
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function () {
			cb(reader.result)
		};
		reader.onerror = function (error) {
			console.log('Error: ', error);
		};
	}

	const handlePropertyPurpose = (value) => {
		setPFor(value);
	}

	const validateStep = (step) => {
		let valid = false;
		switch (step) {
			case 2:
				return pFor;
			case 3:
				return (type && subCat && exCat);
			case 4:
				return propAge ? (propAge !== 'Under Construction' ? true : yr) : false;
			case 5:
				return (loc && st && ct && otherAddress);
			case 6:
				return Boolean(ar);
			case 7:
				return Boolean(mv);
			case 8:
				return photo.length;

		}
		return valid;
	}

	const changeStep = (step, type) => {
		const stepHead = [
			'Property For',
			'Property Type',
			'Property Age',
			'Property Location',
			'Area of Selected Property',
			'Offered Discount on Property Value',
			'Upload your Property Image'
		];
		if (type === 'back') {
			setStep(step);
			setFormHead(stepHead[step - 1]);
		} else if (validateStep(step)) {
			setStep(step);
			setFormHead(stepHead[step - 1]);
		} else {
			alert.error(<div style={{ color: '#FF0040' }}>{stepHead[step - 2] + ' is Mandatory'}</div>);
		}
	}

	const RupeeConversion = (value) => {
		var number = value;
		var strNumber = number.toString();
		var count = strNumber.length;
		var first = strNumber[0];
		var last;
		var second;
		if (count == 6) {
			last = strNumber.slice(1, 3);
			setMvWords(first + "." + last + " lacs");
		} else if (count == 7) {
			second = strNumber[1];
			last = strNumber.slice(2, 4);
			setMvWords(first + second + "." + last);// + " lacs");
		} else if (count == 8) {
			last = strNumber.slice(1, 3);
			setMvWords(first + "." + last)
		} else if (count == 9) {
			second = strNumber[1];
			last = strNumber.slice(2, 4);
			setMvWords(first + second + "." + last);
		} else if (count == 10) {
			second = strNumber[1];
			var third = strNumber[2]
			last = strNumber.slice(3, 5);
			setMvWords(first + second + third + "." + last);
		} else if (count == 11) {
			second = strNumber[1];
			var third = strNumber[2]
			last = strNumber.slice(4, 6);
			setMvWords(first + second + third + strNumber[3] + "." + last);
		} else if (count == 12) {
			second = strNumber[1];
			var third = strNumber[2]
			last = strNumber.slice(6, 8);
			setMvWords(first + second + third + strNumber[4] + strNumber[5] + "." + last);
		} else if (count == 13) {
			second = strNumber[1];
			// var third = strNumber[2]
			last = strNumber.slice(2, 4);
			setMvWords(first + "." + last);
		} else if (count == 14) {
			second = strNumber[1];
			var third = strNumber[2]
			last = strNumber.slice(3, 5);
			setMvWords(first + second + "." + last);
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

	const calculateActualPrice = (value, dis) => {
		setTimeout(setActualPrice((value - (value * (dis / 100))).toFixed(2)), 100)
			;
	}

	const updateState = async (value) => {
		let state = statesData.filter(state => state.name === value)
		let cities = await Axios.get(`/getCities?id=${state[0].id}`);
		if (cities.data) {
			setCities(cities.data);
		}
		setCt('');
		setSt(value);
	}

	const postProperty = async () => {
		setSubmitDisabled(true);
		setLoading(true);
		photoArray = [];
		photo.map(pic => {
			photoArray.push(pic.base64);
		})

		try {
			const response = await Axios.post("/property", { pFor, typ: type, propAge, subCat, exCat, location: { add: loc, ct, st }, yr, ar, arUnit, mv, disPer, photo: photoArray, desc: otherAddress }, { headers: { Authorization: `Bearer ${appState.user.token}` } });
			setSubmitDisabled(false);
			setLoading(false);
			if (response.data) {
				alert.success(<div style={{ color: '#00cc00' }}>Property posted successfully!</div>);
				props.history.push("/");
			} else {
				alert.error(<div style={{ color: '#FF0040' }}>Something went wrong!</div>);
			}
		} catch (err) {
			console.log("something went wrong", err);
			location.href = "/";
		}
	}

	function spinner(loadingState) {
		if (loadingState) {
			return (
				<Backdrop className={classes.backdrop} open>
					<CircularProgress color="inherit" />
				</Backdrop>
			)
		}
	}

	const removePhoto = (photoIndex) => {
		let photoData = photo;
		photoData.splice(photoIndex, 1);
		setPhoto([...photoData]);
	}


	return (
		<>

			<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"></link>
			<link rel="stylesheet" href="resources/css/newProperty.css"></link>
			<div id="shortlist">
				<Link to="/">
					<img id="shortlistcancel" src="resources/svg/cancel.svg" />
				</Link>
				<div id="shortlistbody">
					<div className="container">
						<div className="row no-gutters mt-3 new-prop">
							<div className="col-6">
								<h3 className="m-0 pl-3 py-2 new-prop-h3-left">Post a new property</h3>
							</div>
							<div className="col-6 text-right">
								<h3 className="m-0 pr-3 py-2 new-prop-h3-right">{formHead}</h3>
							</div>
						</div>
						<div className="row">
							<div className="col-md-5 mt-2">
								<div id="propdetail" className="newpropdetail w-100 m-0">
									<div className="shortlist-img-container ">
										{
											photo.length > 0 ?
												<CarouselNewProp property={{ _id: Math.random(), photo }} mv={mv} disPer={disPer} propFor={typeImg} /> :
												<img className="op-1" src="https://res.cloudinary.com/www-propshots-in/image/upload/v1604054786/Test/p4fbrivnxxuzkwn9p9fx.jpg" />
										}
									</div>
									<div className="fix-div-height p-0">
										<div className='card-body-top'>
											<ul className="dash-card-ul">
												<li className="dash-card-ul-li">
													<p className="font-hbold">{type}</p>
													<p className="font-cblack">{subCat.substr(0, 12)}</p>
													<p className="font-cbold">
														<span className="font-hregular onproperty">{pFor && 'For'} </span>
														<span>{pFor}</span>
													</p>
												</li>
												<li className="dash-card-ul-li">
													<ul className="offered-dis-ul">
														<li className="offered-dis-ul-li">
															<p className="font-hbold">offered</p>
															<p className="font-cbold cpb-4">Discount</p>
															<p className="onproperty font-hregular">on property</p>
														</li>
														<li className='offered-dis-ul-li font-cblack font-size-20'>{disPer}<sup>%</sup></li>
													</ul>
												</li>
												<li className="dash-card-ul-li">
													<ul className="offered-dis-ul offered-dis-ul-last">
														<li className="offered-dis-ul-li">
															<p className="font-hregular font-cblack font-size-20"><b>&#x20B9;</b></p>
														</li>
														<li className="offered-dis-ul-li font-cblack">
															<p className="font-size-20">{mvWords}</p>
														</li>
													</ul>
													<p className="onproperty font-hregular">{price_in_words(mv)}</p>
												</li>
											</ul>
										</div>
										<div className='card-body-bottom'>
											{/* <div className="details">
											{
												loc ? 
													<>
														<img src="resources/svg/Path%20132.svg" className="prop-icon"></img>
														<span className="detail-text">{'fix it'} Kms Away</span>
													</>
													:
													<div className="blankData">
														<span></span>
														<span></span>
													</div>
													

											}
										</div> */}
											<div className="details">
												{
													ar ?
														<>
															<img src="resources/svg/Group%20172.svg" className="prop-icon"></img>
															<span className="detail-text">
																Property Area {ar} {arUnit}
															</span>
														</>
														:
														<div className="blankData">
															<span></span>
															<span></span>
														</div>
												}
											</div>
											<div className="details">
												{
													loc || ct || st || otherAddress ?
														<>
															<img src="resources/svg/Path%2099-1.svg" className="prop-icon icone-prop-home" />
															<span className="detail-text">
																{loc}{ct ? <span>, {ct}</span> : <span></span>}{st ? <span>, {st}</span> : <span></span>}{otherAddress ? <span>&nbsp;( {otherAddress} )</span> : <span></span>}
															</span>
														</>
														:
														<div className="blankData">
															<span></span>
															<span></span>
														</div>
												}
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-md-7 border-left-1 align-items-stretch">
								{step == 7 &&
									<div className="step1">
										<div className="row mb-4 mt-2">
											{photo.map((pic, i) => {
												return (

													<div className="col-4 align-items-center" key={`imageDiv_${i}`}>
														<div className="img-upload-div p-0" style={{ position: 'relative' }}>
															<i className="fa fa-remove" onClick={(e) => removePhoto(i)} style={{ color: '#d00', position: 'absolute', right: '5px' }} />
															<img src={pic.base64} />
														</div>
													</div>
												)
											})
											}
											{photo.length > 0 ? "" :
												<div className="col-4 align-items-center">
													<Dropzone onDrop={handleFiles} multiple>
														{({ getRootProps, getInputProps }) => (
															<div className="img-upload-div" {...getRootProps()}>
																<input {...getInputProps()} />
																<img src="resources/svg/Group%20248.svg" className="" />
																<p className="upload-prop-img-txt mb-0">Property Image Dropzone</p>
															</div>
														)}
													</Dropzone>
												</div>
											}
											{photo.length > 1 ? "" :
												<div className="col-4 align-items-center">
													<Dropzone onDrop={handleFiles} multiple>
														{({ getRootProps, getInputProps }) => (
															<div className="img-upload-div" {...getRootProps()}>
																<input {...getInputProps()} />
																<img src="resources/svg/Group%20248.svg" className="" />
																<p className="upload-prop-img-txt mb-0">Property Image Dropzone</p>
															</div>
														)}
													</Dropzone>
												</div>
											}
											{photo.length > 2 ? "" :
												<div className="col-4 align-items-center">
													<Dropzone onDrop={handleFiles} multiple>
														{({ getRootProps, getInputProps }) => (
															<div className="img-upload-div" {...getRootProps()}>
																<input {...getInputProps()} />
																<img src="resources/svg/Group%20248.svg" className="" />
																<p className="upload-prop-img-txt mb-0">Property Image Dropzone</p>
															</div>
														)}
													</Dropzone>
												</div>
											}
											{photo.length > 3 ? "" :
												<div className="col-4 align-items-center">
													<Dropzone onDrop={handleFiles} multiple>
														{({ getRootProps, getInputProps }) => (
															<div className="img-upload-div" {...getRootProps()}>
																<input {...getInputProps()} />
																<img src="resources/svg/Group%20248.svg" className="" />
																<p className="upload-prop-img-txt mb-0">Property Image Dropzone</p>
															</div>
														)}
													</Dropzone>
												</div>
											}
											{photo.length > 4 ? "" :
												<div className="col-4 align-items-center">
													<Dropzone onDrop={handleFiles} multiple>
														{({ getRootProps, getInputProps }) => (
															<div className="img-upload-div" {...getRootProps()}>
																<input {...getInputProps()} />
																<img src="resources/svg/Group%20248.svg" className="" />
																<p className="upload-prop-img-txt mb-0">Property Image Dropzone</p>
															</div>
														)}
													</Dropzone>
												</div>
											}

											{/* <div className="col-4 align-items-center">
													<div className="img-upload-div" onClick={() => uploadFile()}>
														<img src="resources/svg/Group%20248.svg" className=""/>
														<p className="upload-prop-img-txt mb-0">Upload Property Image</p>
													</div>
												</div> 
												<div className="col-4 align-items-center">
													<div className="img-upload-div" onClick={() => uploadFile()}>
														<img src="resources/svg/Group%20248.svg" className=""/>
														<p className="upload-prop-img-txt mb-0">Upload Property Image</p>
													</div>
												</div>
												<div className="col-4 align-items-center">
													<div className="img-upload-div" onClick={() => uploadFile()}>
														<img src="resources/svg/Group%20248.svg" className=""/>
														<p className="upload-prop-img-txt mb-0">Upload Property Image</p>
													</div>
												</div>
												<div className="col-4 align-items-center">
													<div className="img-upload-div" onClick={() => uploadFile()}>
														<img src="resources/svg/Group%20248.svg" className=""/>
														<p className="upload-prop-img-txt mb-0">Upload Property Image</p>
													</div>
												</div>
												<div className="col-4 align-items-center">
													<div className="img-upload-div" onClick={() => uploadFile()}>
														<img src="resources/svg/Group%20248.svg" className=""/>
														<p className="upload-prop-img-txt mb-0">Upload Property Image</p>
													</div>
												</div> */}
										</div>

										{/* <FileBase64 multiple={true} onDone={handleFiles} /> */}
										<ul className="drag-photo-ul">
											<li>
												Drag your photos here or upload
										</li>
											<li>
												Upload 5 photos of 10 MB in format png, jpg, jpeg.
										</li>
											<li className="mt-1">
												<a className="link pointer" onClick={() => uploadFile()}>Upload</a>
											</li>
										</ul>
									</div>
								}
								{step == 1 &&
									<div className="step2">
										{/* <div className="row mt-4">
										<div className="col-12 mb-2">
											<ul className="drag-photo-ul mb-2">
												<li>
												Select here your Property for
												</li>
											</ul>
										</div>
									</div> */}
										<div className="row mt-4">
											<div className="col align-items-center">
												{/* <ul className="drag-photo-ul step-description-bullet">
											<li>
											Select here your Property for
											</li>
										</ul> */}
												<ul className="prop-type-ul">
													<li className={pFor == 'SALE' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
														<label htmlFor="sale">
															Sale
													</label>
														<input type="radio" name="propertyType" id="sale" className="d-hide" onClick={() => handlePropertyPurpose('SALE')} />
													</li>
													<li className={pFor == 'RENT' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
														<label htmlFor="rent">
															Rent
													</label>
														<input type="radio" name="propertyType" id="rent" className="d-hide" onClick={() => handlePropertyPurpose('RENT')} />
													</li>
												</ul>
											</div>
											{/* <div className="col-4 align-items-center">
											<div className="img-upload-select-div">
												<label htmlFor="group-img1">
													<img src="resources/svg/Group%20200.svg" className="" />
												</label>
												<div className="img-upload-checkbox-div">
													<input type="radio" id="group-img1" name="propertyType" onClick={(e) => handlePropertyPurpose(e.target)} value="SALE" className="pl-3"></input>
												</div>
											</div>
										</div>
										<div className="col-4 align-items-center">
											<div className="img-upload-select-div">
												<label htmlFor="group-img2">
													<img src="resources/svg/Group%20262.svg" />
												</label>
												<div className="img-upload-checkbox-div">
													<input type="radio" id="group-img2" name="propertyType" onClick={(e) => handlePropertyPurpose(e.target)} value="RENT" className="pl-3"></input>
												</div>
											</div>
										</div> */}
										</div>
										{/* <ul className="drag-photo-ul">
										<li>
										Select here your Property for
										</li>
									</ul> */}
									</div>
								}
								{step == 2 &&
									<div className="step3">
										{/* <div className="row mb-4 mt-4">
										<div className="col-12 mb-2">
											<ul className="drag-photo-ul mb-2">
												<li>
												Select here your Property type
												</li>
											</ul>
										</div>
									</div>  */}
										<div className="row mb-4 mt-4">
											<div className="col-6">
												<div className="img-upload-select-div">
													<label htmlFor="group-img1">
														<img src="resources/svg/residential.svg" className="w-50" />
													</label>
													<div className="img-upload-checkbox-div">
														<input type="radio" id="group-img1" name="type" checked={type === 'Residential'}
															onChange={() => { setType('Residential'); setSubCat(''); setExCat('') }}
															value="Residential" className="pl-3" />
													</div>
												</div>
											</div>
											<div className="col-6">
												<div className="img-upload-select-div">
													<label htmlFor="group-img2">
														<img src="resources/svg/commercial.png" className="w-50" />
													</label>
													<div className="img-upload-checkbox-div">
														<input type="radio" id="group-img2" name="type" checked={type === 'Commercial'} onChange={() => { setType('Commercial'); setSubCat(''); setExCat('') }} value="Commercial" className="pl-3"></input>
													</div>
												</div>
											</div>
										</div>
										{/* <ul className="drag-photo-ul mb-2">
										<li>
										Select here your Property type
										</li>
									</ul> */}
										<div className="row">
											<div className="col-12">
												{
													type == 'Residential' &&
													<ul className="prop-type-ul">
														<li className={subCat == 'Apartment /Flat / Builder Floor' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="apartment">
																Apartment /Flat / Builder Floor
													</label>
															<input type="radio" name="subcat" id="apartment" className="d-hide" onClick={() => { setSubCat('Apartment /Flat / Builder Floor'); setExCat('') }} />
														</li>
														<li className={subCat == 'Land' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="land">
																Land
													</label>
															<input type="radio" name="subcat" id="land" className="d-hide" onClick={() => { setSubCat('Land'); setExCat('') }} />
														</li>
														<li className={subCat == 'House Villa' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="house_villa">
																House Villa
													</label>
															<input type="radio" name="subcat" id="house_villa" className="d-hide" onClick={() => { setSubCat('House Villa'); setExCat('') }} />
														</li>
														<li className={subCat == 'Others' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="others">
																Others
													</label>
															<input type="radio" name="subcat" id="others" className="d-hide" onClick={() => { setSubCat('Others'); setExCat('') }} />
														</li>
													</ul>
												}
												{
													type == 'Commercial' &&
													<ul className="prop-type-ul">
														<li className={subCat == 'Office' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="office">
																Office
													</label>
															<input type="radio" name="subcat" id="office" className="d-hide" onClick={() => { setSubCat('Office'); setExCat('') }} />
														</li>
														<li className={subCat == 'Retail' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="retail">
																Retail
													</label>
															<input type="radio" name="subcat" id="retail" className="d-hide" onClick={() => { setSubCat('Retail'); setExCat('') }} />
														</li>
														<li className={subCat == 'Land' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="land">
																Land
													</label>
															<input type="radio" name="subcat" id="land" className="d-hide" onClick={() => { setSubCat('Land'); setExCat('') }} />
														</li>
														<li className={subCat == 'Industry' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="industry">
																Industry
													</label>
															<input type="radio" name="subcat" id="industry" className="d-hide" onClick={() => { setSubCat('Industry'); setExCat('') }} />
														</li>
														<li className={subCat == 'Storage' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="storage">
																Storage
													</label>
															<input type="radio" name="subcat" id="storage" className="d-hide" onClick={() => { setSubCat('Storage'); setExCat('') }} />
														</li>
														<li className={subCat == 'Hospitality' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="hospitality">
																Hospitality
													</label>
															<input type="radio" name="subcat" id="hospitality" className="d-hide" onClick={() => { setSubCat('Hospitality'); setExCat('') }} />
														</li>
														<li className={subCat == 'Others' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="others">
																Others
													</label>
															<input type="radio" name="subcat" id="others" className="d-hide" onClick={() => { setSubCat('Others'); setExCat('') }} />
														</li>
													</ul>
												}
											</div>
										</div>
										<div className="row mt-2">
											<div className="col-12">
												{
													subCat == 'Apartment /Flat / Builder Floor' &&
													<ul className="prop-type-ul prop-type-sub-ul">
														<li className={exCat == 'Residential Apartment' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="res_apart">Residential Apartment</label>
															<input type="radio" name="exCat" id="res_apart" className="d-hide"
																onClick={() => setExCat('Residential Apartment')} />
														</li>
														<li className={exCat == 'Studio Service Apartment' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="std_srvc_apart">Studio Service Apartment</label>
															<input type="radio" name="exCat" id="std_srvc_apart" className="d-hide"
																onClick={() => setExCat('Studio Service Apartment')} />
														</li>
														<li className={exCat == 'Independent / builder floor' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="ind_bld_flr">Independent / builder floor</label>
															<input type="radio" name="exCat" id="ind_bld_flr" className="d-hide"
																onClick={() => setExCat('Independent / builder floor')} />
														</li>
													</ul>
												}
												{
													type == 'Residential' && subCat == 'Land' &&
													<ul className="prop-type-ul prop-type-sub-ul">
														<li className={exCat == 'Residential Land' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="res_land">Residential Land</label>
															<input type="radio" name="exCat" id="res_land" className="d-hide"
																onClick={() => setExCat('Residential Land')} />
														</li>
														<li className={exCat == 'Farm Land' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="frm_lnd">Farm Land</label>
															<input type="radio" name="exCat" id="frm_lnd" className="d-hide"
																onClick={() => setExCat('Farm Land')} />
														</li>
													</ul>
												}
												{
													subCat == 'House Villa' &&
													<ul className="prop-type-ul prop-type-sub-ul">
														<li className={exCat == 'Farm House' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="frm_house">Farm House</label>
															<input type="radio" name="exCat" id="frm_house" className="d-hide"
																onClick={() => setExCat('Farm House')} />
														</li>
														<li className={exCat == 'Independent House / Villa' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="ind_hus_vla">Independent House / Villa</label>
															<input type="radio" name="exCat" id="ind_hus_vla" className="d-hide"
																onClick={() => setExCat('Independent House / Villa')} />
														</li>
														<li className={exCat == 'Society Villa' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="soc_vil">Society Villa</label>
															<input type="radio" name="exCat" id="soc_vil" className="d-hide"
																onClick={() => setExCat('Society Villa')} />
														</li>
													</ul>
												}
												{
													subCat == 'Office' &&
													<ul className="prop-type-ul prop-type-sub-ul">
														<li className={exCat == 'Commercial Office Space' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="com_off_spcs">Commercial Office Space</label>
															<input type="radio" name="exCat" id="com_off_spcs" className="d-hide"
																onClick={() => setExCat('Commercial Office Space')} />
														</li>
														<li className={exCat == 'Office in IT/ Business Park' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="off_bsns_park">Office in IT/ Business Park</label>
															<input type="radio" name="exCat" id="off_bsns_park" className="d-hide"
																onClick={() => setExCat('Office in IT/ Business Park')} />
														</li>
														<li className={exCat == 'Business Center' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="bsns_centr">Business Center</label>
															<input type="radio" name="exCat" id="bsns_centr" className="d-hide"
																onClick={() => setExCat('Business Center')} />
														</li>
														<li className={exCat == 'Time Share' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="time_share">Time Share</label>
															<input type="radio" name="exCat" id="time_share" className="d-hide"
																onClick={() => setExCat('Time Share')} />
														</li>
													</ul>
												}
												{
													subCat == 'Retail' &&
													<ul className="prop-type-ul prop-type-sub-ul">
														<li className={exCat == 'Commercial Shops' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="com_shops">Commercial Shops</label>
															<input type="radio" name="exCat" id="com_shops" className="d-hide"
																onClick={() => setExCat('Commercial Shops')} />
														</li>
														<li className={exCat == 'Commercial Showrooms' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="com_shwrms">Commercial Showrooms</label>
															<input type="radio" name="exCat" id="com_shwrms" className="d-hide"
																onClick={() => setExCat('Commercial Showrooms')} />
														</li>
														<li className={exCat == 'Space in Retail Mall' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="spc_rtl_mal">Space in Retail Mall</label>
															<input type="radio" name="exCat" id="spc_rtl_mal" className="d-hide"
																onClick={() => setExCat('Space in Retail Mall')} />
														</li>
													</ul>
												}
												{
													type == 'Commercial' && subCat == 'Land' &&
													<ul className="prop-type-ul prop-type-sub-ul">
														<li className={exCat == 'Commercial / Institutional Land' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="com_int_lnd">Commercial / Institutional Land</label>
															<input type="radio" name="exCat" id="com_int_lnd" className="d-hide"
																onClick={() => setExCat('Commercial / Institutional Land')} />
														</li>
														<li className={exCat == 'Agiculture / Farm Land' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="agr_frm_lnd">Agiculture / Institutional Land</label>
															<input type="radio" name="exCat" id="agr_frm_lnd" className="d-hide"
																onClick={() => setExCat('Agiculture / Farm Land')} />
														</li>
														<li className={exCat == 'Industrial Land / Plots' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="ind_lnd_plt">Industrial Land / Plots</label>
															<input type="radio" name="exCat" id="ind_lnd_plt" className="d-hide"
																onClick={() => setExCat('Industrial Land / Plots')} />
														</li>
													</ul>
												}
												{
													subCat == 'Industry' &&
													<ul className="prop-type-ul prop-type-sub-ul">
														<li className={exCat == 'Factory' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="factory">Factory</label>
															<input type="radio" name="exCat" id="factory" className="d-hide"
																onClick={() => setExCat('Factory')} />
														</li>
														<li className={exCat == 'Manufacturing' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="manufacturing">Manufacturing</label>
															<input type="radio" name="exCat" id="manufacturing" className="d-hide"
																onClick={() => setExCat('Manufacturing')} />
														</li>
													</ul>
												}
												{
													subCat == 'Storage' &&
													<ul className="prop-type-ul prop-type-sub-ul">
														<li className={exCat == 'Warehouse' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="warehouse">Warehouse</label>
															<input type="radio" name="exCat" id="warehouse" className="d-hide"
																onClick={() => setExCat('Warehouse')} />
														</li>
														<li className={exCat == 'Coldstorage' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="coldstorage">Coldstorage</label>
															<input type="radio" name="exCat" id="coldstorage" className="d-hide"
																onClick={() => setExCat('Coldstorage')} />
														</li>
													</ul>
												}
												{
													subCat == 'Hospitality' &&
													<ul className="prop-type-ul prop-type-sub-ul">
														<li className={exCat == 'Hotel' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="hotel">Hotel</label>
															<input type="radio" name="exCat" id="hotel" className="d-hide"
																onClick={() => setExCat('Hotel')} />
														</li>
														<li className={exCat == 'Resort' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="resort">Coldstorage</label>
															<input type="radio" name="exCat" id="resort" className="d-hide"
																onClick={() => setExCat('Resort')} />
														</li>
														<li className={exCat == 'Guest House' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="guest_house">Guest House</label>
															<input type="radio" name="exCat" id="guest_house" className="d-hide"
																onClick={() => setExCat('Guest House')} />
														</li>
														<li className={exCat == 'Banquet Halls' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="banquet_halls">Banquet Halls</label>
															<input type="radio" name="exCat" id="banquet_halls" className="d-hide"
																onClick={() => setExCat('Banquet Halls')} />
														</li>
													</ul>
												}
												{
													subCat == 'Others' &&
													<input type="text" onChange={(e) => { setExCat(e.target.value) }} placeholder="Type your text here" className="w-100 prop-type-input" />
												}
											</div>
										</div>
									</div>
								}
								{step == 3 &&
									<div className="step4">
										<div className="row mt-4">
											<div className="col-12">
												<ul className="prop-type-ul">
													<li className={propAge == 'New property' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
														<label htmlFor="new_property">
															New property
													</label>
														<input type="radio" name="propAge" id="new_property" className="d-hide" onClick={() => setPropAge('New property')} />
													</li>
													<li className={propAge == 'Under Construction' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
														<label htmlFor="under_construction">
															Under Construction
													</label>
														<input type="radio" name="propAge" id="under_construction" className="d-hide" onClick={() => setPropAge('Under Construction')} />
													</li>
													<li className={propAge == 'Old Age Property' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
														<label htmlFor="old_age_property">
															Old Age Property
													</label>
														<input type="radio" name="propAge" id="old_age_property" className="d-hide" onClick={() => setPropAge('Old Age Property')} />
													</li>
												</ul>
											</div>
										</div>
										{
											propAge == 'Under Construction' &&
											<div className="row mt-2">
												<div className="col-12">
													<ul className="prop-type-ul">
														<li className={yr == '2021' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="2021">
																2021
													</label>
															<input type="radio" name="yr" id="2021" className="d-hide" onClick={() => setYr('2021')} />
														</li>
														<li className={yr == '2022' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="2022">
																2022
													</label>
															<input type="radio" name="yr" id="2022" className="d-hide" onClick={() => setYr('2022')} />
														</li>
														<li className={yr == '2023' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="2023">
																2023
													</label>
															<input type="radio" name="yr" id="2023" className="d-hide" onClick={() => setYr('2023')} />
														</li>
														<li className={yr == '2024' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="2024">
																2024
													</label>
															<input type="radio" name="yr" id="2024" className="d-hide" onClick={() => setYr('2024')} />
														</li>
														<li className={yr == '2025' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="2025">
																2025
													</label>
															<input type="radio" name="yr" id="2025" className="d-hide" onClick={() => setYr('2025')} />
														</li>

													</ul>
												</div>
											</div>
										}
									</div>
								}
								{step == 4 &&
									<div className="step5">
										<div className="row mt-2">
											<div className="col">
												<img src="resources/svg/Group_map.png" className="w-100" />
											</div>
										</div>
										{/* <div className="row mt-4">
										<div className="col-12 mb-2">
											<ul className="drag-photo-ul mb-2">
												<li>
													Select or Type here your Property Location
												</li>
											</ul>
										</div>
									</div> */}
										<div className="row mt-4">
											<div className="col-12 mb-2">
												{/* <input type="text" onChange={(e) => {setPin(e.target.value)}} value={pin} placeholder="Area Pin Code" className="w-100 prop-type-input"/> */}
												<PlacesAutocomplete value={loc} onChange={setLoc} searchOptions={searchOptions}>
													{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
														<div className="places-div">
															<input {...getInputProps({ placeholder: "Address", maxLength: "100" })} className="w-100 prop-type-input" />

															<div className="floating-suggestion">
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
											<div className="col-12 mb-2">
												{/* <input type="text" onChange={(e) => {setSt(e.target.value)}} value={st} placeholder="State" className="w-100 prop-type-input"/> */}
												<select id="state" onChange={(e) => { updateState(e.target.value) }} value={st} placeholder="State" className="w-100 prop-type-input">
													<option value="null">Select</option>
													{
														statesData && statesData.map(state => {
															return <option value={state.name} key={state._id}>{state.name}</option>
														})
													}
												</select>
											</div>
											<div className="col-12 mb-2">
												{/* <input type="text" onChange={(e) => {setCt(e.target.value)}} value={ct} placeholder="City" className="w-100 prop-type-input"/> */}
												<select id="state" onChange={(e) => { setCt(e.target.value) }} value={ct} placeholder="State" className="w-100 prop-type-input">
													<option value="null">Select</option>
													{
														cities && cities.map(city => {
															return <option value={city.name} key={city._id}>{city.name}</option>
														})
													}
												</select>
											</div>
											<div className="col-12 mb-2">
												<input type="text" maxLength="100" onChange={(e) => { setOtherAddress(e.target.value) }} value={otherAddress} placeholder="Type your other details about property" className="w-100 prop-type-input" />
											</div>
										</div>
									</div>
								}
								{step == 5 &&
									<div className="step6">
										<div className="row mt-4 no-gutters">
											<div className="col-4">
												<img src="resources/svg/Group-full-arrow.png" className="sp-img-left" />
											</div>
											<div className="col-8">
												<img src="resources/img/property.png" className="sp-img-right" />
											</div>
										</div>
										{/* <ul className="drag-photo-ul mb-2">
										<li>
											Enter Your Property Area
										</li>
									</ul> */}
										<div className="row mt-4">
											<div className="col-12">
												<input type="number" value={ar} min="0" max="99999999" onChange={handleAreaChange} placeholder="Enter Your Property Area" className="w-100 prop-area-input" />
												{/* (e) => ((e.target.value)/1) > 99999999 ? setAr((ar)/1) : setAr((e.target.value)/1) */}
												<span className="sqft">
													<select onChange={(e) => setArUnit(e.target.value)} value={arUnit} className="prop-type-input">
														{
															units.map(unit => <option value={unit} key={unit}>{unit}</option>)
														}
													</select>
												</span>
											</div>
										</div>
									</div>
								}
								{step == 6 &&
									<div className="step7">
										{/* <ul className="drag-photo-ul mt-2 mb-0 font-14">
										<li>Select Offered Discount on Selected Property</li>
									</ul> */}
										<div className="row mb-4 mt-3 no-gutters">
											<div className="col-4 discount-div">
												<div className="pt-4 align-self-stretch">
													<p className="text-center mb-0 dis-in-percent pt-3">Discount in Percentage</p>
													<h3 className="text-center m-0 no-percent pt-3 valueSpan2">{disPer || 0}%</h3>
												</div>
											</div>
											<div className="col-8">
												<img src="resources/img/property.png" className="sp-img-right" />
											</div>
										</div>
										<div className="form-group">
											<input type="range" min="0" max="90" value={disPer || 0} onChange={(e) => { setDisPer(e.target.value); calculateActualPrice(mv, e.target.value) }} className="crslider" id="myRange"></input>
										</div>
										<div className="row">
											<div className="col-12">
												<input type="number" placeholder="Enter Price in Rupee" value={mv} onChange={handlePriceChange} className="w-100 value-area-input" style={{ fontSize: '20px' }} />
												<span className="inr-symbol" style={{ fontSize: '25px' }}>INR</span>
											</div>
										</div>
										<div className="row">
											{/* <div className="col-6 pr-1 align-self-center">
											<ul className="drag-photo-ul font-14">
												<li>
												Enter Your Property Value here in Rupees
												</li>
											</ul>
										</div> */}
											<div className="col-9 value-in-txt">
												Final Price in INR &nbsp;{convertToIndianFortmate(actualPrice)}
												{/* <p className="mb-1">2 Crore 45 lacs</p> */}
											</div>
										</div>

										{/* <div className="row">
										<div className="col-12 value-in-txt">
											Final Price in Words : &nbsp;{convertNumberToWords(actualPrice) ? <span>{convertNumberToWords(actualPrice)}</span> : <span>Zero</span>}
										</div>
									</div> */}

									</div>
								}
							</div>
						</div>
					</div>
				</div>
				{step > 1 && <button id="resetFilters" style={{ outline: 'none' }} onClick={() => changeStep(step - 1, 'back')}>Back</button>}
				<button id="nextshortlist" onClick={() => changeStep(step + 1, 'next')}>next</button>
			</div>
			{ (step === 8 || step === 0) &&
				<div id="shortlist1">
					{/* <img id="shortlistcancel" src="resources/svg/cancel.svg"/> */}
					<div id="shortlistbody1" className="bg-transparent">
						<img id="shortlistcancel" src="resources/svg/cancel.svg" onClick={() => changeStep(7, 'back')} />
						<div className="container">
							<div className="row hight-fixing h-100">
								<div className="col-md-5 align-self-center">
									<div id="propdetail" className="newpropdetail w-100 m-0">
										<div className="shortlist-img-container last-screen-shortlist-img">
											<CarouselNewProp property={{ _id: Math.random(), photo }} mv={mv} disPer={disPer || 0} propFor={typeImg} />
										</div>
										<div className="fix-div-height">
											<div className='card-body-top'>
												<ul className="dash-card-ul">
													<li className="dash-card-ul-li">
														<p className="font-hbold">{type}</p>
														<p className="font-cblack">{subCat.substr(0, 12)}</p>
														<p className="font-cbold">
															<span className="font-hregular onproperty">{pFor && 'For'} </span>
															<span>{pFor}</span>
														</p>
													</li>
													<li className="dash-card-ul-li">
														<ul className="offered-dis-ul">
															<li className="offered-dis-ul-li">
																<p className="font-hbold">offered</p>
																<p className="font-cbold cpb-4">Discount</p>
																<p className="onproperty font-hregular">on property</p>
															</li>
															<li className='offered-dis-ul-li font-cblack font-size-20'>{disPer}<sup>%</sup></li>
														</ul>
													</li>
													<li className="dash-card-ul-li">
														<ul className="offered-dis-ul offered-dis-ul-last">
															<li className="offered-dis-ul-li">
																<p className="font-hregular font-cblack font-size-20"><b>&#x20B9;</b></p>
															</li>
															<li className="offered-dis-ul-li font-cblack">
																<p className="font-size-20">{mvWords}</p>
															</li>
														</ul>
														<p className="onproperty font-hregular">{ }</p>
													</li>
												</ul>
											</div>

											{/* <div className="details">
									{
										loc ? 
											<>
												<img src="resources/svg/Path%20132.svg" className="prop-icon"></img>
												<span className="detail-text">
													{'fix it'} Kms Away
													<span className="edit" onClick={() => setStep(6)}>Edit</span>
												</span>
											</>
											:
											<div className="blankData">
												<span></span>
												<span></span>
											</div>
									}
								</div> */}
											<div className="details">
												{
													ar ?
														<>
															<img src="resources/svg/Group%20172.svg" className="prop-icon"></img>
															<span className="detail-text">
																Property Area {ar} {arUnit}
																<span className="edit" onClick={() => setStep(5)}>Edit</span>
															</span>
														</>
														:
														<div className="blankData">
															<span></span>
															<span></span>
														</div>
												}
											</div>
											<div className="details">
												{
													ct || st || otherAddress ?
														<>
															<img src="resources/svg/Path%2099-1.svg" className="prop-icon icone-prop-home" />
															<span className="detail-text">
																{otherAddress} {ct} {st} {loc}
																<span className="edit" onClick={() => setStep(5)}>Edit</span>
															</span>
														</>
														:
														<div className="blankData">
															<span></span>
															<span></span>
														</div>
												}
											</div>
										</div>
									</div>
								</div>
								<div className="col-md-7 align-self-center">
									<div className="row justify-content-center text-white">
										<div className="col-8">
											<div className="row mb-4 mt-4 no-gutters">
												<div className="col-12 text-center py-5">
													<a href="#" className="back-to-edit" onClick={() => changeStep(7, 'back')}>Back to Edit</a>
												</div>
												<div className="col-12 text-center pb-4">
													<p className="your-sel-pro-txt m-0">Your Selected Property Ready for the post on PropShots</p>
												</div>
												<div className="col-12 text-center pb-4">
													<p className="pay-only-txt m-0">Pay only INR 499/-</p>
													<p className="pay-only-txt m-0">to post a Property</p>
												</div>
												<div className="col-12 text-center pb-2">
													<a href="#" className="btn-pay-post" disabled={submitDisabled} onClick={() => postProperty()}>{submitDisabled ? 'Please Wait' : 'Pay & Post'}</a>
													<p className="your-sel-pro-txt m-0"><small>The only charge you pay on PropShots, Our promise!</small></p>
												</div>
												{/* <div className="col-12 text-center pb-2">
								<p className="mb-0">Or</p>
							</div>
							<div className="col-12 text-center pb-4">
								<a href="#" className="btn-save-detail">Save your Details</a>
							</div> */}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						{/* <button id="nextshortlist" onClick={() => changeStep(step+1)}>next</button> */}
					</div>
				</div>
			}
			{spinner(loading)}
		</>
	);
}

export default NewProperty;