let controller;
let slidescene;
let pagescene;
let detailscene;
function animateSlides() {
  // create controller
  controller = new ScrollMagic.Controller();
  //   select elements
  const sliders = document.querySelectorAll(".slide");
  const nav = document.querySelectorAll(".nav-header");
  sliders.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector(".reveal-img");
    const img = slide.querySelector("img");
    const revealTxt = slide.querySelector(".reveal-text");
    //  aplly gsap animation on sleceted element

    // animation 1
    const slideAnim = gsap.timeline({
      defaults: { duration: 1, ease: "power2.inOut" },
    });
    slideAnim.fromTo(revealImg, { x: "0%"}, { x: "100%" });
    slideAnim.fromTo(img, { scale: "2" }, { scale: "1" }, "-=1");
    slideAnim.fromTo(revealTxt, { x: "0%" }, { x: "100%" }, "-=0.75");
    slideAnim.fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=0.5");
    // create a scene 1
    slidescene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false,
    })
      .setTween(slideAnim)
      // .addIndicators({
      //     colorStart:"white",
      //     colorTrigger:"white",
      //     name:"slides"
      // })
      .addTo(controller);
    // animation 2
    const OnPage = gsap.timeline();
    // ternery operator so that content stuck for a while:
    // ik nextSlide naam ka variable bnaya and ternery operator lgaya jo slides ki
    // length chk krega or nextslide par animation chalayega .iss nexSlide pr lagi animation
    // ke bich mai hum apni slide pr lagi animation(opacity or scale wali) rakhenge
    // and humara content thori der ke liye stuck hojega.basically aisa krne se ,jo start slide hogi
    // (indicator ke dwara show hogi) vo start slide actual slide se uper ajegi bcz of y tends from
    // 0 to 50%.issi vje se content stuck hojega for a while.
    // console.log(slides.length);
    // console.log(index);
    const nextSlide = slides.length === index ? "end" : slides[index + 1];
    // console.log(nextSlide)
    OnPage.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    OnPage.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    OnPage.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");
    // create a scene 2
    pagescene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(OnPage)
      // .addIndicators({
      //     colorStart:"white",
      //     colorTrigger:"white",
      //     name:"page",
      //     indent:200

      // })
      .addTo(controller);

    // note:
    // 1.setPin is a method in sscrollMagic library to pin the element on the screen.
    // this feature is often used to fix an element in place relative to viewport,
    // creating effect like sticky navigation bar.
    // this setpin method insert a new blank space and pushdown the below element.
    // 2. pushFollowers:false means element below the pinned element won't be pushed
    // down when the pinning occurs .they will stay in their original position.
  });
}
// selection of elements:
const mouse = document.querySelector(".cursor");
const mousetxt = document.querySelector(".cursor-text");
const burger = document.querySelector(".burger");

// 1. animation on cursor i.e. moveable circle on cursor
function cursor(e) {
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
}
//  2. animation on cursor when mouse hover on some element
function cursoractive(e) {
  const item = e.target;
  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }
  if (item.classList.contains("explore")) {
    mouse.classList.add("explore-active");
    mousetxt.innerText = "Tap";
    gsap.to(".title-swipe", 1, { y: "0%" });
  } else {
    mouse.classList.remove("explore-active");
    mousetxt.innerText = "";
    gsap.to(".title-swipe", 1, { y: "100%" });
  }
}
// 3. nav toggle after click on burger
function navToggle(e) {
  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    gsap.to(".line1", 0.5, { rotate: "45", y: 5, background: "black" });
    gsap.to(".line2", 0.5, { rotate: "-45", y: -5, background: "black" });
    gsap.to("#logo", 1, { color: "black" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100% -10%)" });
    document.body.classList.add("hideScroll");
  } else {
    e.target.classList.remove("active");
    gsap.to(".line1", 0.5, { rotate: "0", y: 0, background: "white" });
    gsap.to(".line2", 0.5, { rotate: "0", y: 0, background: "white" });
    gsap.to("#logo", 1, { color: "white" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%)" });
    document.body.classList.remove("hideScroll");
  }
}

// event listner
burger.addEventListener("click", navToggle);
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", cursoractive);

// javascript for fashion:

//  initialize the barba
//      note: In the initialization of barba there is object whose value is
//      list of objects.

const logo = document.querySelector("#logo");
barba.init({
    // views refers to the content of a page that need to be loaded and displayed before entering the page
    // and before leaving the page.
  views: [
    {
      namespace: "home",
      // hum chahte hai ki jo animation hmne (index.html) mai lgai hai
      // scrollmagic and gsap ko use krke vo animation (fashion.html)
      // wale page mai mat jaye,that's why we use beforeEnter and afterEnter
      // functions i.e. built in functions.
      beforeEnter() {
        animateSlides();
        logo.href = "./index.html";
      },
      beforeLeave() {
        slidescene.destroy();
        pagescene.destroy();
        controller.destroy();
      },
    },
    {
      namespace: "fashion",
      beforeEnter() {
        logo.href = "../index.html";
        detailAnimation();
       
      },
      beforeLeave() {
        controller.destroy();
        detailscene.destroy();
      },
    },
  ],
//   transitions controls how views are loaded and swapped on the page .It manages the animation or effect
// that occur during the transition between views.
  transitions: [
    {
      leave({ current, next }) {
        let done = this.async();
        // an animtion
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(
          current.container,
          1,
          { opacity: 1 },
          { opacity: 0, onComplete: done }
        );

        tl.fromTo(
          ".swipe",
          0.75,
          { x: "-100%" },
          { x: "0%", onComplete: done },
          "-=0.5"
        );
      },
      enter({ current, next }) {
        let done = this.async();
        // scroll to the top:
        window.scrollTo(0, 0);
        // an animation
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(
          ".swipe",
          1,
          { x: "0%" },

          { x: "100%", stagger: 0.2, onComplete: done }
        );
        tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
      },
    },
  ],
});
// animation on second page:
function detailAnimation() {
  controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll(".detail-slide");
  slides.forEach((slide, index, slides) => {
    const slidetl = gsap.timeline({defaults: { duration: 1,ease:"power2.inOut"}});
    let nextSlide = slides.length - 1 === index ? "end" : slides[index+1];
    let nextImg = nextSlide.querySelector("img");
    slidetl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
    slidetl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=1");
    slidetl.fromTo(nextImg, { x: "70%",opacity:0 }, { x: "0%",opacity:1 },"-=0.5");
    // create a scene
    detailscene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(slidetl)
    //   .addIndicators({
    //     colorStart: "white",
    //     colorTrigger: "white",
    //     name: "detail-slide",
    //     indent: 200,
    //   })
      .addTo(controller);
      
  });
}

