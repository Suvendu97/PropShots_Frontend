import React from "react";

function CarouselNewProp(props) {
  let slideIndex = 1;
  
  function plusDivs(n) {
    showDivs(slideIndex += n);
  }

  function showDivs(n) {
    var i;
    var x = document.getElementsByClassName(`mySlides_${props.property._id}`);
    if (n > x.length) {slideIndex = 1}
    if (n < 1) {slideIndex = x.length}
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";  
    }
    if(x[slideIndex-1] && x[slideIndex-1].style) {
      x[slideIndex-1].style.display = "block";  
    }
  }


  return (
        <div className="w3-content w3-display-container">
            {
                props.property.photo.map((img ,i)=> {
                    if(i == props.property.photo.length - 1) {
                      setTimeout(function(){showDivs(slideIndex)}, 100)
                    }
                    return (<img className={`card-img mySlides_${props.property._id}`} src={img.base64 || img} style={{width : '100%'}} key={`img_${i}`}/>)
                })
            }
              {/* {
              props.propFor ?
                <img src={`resources/img/${props.propFor}.png`} key={props.propFor} className="img-display-board"/>
                :
                <img src={`resources/img/Group%20198.png`} key={props.propFor} className="img-display-board"/>
              } */}
            {props.property.photo.length > 1 &&
              <>
              <button className="w3-button w3-black w3-display-left" onClick={() => plusDivs(-1)}>&#10094;</button>
              <button className="w3-button w3-black w3-display-right" onClick={() => plusDivs(1)}>&#10095;</button>
              </>
            }
            {/* <div className="div-discount">
              <div className="row no-gutters py-1">
                <div className="col-7 p-0 text-center align-self-center">
                  <p className="m-0 div-discount-off">{props.disPer != '' && 'OFFERED'}</p>
                  <p className="m-0 div-discount-dis">{props.disPer != '' && 'Discount'}</p>
                </div>
                <div className="col-5 p-0 align-self-center text-center">
                  <p className="m-0 div-discount-per">{props.disPer != '' && `${props.disPer}%`}</p>
                </div>
              </div>
            </div>
            <div className="div-discount div-rs-crore">
              <div className="row no-gutters py-1">
                <div className="col-7 p-0 text-center align-self-center">
                  <p className="m-0 div-discount-dis">{props.mv && '₹ corers'}</p>
                </div>
                <div className="col-5 p-0 align-self-center text-center">
                  <p className="m-0 div-discount-per">{props.mv}</p>
                </div>
              </div>
            </div> */}
        </div>
    );
        

}
export default CarouselNewProp;
