import React from "react";

function Carousel(props) {
  let slideIndex = 1;

  function plusDivs(n) {
    showDivs(slideIndex += n);
  }

  function showDivs(n) {
    var i;
    var x = document.getElementsByClassName(`mySlides_${props.property.pId}`);
    if (n > x.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = x.length }
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    if (x[slideIndex - 1] && x[slideIndex - 1].style) {
      x[slideIndex - 1].style.display = "block";
    }
  }


  return (
    <div className="w3-content w3-display-container">
      {
        props.property.img.map((img, i) => {
          if (i == props.property.img.length - 1) {
            setTimeout(function () { showDivs(slideIndex) }, 100)
          }
          return (<img className={`card-img mySlides_${props.property.pId}`} src={img} style={{ width: '100%' }} key={`img_${i}`} />)
        })
      }
      {props.property.img.length > 1 &&
        <>
          <button className="w3-button w3-black w3-display-left" onClick={() => plusDivs(-1)}>&#10094;</button>
          <button className="w3-button w3-black w3-display-right" onClick={() => plusDivs(1)}>&#10095;</button>
        </>
      }
    </div>
  );


}
export default Carousel;
