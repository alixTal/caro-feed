import videos from "./videos.json";

const sliderContainer = document.querySelector(".slider-container");
const allSlides = document.querySelectorAll(".slider-item");
let sliderContainerMoveAmount = 0;
let counter = 0;
let touchStartY = null;
let slideDirection = null;
let sliderMoveStart = null;
let nativeHls = false;
let prevVideo = null;
let activeVideo = null;
let nextVideo = null;

function startActiveVideo() {}
function removeinActiveVideos() {}
function enableVideo(itemElm) {}

function addVideo(videoSrc) {
  const video = document.createElement("video");
  video.controls = true;
  if (Hls.isSupported()) {
    var hls = new Hls();
    hls.loadSource(videoSrc);
    hls.attachMedia(video);
    return { videoElm: video, hls: hls };
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = videoSrc;
    return { videoElm: video, hls: null };
  }
}
function destroyVideo(itemElm) {}

function crateSliderItem(videoItem, index) {
  const sliderItem = document.createElement("div");
  const videoWrapper = document.createElement("div");
  videoWrapper.className = "video-wrapper";
  videoWrapper.style.setProperty("display", "none");
  sliderItem.appendChild(videoWrapper);
  const videoUrl =
    "https://lady-tests-amazon-quoted.trycloudflare.com/master/" +
    videoItem.encoded_id;

  if (index === 0 && allSlides.length === 0) {
    sliderItem.className = "slider-item slide-active";
    // const videoItem = addVideo(videoUrl);
    // videoWrapper.appendChild(videoItem.videoElm);
    // videoWrapper.removeAttribute("style");
    // activeVideo = videoItem.hls;
  } else if (index === 1 && allSlides.length === 0) {
    sliderItem.className = "slider-item slide-next";
    // const videoItem = addVideo(videoUrl);
    // videoWrapper.appendChild(videoItem.videoElm);
    // nextVideo = videoItem.hls;
  } else {
    sliderItem.className = "slider-item";
  }

  sliderItem.style.height = window.innerHeight + "px";
  const thumbnail = document.createElement("div");
  thumbnail.className = "thumbnail";
  thumbnail.innerHTML = `<img src=${videoItem.poster}>`;
  console.log(videoUrl);
  sliderItem.appendChild(thumbnail);
  return sliderItem;
}

videos.forEach((video, index) => {
  sliderContainer.appendChild(crateSliderItem(video, index));
});

function touchMove(evt) {
  let windowHeight = window.innerHeight;
  const stepSize = windowHeight / 100;
  const touchEndY = evt.changedTouches[0].screenY;
  if (touchStartY <= touchEndY) {
    if (touchEndY - touchStartY >= stepSize) {
      counter += 10;
      touchStartY = touchEndY;
      slideDirection = "up";
      const sliderMovement = sliderContainerMoveAmount + counter;
      sliderContainer.style.transform = `translate3d(0px, ${sliderMovement}px, 0px)`;
    }
  } else {
    if (touchStartY - touchEndY >= stepSize) {
      counter -= 10;
      touchStartY = touchEndY;
      slideDirection = "down";
      const sliderMovement = sliderContainerMoveAmount + counter;
      sliderContainer.style.transform = `translate3d(0px, ${sliderMovement}px, 0px)`;
    }
  }
}

function slideUp(activeSlide) {
  const prevSlide = document.querySelector(".slide-prev");
  const nextSlide = document.querySelector(".slide-next");
  sliderContainerMoveAmount += window.innerHeight;
  sliderContainer.style.transform = `translate3d(0px, ${sliderContainerMoveAmount}px, 0px)`;
  activeSlide.classList.remove("slide-active");
  activeSlide.previousSibling.classList.add("slide-active");
  const newActiveSlide = document.querySelector(".slider-item.slide-active");

  if (newActiveSlide.previousSibling) {
    if (prevSlide) {
      prevSlide.classList.remove("slide-prev");
    }
    newActiveSlide.previousSibling.classList.add("slide-prev");
  } else {
    if (newActiveSlide.classList.contains("slide-prev")) {
      newActiveSlide.classList.remove("slide-prev");
    }
  }

  if (newActiveSlide.nextSibling) {
    if (nextSlide) {
      nextSlide.classList.remove("slide-next");
    }
    newActiveSlide.nextSibling.classList.add("slide-next");
  }
}

function slideDown(activeSlide) {
  let prevSlide = document.querySelector(".slide-prev");
  let nextSlide = document.querySelector(".slide-next");
  sliderContainerMoveAmount -= window.innerHeight;
  sliderContainer.style.transform = `translate3d(0px, ${sliderContainerMoveAmount}px, 0px)`;
  activeSlide.classList.remove("slide-active");
  activeSlide.nextSibling.classList.add("slide-active");
  const newActiveSlide = document.querySelector(".slider-item.slide-active");
  if (newActiveSlide.previousSibling) {
    if (prevSlide) {
      prevSlide.classList.remove("slide-prev");
    }
    newActiveSlide.previousSibling.classList.add("slide-prev");
  }

  if (newActiveSlide.nextSibling) {
    if (nextSlide) {
      nextSlide.classList.remove("slide-next");
    }
    newActiveSlide.nextSibling.classList.add("slide-next");
  } else {
    if (newActiveSlide.classList.contains("slide-next")) {
      newActiveSlide.classList.remove("slide-next");
    }
  }
}

function changeSlide() {
  const slideTravel = Math.abs(counter);
  counter = 0;
  sliderContainer.style.transitionDuration = "400ms";
  const activeSlide = document.querySelector(".slider-item.slide-active");
  const slideMoveDuration = Date.now() - sliderMoveStart;
  const maxSlideMove = window.innerHeight * 0.4;

  if (slideDirection === "up" && activeSlide.previousSibling) {
    if (slideMoveDuration < 300) {
      slideUp(activeSlide);
    } else {
      if (slideTravel >= maxSlideMove) {
        slideUp(activeSlide);
      } else {
        sliderContainer.style.transform = `translate3d(0px, ${sliderContainerMoveAmount}px, 0px)`;
      }
    }
  } else if (slideDirection === "down" && activeSlide.nextSibling) {
    if (slideMoveDuration < 300) {
      slideDown(activeSlide);
    } else {
      if (slideTravel >= maxSlideMove) {
        slideDown(activeSlide);
      } else {
        sliderContainer.style.transform = `translate3d(0px, ${sliderContainerMoveAmount}px, 0px)`;
      }
    }
  } else {
    sliderContainer.style.transform = `translate3d(0px, ${sliderContainerMoveAmount}px, 0px)`;
  }
}

window.addEventListener("touchstart", (evt) => {
  sliderMoveStart = Date.now();
  touchStartY = evt.changedTouches[0].screenY;
  sliderContainer.style.transitionDuration = "50ms";
  window.addEventListener("touchmove", touchMove);
});

window.addEventListener("scroll", (evt) => {
  evt.preventDefault();
});

window.addEventListener("touchend", (evt) => {
  window.removeEventListener("touchmove", touchMove);
  changeSlide();
});
