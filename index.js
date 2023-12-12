
const firebaseConfig = {
    apiKey: "AIzaSyA301xzQMZQ9OUs9_qAeJ9g6xySLTEWHtE",
      authDomain: "wedding2024-b0c73.firebaseapp.com",
      projectId: "wedding2024-b0c73",
      storageBucket: "wedding2024-b0c73.appspot.com",
      messagingSenderId: "339575333511",
      appId: "1:339575333511:web:81566c1e8d0ec643a3ce22",
      measurementId: "G-TRY5LXE6TW"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  var fileText = document.querySelector(".fileText");
  var label = document.querySelector("label");
  var uploadPercentage = document.querySelector(".uploadPercentage");
  var progress = document.querySelector(".progress");
  var percentVal;
  var fileItem;
  var fileName;
  var img = document.querySelector(".img");
  var galleryContainer = document.getElementById("galleryContainer");
  
  // Retrieve stored images from localStorage on page load
  window.onload = function () {
    displayStoredImages();
  };
  
  function displayStoredImages() {
    // Check if there are stored images in localStorage
    if (localStorage.getItem("uploadedImages")) {
      // Parse the JSON array of image URLs
      var storedImages = JSON.parse(localStorage.getItem("uploadedImages"));
  
      // Display each image in the gallery
      storedImages.forEach(function (imageUrl) {
        createImageElement(imageUrl);
      });
    }
  }
  
  function getFile(e) {
    fileItem = e.target.files[0];
    fileName = fileItem.name;
    fileText.innerHTML = fileName;
  
    // Hide the label
    label.style.display = "none";
  
    // Show the preview image
    showPreviewImage();
  }
  
  function showPreviewImage() {
    var reader = new FileReader();
  
    reader.onload = function (e) {
      // Set the source of the preview image
      img.src = e.target.result;
  
      // Show the preview image
      img.style.display = "block";
    };
  
    // Read the selected file as a data URL
    reader.readAsDataURL(fileItem);
  }
  
  function uploadImage() {
    let storageRef = firebase.storage().ref("images/" + fileName);
    let uploadTask = storageRef.put(fileItem);
  
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        percentVal = Math.floor(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        uploadPercentage.innerHTML = percentVal + "%";
        progress.style.width = percentVal + "%";
      },
      (error) => {
        console.log("Error is ", error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          console.log("URL", url);
  
          if (url !== "") {
            // Save the uploaded image URL to localStorage
            saveImageToLocalStorage(url);
  
            // Remove the previous preview
            img.style.display = "none";
            img.src = ""; // Reset the source
  
            // Unhide the label
            label.style.display = "block";
  
            // Create a new image element and display it in the gallery
            createImageElement(url);
  
            // Reset the input file value
            document.getElementById("fileInp").value = "";
            fileText.innerHTML = ""; // Clear the file text as well
          }
        });
      }
    );
  }
  
  function saveImageToLocalStorage(url) {
    // Retrieve stored images from localStorage
    var storedImages = localStorage.getItem("uploadedImages")
      ? JSON.parse(localStorage.getItem("uploadedImages"))
      : [];
  
    // Add the new image URL to the array
    storedImages.push(url);
  
    // Save the updated array back to localStorage
    localStorage.setItem("uploadedImages", JSON.stringify(storedImages));
  }
  
  function createImageElement(url) {
    // Create a new image element
    var newImage = document.createElement("img");
    newImage.setAttribute("src", url);
    newImage.setAttribute("alt", fileName);
  
    // Append the new image to the gallery container
    galleryContainer.appendChild(newImage);
  }

  