const GUIDELINES = {
  vegFruit: { child1to4: { min: 4, max: 5 }, child5plus: { min: 5, max: 7 } },
  grains: { child1to4: { min: 3, max: 4 }, child5plus: { min: 3, max: 5 } },
  meat: { child1to4: { min: 2, max: 2 }, child5plus: { min: 2, max: 3 } },
  dairy: { child1to4: { min: 3, max: 4 }, child5plus: { min: 3, max: 5 } },
  fats: { child1to4: { min: 2, max: 3 }, child5plus: { min: 2, max: 3 } },
  processed: { child1to4: { min: 0, max: 1 }, child5plus: { min: 0, max: 1 } },
};

const d = document.querySelector('input[type="date"]');
if (!d.value) d.valueAsDate = new Date(); //if statement to not overwrite the user's inputed date

let currentProfile = "child5plus";

//wait for the html and DOM to load
document.addEventListener("DOMContentLoaded", function () {
  var STEP = 8; //pixels of extra height per item (tweak)
  var shelves = document.querySelectorAll(".shelf");

  shelves.forEach(function (shelf) {
    var badge = shelf.querySelector(".badge");
    var incBtn = shelf.querySelector(".inc");
    var decBtn = shelf.querySelector(".dec");
    var controls = shelf.querySelector(".controls");
    var callout = shelf.querySelector(".callout");

    //reads the shelf's base height (the height at count = 0) from CSS (the computed border-bottom in pixels) so JS has a number to add to
    function readBaseHeight() {
      //temporarily clear inline style (because of @media, and each shelf having its own base not 5vw - fixed value)
      var prev = shelf.style.borderBottomWidth;
      shelf.style.borderBottomWidth = "";
      var base = parseFloat(getComputedStyle(shelf).borderBottomWidth);
      shelf.style.borderBottomWidth = prev;
      return base;
    }
    var baseHeight = readBaseHeight();

    //sets the shelf's height and centers the badge/controls (and callout) using that height
    function layoutFor(heightPx) {
      shelf.style.borderBottomWidth = heightPx + "px";

      var mid = heightPx * 0.5;
      badge.style.top = mid + "px";
      if (controls) controls.style.top = mid + "px";
      if (callout) controls.style.top = mid - controls.offsetHeight / 2 + "px";
    }

    function profileSwitch(profile) {
      document.querySelectorAll(".shelf").forEach(colorBadge);
    }

    function zoneCalc(count, range) {
      if (count > range.max) return "above";
      if (count < range.min) return "below";
      return "within";
    }

    function colorBadge(shelfEl) {
      const shelfId = shelfEl.dataset.shelf;
      const rangeSet = GUIDELINES[shelfId];

      const range = rangeSet[currentProfile];
      const zone = zoneCalc(count, range);

      badge.classList.remove("badge--below", "badge--within", "badge--above");
      badge.classList.add(`badge--${zone}`);
    }

    var count = parseInt(badge.textContent, 10) || 0;

    //updates the badge to the current count and resizes/repositions the shelf to match it
    function render() {
      badge.textContent = count;
      var newHeight = baseHeight + count * STEP;
      layoutFor(newHeight);
      colorBadge(shelf);
    }

    incBtn.addEventListener("click", function () {
      count += 1;
      render();
    });

    decBtn.addEventListener("click", function () {
      if (count > 0) count -= 1;
      render();
    });

    //for responsiveness
    window.addEventListener("resize", function () {
      baseHeight = readBaseHeight();
      render();
    });

    render();

    //-------------------------------------------- AGE STUFF ----------------------------------------------------------
    document.querySelectorAll('input[name="profile"]').forEach((radio) => {
      radio.addEventListener("change", (e) => {
        //better to use change than click to include keyboard changes
        currentProfile = e.target.value;
        profileSwitch(currentProfile);
      });
    });
  });
});
