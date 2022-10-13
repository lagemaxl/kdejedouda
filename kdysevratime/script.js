// Set the date we're counting down to
var countDownDate = new Date("Oct 15, 2022 21:55:00").getTime();
var countDownDate2 = new Date("Jul 27, 2022 8:18:00").getTime();

// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();
    
  // Find the distance between now and the count down date
  var distance = countDownDate - now;
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  // Output the result in an element with id="demo"
  document.getElementById("prijezd").innerHTML = days + "d " + hours + "h "
  + minutes + "m " + seconds + "s ";
  // If the count down is over, write some text 
  document.getElementById("odjezd").style.display = "none";
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("prijezd").style.display = "none";
    document.getElementById("title").innerHTML = "Přílet do Prahy:"
    document.getElementById("odjezd").style.display = "block";
  }
}, 1000);

var y = setInterval(function() {

    // Get today's date and time
    var now = new Date().getTime();
      
    // Find the distance between now and the count down date
    var distance2 = countDownDate2 - now;
    // Time calculations for days, hours, minutes and seconds
    var days2 = Math.floor(distance2 / (1000 * 60 * 60 * 24));
    var hours2 = Math.floor((distance2 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes2 = Math.floor((distance2 % (1000 * 60 * 60)) / (1000 * 60));
    var seconds2 = Math.floor((distance2 % (1000 * 60)) / 1000);
    // Output the result in an element with id="demo"
    document.getElementById("odjezd").innerHTML = days2 + "d " + hours2 + "h "
    + minutes2 + "m " + seconds2 + "s ";
    // If the count down is over, write some text 
  
    if (distance < 0) {
      clearInterval(y);
      document.getElementById("odjezd").innerHTML = "už je tady!!!";
    }
  }, 1000);



  