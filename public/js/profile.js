
  // open window for adding new bike
  document.querySelector('#newBike').addEventListener('click', () => {

    document.getElementById("newBikeWindows").style.visibility = "visible";
  })

  //close windows for new bike
  document.querySelector('#close').addEventListener('click', () => {

  document.getElementById("newBikeWindows").style.visibility = "hidden";
})

// open window for changing run info
document.querySelector('#runBtn').addEventListener('click', () => {

  document.getElementById("changeRunInfoWIndow").style.visibility = "visible";

  document.getElementById("trainingShoe").value = document.getElementById("trainingShoeP").innerText
  document.getElementById("racingShoe").value = document.getElementById("racingShoeP").innerText
})


// close window for chaging run info
document.querySelector('#closeRun').addEventListener('click', () => {

  document.getElementById("changeRunInfoWIndow").style.visibility = "hidden";
})