<template>
  <div
    class="collapse navbar-collapse delivery-manager-st"
    id="navbarResponsive"
  >
    <ul class="navbar-nav navbar-sidenav" id="exampleAccordion">
      <li class="nav-item logo-wrap">
        <a class="nav-link" href="javascript:void(0)">
          <img src="images/icon.png" alt="icon" />
        </a>
      </li>

      <li class="nav-item active-opacity">
        <a class="nav-link" href="javascript:void(0)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="#FFF"
              fill-rule="nonzero"
              d="M14.105 12.702l3.664-4.188a.375.375 0 0 0-.017-.512l-.254-.254a.375.375 0 0 0-.512-.017l-4.188 3.664A2.254 2.254 0 0 0 9.75 13.5a2.25 2.25 0 1 0 4.355-.798zM12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm-.375-21.371v.743c0 .218.168.378.375.378a.38.38 0 0 0 .375-.378v-.743A.371.371 0 0 0 12 2.25a.38.38 0 0 0-.375.379zM3.746 11.25h-.743a.371.371 0 0 0-.378.375c0 .202.17.375.378.375h.743a.371.371 0 0 0 .379-.375.38.38 0 0 0-.379-.375zm17.25 0h-.743a.371.371 0 0 0-.378.375c0 .202.17.375.378.375h.743a.371.371 0 0 0 .379-.375.38.38 0 0 0-.379-.375zm-2.9-6.252l-.525.526a.37.37 0 0 0-.002.532.38.38 0 0 0 .532-.002l.526-.525a.372.372 0 0 0 .002-.533.382.382 0 0 0-.533.002zm-11.667.526l-.525-.526a.372.372 0 0 0-.533-.002.382.382 0 0 0 .002.533l.526.525a.37.37 0 0 0 .532.002.38.38 0 0 0-.002-.532zm8.703-2.317l-.284.686a.371.371 0 0 0 .201.493.38.38 0 0 0 .491-.206l.285-.686a.371.371 0 0 0-.202-.493.38.38 0 0 0-.49.206zM4.554 8.157l-.687-.284a.372.372 0 0 0-.493.201.383.383 0 0 0 .206.492l.687.284a.372.372 0 0 0 .493-.202.38.38 0 0 0-.206-.49zm15.65-.284l-.687.284a.37.37 0 0 0-.206.491.38.38 0 0 0 .493.202l.687-.284c.2-.084.285-.3.206-.492a.382.382 0 0 0-.493-.201zm-10.98-3.98l-.285-.686a.37.37 0 0 0-.491-.206.381.381 0 0 0-.202.493l.285.686a.37.37 0 0 0 .49.206.381.381 0 0 0 .202-.493z"
              opacity=".5"
            ></path>
          </svg>
          <!-- <span class="nav-link-text"></span> -->
        </a>
      </li>
    </ul>

    <ul class="navbar-nav sidenav-toggler">
      <li class="nav-item arrow-bottom">
        <a class="nav-link" href="javascript:void(0)">
          <img class="bt-arrow" src="img/pos/down-arrow.png" alt="arrows" />
          <img class="top-arrow" src="img/pos/top-arrow.png" alt="arrows" />
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link text-center" id="sidenavToggler">
          <img src="img/pos/profile-pic.png" alt="profile" />
        </a>
      </li>
    </ul>

    <!--top Menu-->
    <div class="navbar-nav-sidebar header-dinein">
      <div class="add-screen-walkin">
        <p class="walk-in">{{ _t("Walk-In") }}</p>
        <p class="walk-in-place">ADNOC Al Dar - Sharjah</p>
      </div>
      <div class="change-dine-in-location">
        <button id="change-location-dinein" class="popup-btn-save">
          <span
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
            >
              <g fill="#FFF" fill-rule="nonzero">
                <path
                  d="M11.326 5.3A2.526 2.526 0 1 0 8.8 7.84a2.536 2.536 0 0 0 2.526-2.54zM8.8 7.04a1.74 1.74 0 1 1-.028-3.48A1.74 1.74 0 0 1 8.8 7.04z"
                ></path>
                <path
                  d="M17.508 16.176l-1.576-5.05a1.4 1.4 0 0 0-1.332-.982h-2.626l1.042-1.4c.8-1.044 1.2-2.34 1.128-3.652C13.952 2.242 11.618 0 8.832 0 6.046 0 3.712 2.242 3.52 5.098A5.518 5.518 0 0 0 4.648 8.75l1.042 1.4H3.148a1.4 1.4 0 0 0-1.326.948L.104 16.142A1.4 1.4 0 0 0 1.428 18h14.744a1.4 1.4 0 0 0 1.336-1.818v-.006zM4.318 5.152C4.462 3.016 6.188.8 8.832.8s4.368 2.216 4.512 4.352a4.718 4.718 0 0 1-.97 3.12l-3.542 4.742-3.544-4.742a4.718 4.718 0 0 1-.97-3.12zm-1.74 6.2a.6.6 0 0 1 .568-.4h3.14l2.226 2.97a.4.4 0 0 0 .64 0l2.224-2.978H14.6a.6.6 0 0 1 .572.422l.4 1.266h-3.75v.8h4l.436 1.4H8.882a.4.4 0 0 0-.4.4V17.2H6.2l.2-3.348a.4.4 0 0 0-.4-.422H1.872l.706-2.078zm-1.64 5.6A.6.6 0 0 1 .86 16.4l.74-2.17h3.968L5.4 17.2H1.428a.6.6 0 0 1-.488-.256l-.002.008zm15.714 0a.6.6 0 0 1-.48.248h-6.89v-1.57H16.5l.244.784a.6.6 0 0 1-.088.536l-.004.002z"
                ></path>
              </g></svg
          ></span>
          Change Location
        </button>
      </div>
      <div class="all-tables-wrap">
        <button
          type=""
          id="all-tables"
          data-related="all-tables-show"
          class="tables-btn-style active"
        >
          All Tables
        </button>
        <button
          type=""
          id="resrvation-orders"
          data-related="reservation-orders-show"
          class="tables-btn-style"
        >
          Reservation
        </button>
        <button
          type=""
          id="running-orders"
          data-related="running-orders-show"
          class="tables-btn-style"
        >
          Running Orders
        </button>
        <button
          type=""
          id="completed-orders"
          data-related="completed-orders-show"
          class="tables-btn-style"
        >
          Completed Orders
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Topbar",
  props: {},
  computed: {}
};
</script>
