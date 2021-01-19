import React, { useContext, useEffect, useState } from "react";
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
import ReactCrop from 'react-image-crop';
import { red } from "@material-ui/core/colors";
import MobileHeader from './MobileHeader';

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
	const [validValue, setValidValue] = useState(false);
	const [invalidMarketValue, setInvalidMarketValue] = useState(true);
	const [ct, setCt] = useState('');
	const [locality, setLocality] = useState('');
	const [submitDisabled, setSubmitDisabled] = useState(false);
	const [otherAddress, setOtherAddress] = useState('');
	const [ar, setAr] = useState('');
	const [arUnit, setArUnit] = useState('Sq. Ft.');
	const [mv, setMv] = useState('');
	const [mvWords, setMvWords] = useState('');
	const [disPer, setDisPer] = useState('');
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
		// location: new google.maps.LatLng(26.8467, 80.9462),
		// radius: 2000,
	};

	const searchOptions1 = {
		componentRestrictions: { country: "in" },
		types: ["(regions)"]
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
	const checkDisc = (e) => {
		console.log("check", e.target.value, " h ", parseInt(mv))
		if (parseInt(e.target.value) > parseInt(disPer)) {
			setMv(e.target.value)
		} else {
			setDisPer('')
		}

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

	const [src, setSrc] = useState(null);
	const [crop, setCrop] = useState({
		aspect: 23 / 12,
		unit: 'px',
		height: 100
	});
	const [Croppingimage, setCroppingImage] = useState(null);
	const [isCropping, setIsCropping] = useState(false);
	const [error, setError] = useState('');
	useEffect(() => {
		const slider = document.getElementById("myRange")
		if (slider) {
			const min = slider.min
			const max = slider.max
			const value = slider.value

			slider.style.background = `linear-gradient(to right, pink 0%, pink ${(value - min) / (max - min) * 100}%, #DEE2E6 ${(value - min) / (max - min) * 100}%, #DEE2E6 100%)`
			slider.oninput = function () {
				this.style.background = `linear-gradient(to right, #F93D64 0%, #ff94af ${(slider.value - slider.min) / (slider.max - slider.min) * 100}%, #DEE2E6 ${(slider.value - slider.min) / (slider.max - slider.min) * 100}%, #DEE2E6 100%)`
			}
		};
	}, [step])
	function getCroppedImg() {
		const canvas = document.createElement('canvas');
		const scaleX = Croppingimage.naturalWidth / Croppingimage.width;
		const scaleY = Croppingimage.naturalHeight / Croppingimage.height;
		canvas.width = crop.width;
		canvas.height = crop.height;
		const ctx = canvas.getContext('2d');

		ctx.drawImage(
			Croppingimage,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			crop.width,
			crop.height,
		);

		const base64Image = canvas.toDataURL('image/jpeg');

		let files = [{ 'base64': base64Image }];
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
		setIsCropping(false);
	}
	const handleFiles = (files) => {
		files.map(file => {
			getBase64(file, (result) => {
				setSrc(result);
				setIsCropping(true);
			});
		})

	}

	const cropper = (sourceImg, isCropping) => {
		if (isCropping) {
			return (
				<Backdrop className={classes.backdrop} open={isCropping}>
					<div className="container" style={{ marginTop: "5%" }}>
						<div className="shadow-lg p-4 p-md-5 bg-white rounded col-md-8 col-10 crop-image">
							<div className="row">
								<div className="col-12 text-center">
									<ReactCrop src={sourceImg} onImageLoaded={setCroppingImage} crop={crop} onChange={setCrop} />
								</div>
							</div>
							<div className="row mt-2">
								<div className="col-6">
									<button className="btn btn-light btn-block" onClick={() => { setIsCropping(false); setSrc(result) }}>Cancel</button>
								</div>
								<div className="col-6">
									<button className="btn btn-danger btn-block" onClick={getCroppedImg}>Crop Image</button>
								</div>
							</div>
						</div>
					</div>
				</Backdrop>
			)
		}
	}

	// const handleFiles = (files) => {
	// 	let Base64 = '';
	// 	getBase64(files[0], (result) => {
	// 			Base64 = result;
	// 			console.log('handlefiles-:',Base64);
	// 			files = [{'base64': Base64, 'file': files[0], 'name': files[0]['name'], 'size': files[0]['size'], 'type': files[0]['type']}];
	// 			console.log('newObject-:',files);
	// 			let len = photo.length;
	// 			let photoData = photo;
	// 			let i;
	// 			for(i = 0; i < (5 - len); i++ ) {
	// 				if(!files[i]) {
	// 					break;
	// 				}
	// 				photoData.push(files[i]);
	// 			}
	// 			setPhoto([...photoData])
	// 			if(i !== 5 && files[i]) {
	// 				alert.show(<div style={{color:'#2E9AFE'}}>'You can upload 5 images only!'</div>);
	// 			}
	// 	});
	// }

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

	const handlePropertyPurpose = (value, step, type) => {
		setPFor(value);
		changeStep(step, type, value)
	}
	const setPropertyType = (value, step, type) => {
		setExCat(value);
		changeStep(step, type, value)

	}
	const setPropertyYear = (value, step, type) => {
		setYr(value);
		changeStep(step, type, value)

	}
	const validateStep = (step, value) => {
		let valid = false;
		switch (step) {
			case 2:
				if (pFor ? !pFor : !value) {
					alert.error(<div style={{ color: '#FF0040' }}>Please Select Property for Rent Or sell</div>);
				}
				return value ? value : pFor;
			case 3:
				if (!type) {
					alert.error(<div style={{ color: '#FF0040' }}>Type Of Property Is Mandatory</div>);
				} else if (!subCat) {
					alert.error(<div style={{ color: '#FF0040' }}>Sub Category Of Property Is Mandatory</div>);
				} else if (exCat ? !exCat : !value) {
					alert.error(<div style={{ color: '#FF0040' }}>Type Of Sub Category Is Mandatory</div>);
				}
				return (type && subCat && value ? value : exCat);
			case 4:
				if (!propAge) {
					alert.error(<div style={{ color: '#FF0040' }}>Please select Vintage</div>);

				} else if (yr ? !yr : !value) {
					alert.error(<div style={{ color: '#FF0040' }}>Please select Possession Year</div>);
				}
				return propAge ? (!propAge ? true : value ? value : yr) : false;
			case 5:
				if (!loc) {
					alert.error(<div style={{ color: '#FF0040' }}>Please Enter Location </div>);
				} else if (!locality) {
					alert.error(<div style={{ color: '#FF0040' }}>Please Enter Locality</div>);
				} else if (!st) {
					alert.error(<div style={{ color: '#FF0040' }}>Please Enter State </div>);
				} else if (!ct) {
					alert.error(<div style={{ color: '#FF0040' }}>Please Enter City</div>);
				}
				return loc ? (st ? (ct ? (locality ? true : setError('Property Locality')) : setError('Property City')) : setError('Property State')) : setError('Property Location');
			case 6:
				if (!ar) {
					alert.error(<div style={{ color: '#FF0040' }}>Please Enter Area</div>);
				} else if (!otherAddress) {
					alert.error(<div style={{ color: '#FF0040' }}>Please Highlight your Property </div>);
				}
				return Boolean(ar) && otherAddress;
			case 7:
				if (!mv) {
					alert.error(<div style={{ color: '#FF0040' }}>Please Enter Market Value Of Your Property </div>);
				} else if (!disPer) {
					alert.error(<div style={{ color: '#FF0040' }}>Please Enter Discount On Your Property </div>);
				} else if (parseInt(mv) < parseInt(disPer)) {
					return false;
				}
				else if (pFor == "RENT" && parseInt(mv) < 1000 || parseInt(disPer) < 1000) {
					return false;
				} else if (pFor == "SALE" && parseInt(mv) < 100000 || parseInt(disPer) < 100000) {
					return false;
				}
				return Boolean(mv) && Boolean(disPer);
			case 8:
				if (!photo.length) {
					alert.error(<div style={{ color: '#FF0040' }}>Please Select Best Images Of Your Property </div>);
				}
				return photo.length;

		}
		return valid;
	}
	const changeStep = (step, type, value) => {

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
		} else if (validateStep(step, value)) {
			setStep(step);
			setFormHead(stepHead[step - 1]);
		}
	}

	const RupeeConversion = (value) => {
		var number = value;
		var strNumber = number.toString();
		var count = strNumber.length;
		var first = strNumber[0];
		var last;
		var second;
		if (count == 4 && pFor == "RENT") {
			last = strNumber.slice(1, 3);
			setMvWords(first + "." + last + " Thousand");
		} else if (count == 5 && pFor == "RENT") {
			second = strNumber[1];
			last = strNumber.slice(2, 4);
			setMvWords(first + second + "." + last + " Thousand");
		} else if (count == 6) {
			last = strNumber.slice(1, 3);
			setMvWords(first + "." + last + " Lakhs");
		} else if (count == 7) {
			second = strNumber[1];
			last = strNumber.slice(2, 4);
			setMvWords(first + second + "." + last + " Lakhs");
		} else if (count == 8) {
			last = strNumber.slice(1, 3);
			setMvWords(first + "." + last + " Crore")
		} else if (count == 9) {
			second = strNumber[1];
			last = strNumber.slice(2, 4);
			setMvWords(first + second + "." + last + " Crore");
		}
	}
	const getConverted = (value) => {
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
		var strNumber = price.toString();
		var count = strNumber.length;
		if (count == 6) {
			setInvalidMarketValue(false)
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
			const response = await Axios.post("/property", { pFor, typ: type, propAge, subCat, exCat, location: { add: loc, ct, st, locality }, yr, ar, arUnit, mv, disPer, photo: photoArray, desc: otherAddress }, { headers: { Authorization: `Bearer ${appState.user.token}` } });
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

			{/* <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"></link> */}
			{/* <link rel="stylesheet" href="resources/css/cropper.css"></link> */}
			<link rel="stylesheet" href="resources/css/newProperty.css"></link>
			<div id="shortlist" className="shortlist-mobile-fix">
				{/* mobile view */}
				<MobileHeader></MobileHeader>
				{/* mobile view end */}
				{/* <Link to="/">
					<img id="shortlistcancel" src="resources/svg/cancel.svg" />
				</Link> */}
				<div id="shortlistbody" style={{ height: '85%', top: '20px' }} className="shortlistbody-mobile-fix">
					<div className="container">
						<div className="row no-gutters mt-3 new-prop d-none d-md-flex">
							<div className="col-6">
								<h3 className="m-0 pl-3 py-2 new-prop-h3-left">POST YOUR PROPERTY</h3>
							</div>
							<div className="col-6 text-right">
								<Link to="/">
									<img id="shortlistcancel" src="resources/svg/cancel.svg" />
								</Link>
								{/* <h3 className="m-0 pr-3 py-2 new-prop-h3-right">{formHead}</h3> */}
							</div>
						</div>
						<div className="row">
							<div className="col-md-5 mt-2 mb-2 d-none d-md-flex">
								<div id="propdetail" className="newpropdetail w-100 m-0">
									<div className="shortlist-img-container new-prop-shortlist-img-container">
										{
											photo.length > 0 ?
												<CarouselNewProp property={{ _id: Math.random(), photo }} /> :
												<img className="op-1" src="https://res.cloudinary.com/www-propshots-in/image/upload/v1604054786/Test/p4fbrivnxxuzkwn9p9fx.jpg" />
										}
									</div>
									<div className="fix-div-height new-prop-fix-div-height p-0">
										<div className='card-body-top'>
											<ul className="dash-card-ul ml-2">
												<li className="dash-card-ul-li">
													<ul className="offered-dis-ul offered-dis-ul-last mb-2">
														<li className="offered-dis-ul-li" style={{ width: '100%' }}>
															<p className="font-cblack font-size-10 text-left">
																<b>&#x20B9;&nbsp;</b>
																{mvWords}
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
																{getConverted(disPer)}
															</p>
														</li>
													</ul>
													<p style={{ fontSize: '13px' }}>Discounted Offer</p>
												</li>
											</ul>
										</div>
										<div className='card-body-bottom'>
											<div className="details">
												{pFor ?
													<>
														<img src="resources/svg/type_icon.png" className="prop-icon type_img_home" />
														<span className="detail-text font-weight-bold text-uppercase">
															{!subCat.includes(type) ? !exCat.includes(type) ? type : '' : ''}
															{` ${exCat}`} {pFor && ' For'} {pFor}</span>
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
													loc ?
														<>
															<img src="resources/svg/Path%2099-1.svg" className="prop-icon icone-prop-home" />
															<span className="detail-text">
																{loc}
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
													otherAddress ?
														<>
															<span className="detail-text">
																{otherAddress ? <span>&nbsp;{otherAddress}</span> : <span></span>}
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
							<div className="col-md-7 ht-78vh border-left-1 align-items-stretch">
								{step == 7 &&
									<div className="step1">
										<div className="row mb-4 mt-2">
											<div className="col-6 col-md-4 align-items-center">
												<div className="border_dot" style={{ position: 'relative' }}>
													<b>Please upload best images of your property for quick turnaround.</b>
												</div>
											</div>
											{photo.map((pic, i) => {
												return (

													<div className="col-6 col-md-4 align-items-center" key={`imageDiv_${i}`}>
														<div className="img-upload-div p-0" style={{ position: 'relative' }}>
															<i className="fa fa-remove" onClick={(e) => removePhoto(i)} style={{ color: '#d00', position: 'absolute', right: '5px' }} />
															<img src={pic.base64} />
														</div>
													</div>
												)
											})
											}
											{photo.length > 0 ? "" :
												<div className="col-6 col-md-4 align-items-center">
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
												<div className="col-6 col-md-4 align-items-center">
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
												<div className="col-6 col-md-4 align-items-center">
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
												<div className="col-6 col-md-4 align-items-center">
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
												<div className="col-6 col-md-4 align-items-center">
													<Dropzone onDrop={handleFiles}>
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
										</div>

										<h6><b>Upload max size of 2 Mb in png, jpg or jpeg format.</b></h6>
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
												<ul className="drag-photo-ul step-description-bullet">
													<li>
														You want to
												</li>
												</ul>
												<ul className="prop-type-ul ml-3">
													<li className={pFor == 'SALE' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
														<label htmlFor="sale">
															Sell
													</label>
														<input type="radio" name="propertyType" id="sale" className="d-hide" onClick={() => handlePropertyPurpose('SALE', step + 1, 'next')} />
													</li>
													<li className={pFor == 'RENT' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
														<label htmlFor="rent">
															Rent
													</label>
														<input type="radio" name="propertyType" id="rent" className="d-hide" onClick={() => handlePropertyPurpose('RENT', step + 1, 'next')} />
													</li>
												</ul>
											</div>
										</div>
									</div>
								}
								{step == 2 &&
									<div className="step3">
										<div className="row mb-4 mt-4">
											<div className="col-6">
												<div className="img-upload-select-div">
													<label htmlFor="group-img1">
														<img src="resources/img/residential.png" className="res-com-img" />
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
														<img src="resources/img/commercial.png" className="res-com-img" />
													</label>
													<div className="img-upload-checkbox-div">
														<input type="radio" id="group-img2" name="type" checked={type === 'Commercial'} onChange={() => { setType('Commercial'); setSubCat(''); setExCat('') }} value="Commercial" className="pl-3"></input>
													</div>
												</div>
											</div>
										</div>
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
																onClick={() => setPropertyType('Residential Apartment', step + 1, 'next')
																} />
														</li>
														<li className={exCat == 'Studio Service Apartment' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="std_srvc_apart">Studio Service Apartment</label>
															<input type="radio" name="exCat" id="std_srvc_apart" className="d-hide"
																onClick={() => setPropertyType('Studio Service Apartment', step + 1, 'next')} />
														</li>
														<li className={exCat == 'Independent / builder floor' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="ind_bld_flr">Independent / builder floor</label>
															<input type="radio" name="exCat" id="ind_bld_flr" className="d-hide"
																onClick={() => setPropertyType('Independent / builder floor', step + 1, 'next')} />
														</li>
													</ul>
												}
												{
													type == 'Residential' && subCat == 'Land' &&
													<ul className="prop-type-ul prop-type-sub-ul">
														<li className={exCat == 'Residential Land' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="res_land">Residential Land</label>
															<input type="radio" name="exCat" id="res_land" className="d-hide"
																onClick={() => setPropertyType('Residential Land', step + 1, 'next')} />
														</li>
														<li className={exCat == 'Farm Land' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="frm_lnd">Farm Land</label>
															<input type="radio" name="exCat" id="frm_lnd" className="d-hide"
																onClick={() => setPropertyType('Farm Land', step + 1, 'next')} />
														</li>
													</ul>
												}
												{
													subCat == 'House Villa' &&
													<ul className="prop-type-ul prop-type-sub-ul">
														<li className={exCat == 'Farm House' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="frm_house">Farm House</label>
															<input type="radio" name="exCat" id="frm_house" className="d-hide"
																onClick={() => setPropertyType('Farm House', step + 1, 'next')} />
														</li>
														<li className={exCat == 'Independent House / Villa' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="ind_hus_vla">Independent House / Villa</label>
															<input type="radio" name="exCat" id="ind_hus_vla" className="d-hide"
																onClick={() => setPropertyType('Independent House / Villa', step + 1, 'next')} />
														</li>
														<li className={exCat == 'Society Villa' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="soc_vil">Society Villa</label>
															<input type="radio" name="exCat" id="soc_vil" className="d-hide"
																onClick={() => setPropertyType('Society Villa', step + 1, 'next')} />
														</li>
													</ul>
												}
												{
													subCat == 'Office' &&
													<ul className="prop-type-ul prop-type-sub-ul">
														<li className={exCat == 'Commercial Office Space' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="com_off_spcs">Commercial Office Space</label>
															<input type="radio" name="exCat" id="com_off_spcs" className="d-hide"
																onClick={() => setPropertyType('Commercial Office Space', step + 1, 'next')} />
														</li>
														<li className={exCat == 'Office in IT/ Business Park' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="off_bsns_park">Office in IT/ Business Park</label>
															<input type="radio" name="exCat" id="off_bsns_park" className="d-hide"
																onClick={() => setPropertyType('Office in IT/ Business Park', step + 1, 'next')} />
														</li>
														<li className={exCat == 'Business Center' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="bsns_centr">Business Center</label>
															<input type="radio" name="exCat" id="bsns_centr" className="d-hide"
																onClick={() => setPropertyType('Business Center', step + 1, 'next')} />
														</li>
														<li className={exCat == 'Time Share' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="time_share">Time Share</label>
															<input type="radio" name="exCat" id="time_share" className="d-hide"
																onClick={() => setPropertyType('Time Share', step + 1, 'next')} />
														</li>
													</ul>
												}
												{
													subCat == 'Retail' &&
													<ul className="prop-type-ul prop-type-sub-ul">
														<li className={exCat == 'Commercial Shops' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="com_shops">Commercial Shops</label>
															<input type="radio" name="exCat" id="com_shops" className="d-hide"
																onClick={() => setPropertyType('Commercial Shops', step + 1, 'next')} />
														</li>
														<li className={exCat == 'Commercial Showrooms' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="com_shwrms">Commercial Showrooms</label>
															<input type="radio" name="exCat" id="com_shwrms" className="d-hide"
																onClick={() => setPropertyType('Commercial Showrooms', step + 1, 'next')} />
														</li>
														<li className={exCat == 'Space in Retail Mall' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="spc_rtl_mal">Space in Retail Mall</label>
															<input type="radio" name="exCat" id="spc_rtl_mal" className="d-hide"
																onClick={() => setPropertyType('Space in Retail Mall', step + 1, 'next')} />
														</li>
													</ul>
												}
												{
													type == 'Commercial' && subCat == 'Land' &&
													<ul className="prop-type-ul prop-type-sub-ul">
														<li className={exCat == 'Commercial / Institutional Land' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="com_int_lnd">Commercial / Institutional Land</label>
															<input type="radio" name="exCat" id="com_int_lnd" className="d-hide"
																onClick={() => setPropertyType('Commercial / Institutional Land', step + 1, 'next')} />
														</li>
														<li className={exCat == 'Agiculture / Farm Land' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="agr_frm_lnd">Agiculture / Institutional Land</label>
															<input type="radio" name="exCat" id="agr_frm_lnd" className="d-hide"
																onClick={() => setPropertyType('Agiculture / Farm Land', step + 1, 'next')} />
														</li>
														<li className={exCat == 'Industrial Land / Plots' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="ind_lnd_plt">Industrial Land / Plots</label>
															<input type="radio" name="exCat" id="ind_lnd_plt" className="d-hide"
																onClick={() => setPropertyType('Industrial Land / Plots', step + 1, 'next')} />
														</li>
													</ul>
												}
												{
													subCat == 'Industry' &&
													<ul className="prop-type-ul prop-type-sub-ul">
														<li className={exCat == 'Factory' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="factory">Factory</label>
															<input type="radio" name="exCat" id="factory" className="d-hide"
																onClick={() => setPropertyType('Factory', step + 1, 'next')} />
														</li>
														<li className={exCat == 'Manufacturing' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="manufacturing">Manufacturing</label>
															<input type="radio" name="exCat" id="manufacturing" className="d-hide"
																onClick={() => setPropertyType('Manufacturing', step + 1, 'next')} />
														</li>
													</ul>
												}
												{
													subCat == 'Storage' &&
													<ul className="prop-type-ul prop-type-sub-ul">
														<li className={exCat == 'Warehouse' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="warehouse">Warehouse</label>
															<input type="radio" name="exCat" id="warehouse" className="d-hide"
																onClick={() => setPropertyType('Warehouse', step + 1, 'next')} />
														</li>
														<li className={exCat == 'Coldstorage' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="coldstorage">Coldstorage</label>
															<input type="radio" name="exCat" id="coldstorage" className="d-hide"
																onClick={() => setPropertyType('Coldstorage', step + 1, 'next')} />
														</li>
													</ul>
												}
												{
													subCat == 'Hospitality' &&
													<ul className="prop-type-ul prop-type-sub-ul">
														<li className={exCat == 'Hotel' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="hotel">Hotel</label>
															<input type="radio" name="exCat" id="hotel" className="d-hide"
																onClick={() => setPropertyType('Hotel', step + 1, 'next')} />
														</li>
														<li className={exCat == 'Coldstorage' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="coldstorage">Coldstorage</label>
															<input type="radio" name="exCat" id="coldstorage" className="d-hide"
																onClick={() => setPropertyType('Coldstorage', step + 1, 'next')} />
														</li>
														<li className={exCat == 'Guest House' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="guest_house">Guest House</label>
															<input type="radio" name="exCat" id="guest_house" className="d-hide"
																onClick={() => setPropertyType('Guest House', step + 1, 'next')} />
														</li>
														<li className={exCat == 'Banquet Halls' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
															<label htmlFor="banquet_halls">Banquet Halls</label>
															<input type="radio" name="exCat" id="banquet_halls" className="d-hide"
																onClick={() => setPropertyType('Banquet Halls', step + 1, 'next')} />
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
										<div className="row mt-2 ml-2">
											<h6 className="mb-3 mt-2">Your Property Vintage</h6>
											<div className="col-12">
												<ul className="prop-type-ul">
													<li className={propAge == 'New property' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
														<label htmlFor="new_property" className="min-w-200">
															New Property
													</label>
														<input type="radio" name="propAge" id="new_property" className="d-hide" onClick={() => { setPropAge('New property'); setYr('') }} />
													</li>
													<li className={propAge == 'Under Construction' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
														<label htmlFor="under_construction" className="min-w-200">
															Under Construction
													</label>
														<input type="radio" name="propAge" id="under_construction" className="d-hide" onClick={() => { setPropAge('Under Construction'); setYr('') }} />
													</li>
													<li className={propAge == 'Time Tested Property' ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
														<label htmlFor="time_tested_property" className="min-w-200">
															Time Tested Property
													</label>
														<input type="radio" name="propAge" id="time_tested_property" className="d-hide" onClick={() => { setPropAge('Time Tested Property'); setYr('') }} />
													</li>
												</ul>
											</div>
										</div>
										{
											propAge &&
											<div className="row mt-2 ml-2">
												<h6 className="mb-3 mt-2">Possession Year</h6>
												<div className="col-12">
													<ul className="prop-type-ul">
														{
															propAge == 'Under Construction' &&
															[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(index => {
																return <li className={yr == (2021 + index) ? "mb-2 mr-2 activate" : "mb-2 mr-2"} key={index}>
																	<label htmlFor={(2021 + index)}>
																		{(2021 + index)}
																	</label>
																	<input type="radio" name="yr" id={(2021 + index)} className="d-hide" onClick={() => setPropertyYear((2021 + index), step + 1, 'next')} />
																</li>
															})
														}
														{
															propAge == 'New property' &&
															[2, 1, 0].map(index => {
																return <li className={yr == (2021 - index) ? "mb-2 mr-2 activate" : "mb-2 mr-2"}>
																	<label htmlFor={(2021 - index)}>
																		{(2021 - index)}
																	</label>
																	<input type="radio" name="yr" id={(2021 - index)} className="d-hide" onClick={() => setPropertyYear((2021 - index), step + 1, 'next')} />
																</li>
															})
														}
														{
															propAge == 'Time Tested Property' &&
															[3, 4, 5, 6, 7].map(index => {
																const val = (2021 - index)
																return <li className={yr == val ? "mb-2 mr-2 activate" : "mb-2 mr-2"} key={index}>
																	<label htmlFor={val} className="min-w-130">
																		{val < 2015 ? `Before ${val + 1}` : val}
																	</label>
																	<input type="radio" name="yr" id={val} className="d-hide" onClick={() => setPropertyYear(val, step + 1, 'next')} />
																</li>
															})
														}

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
												<h6>Property Location</h6>
												<img src="resources/svg/Group_map.png" className="w-100" />
											</div>
										</div>
										<div className="row mt-4">
											<div className="col-12 mb-2">
												<PlacesAutocomplete value={loc} onChange={setLoc} searchOptions={searchOptions}>
													{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
														<div className="places-div">
															<input {...getInputProps({ placeholder: "Address / Project Name", maxLength: "100" })} className="w-100 prop-type-input" />

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
												<PlacesAutocomplete value={locality.split(',')[0]} onChange={setLocality} searchOptions={searchOptions1}>
													{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
														<div className="places-div">
															<input {...getInputProps({ placeholder: "Locality", maxLength: "100" })} className="w-100 prop-type-input" />

															<div className="floating-suggestion">
																{loading ? <div>...loading</div> : null}
																{suggestions.map((suggestion) => {
																	const style = { backgroundColor: suggestion.active ? "#41b6e6" : "#fff" };
																	const splitedKeys = suggestion.description.split(',');
                                                                    const optionValue = ([splitedKeys[0], splitedKeys[1]]).join(', ');

                                                                    return <div {...getSuggestionItemProps(suggestion, { style })} key={optionValue}>{optionValue}</div>;
																})}
															</div>
														</div>
													)}
												</PlacesAutocomplete>

												{/* <PlacesAutocomplete value={loc} onChange={setLoc} searchOptions={searchOptions}>
													{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
														<div className="places-div">
															<input className="w-100 prop-type-input" placeholder="Locality" onChange={(e) => { setLocality(e.target.value) }} value={locality} />
														</div>
													)}
												</PlacesAutocomplete> */}
											</div>
											<div className="col-12 mb-2">
												{/* <input type="text" onChange={(e) => {setSt(e.target.value)}} value={st} placeholder="State" className="w-100 prop-type-input"/> */}
												<select id="state" onChange={(e) => { updateState(e.target.value) }} value={st} placeholder="State" className="w-100 prop-type-input">
													<option value="null">State</option>
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
													<option value="null">City</option>
													{
														cities && cities.map(city => {
															return <option value={city.name} key={city._id}>{city.name}</option>
														})
													}
												</select>
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
											<div className="col-8 d-none d-md-flex">
												<img src="resources/img/propshot.jpeg" className="sp-img-right" />
											</div>
											<div className="col-8 d-flex d-md-none">
												<img src="https://res.cloudinary.com/www-propshots-in/image/upload/v1604054786/Test/p4fbrivnxxuzkwn9p9fx.jpg" className="w-100 ht-198px" />
											</div>
										</div>
										<div className="row mt-4">
											<div className="col-12">
												<input type="number" value={ar} min="0" max="99999999" onChange={handleAreaChange} placeholder="Enter Your Property Area" className="w-100 prop-area-input pw-375" />
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
										<div className="row mt-4">
											<div className="col-12 mt-4">
												<textarea type="text" maxLength="100" rows="2"
													onChange={(e) => { setOtherAddress(e.target.value) }} value={otherAddress}
													placeholder="Highlight your property in 20 words, example: East facing,
											 vastu complaint, already rented, Good condition, single owner, etc.."
													className="w-100 prop-area-input pw-375">
												</textarea>
											</div>
										</div>
									</div>
								}
								{step == 6 &&
									<div className="step7">
										<div className="row mb-4 mt-3 no-gutters">
											<div className="col-4 discount-div">
												<div className="pt-4 align-self-stretch">
													<p className="text-center mb-0 dis-in-percent">
														Offer upfront discount on your property for quick results
												</p>
													{/* <h3 className="text-center m-0 no-percent pt-3 valueSpan2">{disPer || 0}%</h3> */}
												</div>
											</div>
											<div className="col-8">
												<img src="resources/img/property.png" className="sp-img-right" />
											</div>
										</div>
										{/* <div className="form-group">
										<input type="range" min="0" max="90" value={disPer || 0} onChange={(e) => {setDisPer(e.target.value); calculateActualPrice(mv, e.target.value)}} id="myRange" />
									</div> */}
										<div className="row">
											<div className="col-12">
												<input type="number" min="0" max="999999999" placeholder="Current market value of your property in INR" value={mv} onChange={handlePriceChange} onKeyDown={checkDisc} className="w-100 value-area-input value-inr" />
												<span className="inr-symbol" style={{ fontSize: '21px', lineHeight: 1 }}>&#x20B9;</span>
												{mv != '' && mv < 1000 && pFor == "RENT" &&
													<span style={{ color: "red" }}>* Market Value must be minimum One Thousand </span>
												}
												{mv != '' && mv < 100000 && pFor == "SALE" &&
													<span style={{ color: "red" }}>* Market Value must be minimum One Lakh </span>
												}
											</div>
										</div>
										{/* <div className="row">
										<div className="col-9 value-in-txt">
											Final Price in INR &nbsp;{convertToIndianFortmate(actualPrice)}
										</div>
									</div> */}
										<div className="row mt-4">
											<div className="col-12 mt-4">
												<input type="number" min="0" max="999999999"
													placeholder="Price post-discount you want to offer"
													value={disPer} onChange={(e) => { parseInt(e.target.value) < parseInt(mv) && setDisPer(e.target.value) }}
													className="w-100 value-area-input dis-value-inr" />
												<span className="inr-symbol" style={{ fontSize: '21px', lineHeight: 1 }}>&#x20B9;</span>
												{disPer != '' && disPer < 1000 && pFor == "RENT" &&
													<span style={{ color: "red" }}>* Discount must be minimum One Thousand </span>
												}
												{disPer != '' && disPer < 100000 && pFor == "SALE" &&
													<span style={{ color: "red" }}>* Discount must be minimum One Lakh </span>
												}
												{/* {parseInt(disPer) > parseInt(mv) &&
													<span style={{ color: "red" }}>* Discount must be lesser than Market Value</span>
												} */}

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
				<div className="">
					{step > 1 && <button id="resetFilters" style={{ outline: 'none' }} onClick={() => changeStep(step - 1, 'back')}>Back</button>}
				</div>
				<div className="">
					<button id="nextshortlist" onClick={() => changeStep(step + 1, 'next')}>Next</button>
				</div>
				{/* <div className="d-block d-md-none px-5">
					<button id="nextshortlist" className="m-pos-inherit my-3 w-100" onClick={() => changeStep(step + 1, 'next')}>Next</button>
				</div> */}
			</div>
			{ (step === 8 || step === 0) &&
				<div id="shortlist1">
					{/* <img id="shortlistcancel" src="resources/svg/cancel.svg"/> */}
					<div id="shortlistbody1" className="bg-transparents">
						<img id="shortlistcancel" src="resources/svg/cancel.svg" onClick={() => changeStep(7, 'back')} />
						<div className="container">
							<div className="row hight-fixing h-100">
								<div className="col-md-5 align-self-center">
									<div id="propdetail" className="newpropdetail w-100 m-0">
										<div className="shortlist-img-container last-screen-shortlist-img">
											<CarouselNewProp property={{ _id: Math.random(), photo }} />
										</div>
										<div className="fix-div-height fix-div-height-last">
											<div className='card-body-top'>
												<ul className="dash-card-ul ml-2">
													<li className="dash-card-ul-li">
														<ul className="offered-dis-ul offered-dis-ul-last mb-2">
															<li className="offered-dis-ul-li" style={{ width: '100%' }}>
																<p className="font-cblack font-size-10 text-left">
																	<b>&#x20B9;&nbsp;</b>
																	{mvWords}
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
																	{getConverted(disPer)}
																</p>
															</li>
														</ul>
														<p style={{ fontSize: '13px' }}>Discounted Offer</p>
													</li>
												</ul>
											</div>

											<div className="details">
												{pFor ?
													<>
														<img src="resources/svg/type_icon.png" className="prop-icon type_img_home" />
														<span className="detail-text font-weight-bold text-uppercase">
															{!subCat.includes(type) ? !exCat.includes(type) ? type : '' : ''}
															{` ${exCat}`} {pFor && ' For'} {pFor}</span>
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
													loc ?
														<>
															<img src="resources/svg/Path%2099-1.svg" className="prop-icon icone-prop-home" />
															<span className="detail-text">
																{loc}
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
													otherAddress ?
														<>
															<img src="resources/svg/Path%2099-1.svg" className="prop-icon icone-prop-home" />
															<span className="detail-text">
																{otherAddress ? <span>{otherAddress}</span> : <span></span>}
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
								<div className="col-md-7 align-self-center text-white">
									<div className="row justify-content-center">
										<div className="col-12 col-md-8">
											<div className="row mb-4 mt-4 no-gutters">
												{/* <div className="col-12 text-center py-5">
								<a href="#" className="back-to-edit" onClick={() => changeStep(7, 'back')}>Back to Edit</a>
							</div> */}
												<div className="col-12 text-center pb-4">
													<p className="your-sel-pro-txt m-0">Your Property is now ready to roll.</p>
												</div>
												<div className="col-12 text-center pb-4">
													<p className="pay-only-txt m-0">Pay only INR 599/-</p>
													<p className="pay-only-txt m-0">to sell your property quickly</p>
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
			{cropper(src, isCropping)}
			{spinner(loading)}
		</>
	);
}

export default NewProperty;