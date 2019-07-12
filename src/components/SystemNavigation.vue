<template>
  <div class="navigation">
    <div class="logo">
      <a class="logo-link" href="javascript:void(0)">
        <router-link :to="dm">
          <img src="img/other/icon.png" alt="icon" />
        </router-link>
      </a>
    </div>
    <div class="navigation-list-wrapper">
      <ul class="navigation-list">
        <li
          class="nav-item active-opacity"
          data-toggle="tooltip"
          data-placement="right"
          title="Dashboard"
        >
          <a class="nav-link-nav active" :href="dashboard">
            <span class="nav-link-text">
              <svg id="dashboard_icon" viewBox="0 0 24 24">
                <path
                  fill=""
                  fill-rule="nonzero"
                  d="M14.105 12.702l3.664-4.188a.375.375 0 0 0-.017-.512l-.254-.254a.375.375 0 0 0-.512-.017l-4.188 3.664A2.254 2.254 0 0 0 9.75 13.5a2.25 2.25 0 1 0 4.355-.798zM12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm-.375-21.371v.743c0 .218.168.378.375.378a.38.38 0 0 0 .375-.378v-.743A.371.371 0 0 0 12 2.25a.38.38 0 0 0-.375.379zM3.746 11.25h-.743a.371.371 0 0 0-.378.375c0 .202.17.375.378.375h.743a.371.371 0 0 0 .379-.375.38.38 0 0 0-.379-.375zm17.25 0h-.743a.371.371 0 0 0-.378.375c0 .202.17.375.378.375h.743a.371.371 0 0 0 .379-.375.38.38 0 0 0-.379-.375zm-2.9-6.252l-.525.526a.37.37 0 0 0-.002.532.38.38 0 0 0 .532-.002l.526-.525a.372.372 0 0 0 .002-.533.382.382 0 0 0-.533.002zm-11.667.526l-.525-.526a.372.372 0 0 0-.533-.002.382.382 0 0 0 .002.533l.526.525a.37.37 0 0 0 .532.002.38.38 0 0 0-.002-.532zm8.703-2.317l-.284.686a.371.371 0 0 0 .201.493.38.38 0 0 0 .491-.206l.285-.686a.371.371 0 0 0-.202-.493.38.38 0 0 0-.49.206zM4.554 8.157l-.687-.284a.372.372 0 0 0-.493.201.383.383 0 0 0 .206.492l.687.284a.372.372 0 0 0 .493-.202.38.38 0 0 0-.206-.49zm15.65-.284l-.687.284a.37.37 0 0 0-.206.491.38.38 0 0 0 .493.202l.687-.284c.2-.084.285-.3.206-.492a.382.382 0 0 0-.493-.201zm-10.98-3.98l-.285-.686a.37.37 0 0 0-.491-.206.381.381 0 0 0-.202.493l.285.686a.37.37 0 0 0 .49.206.381.381 0 0 0 .202-.493z"
                ></path>
              </svg>
            </span>
            <!-- <span class="nav-link-text"></span> -->
          </a>
        </li>
        <li
          class="nav-item active-opacity"
          data-toggle="tooltip"
          data-placement="right"
          title="Food"
        >
          <a class="nav-link-nav" :href="menu">
            <span class="nav-link-text">
              <svg id="menu_menu_icon" viewBox="0 0 24 20">
                <g fill="" fill-rule="nonzero">
                  <path
                    d="M.878 15.951h22.244c.498 0 .878-.38.878-.878a.862.862 0 0 0-.878-.878h-.263c-.322-4.449-3.747-8.107-8.254-9.16.38-.498.615-1.142.615-1.815a3.073 3.073 0 1 0-6.147 0c0 .643.205 1.258.556 1.756-4.624.965-8.166 4.683-8.488 9.22H.878a.862.862 0 0 0-.878.877c0 .498.38.878.878.878zM12.146 1.902c.732 0 1.317.586 1.317 1.318 0 .731-.585 1.317-1.317 1.317A1.312 1.312 0 0 1 10.83 3.22c0-.732.586-1.318 1.317-1.318zM23.122 18H.878a.862.862 0 0 0-.878.878c0 .498.38.878.878.878h22.244c.498 0 .878-.38.878-.878a.862.862 0 0 0-.878-.878z"
                  ></path>
                </g>
              </svg>
            </span>
            <!-- <span class="nav-link-text"></span> -->
          </a>
        </li>
        <li
          class="nav-item active-opacity"
          data-toggle="tooltip"
          data-placement="right"
          title="Location"
        >
          <a class="nav-link-nav" :href="store">
            <span class="nav-link-text">
              <svg id="menu_locations_icon" viewBox="0 0 16 24">
                <path
                  fill=""
                  fill-rule="evenodd"
                  d="M8 0a7.985 7.985 0 0 0-5.143 1.87A8.005 8.005 0 0 0 1.071 12l5.846 8.376a1.253 1.253 0 0 0 2.166 0l5.846-8.376A8.005 8.005 0 0 0 13.143 1.87 7.985 7.985 0 0 0 8 0zM4.5 6.5a.499.499 0 1 0 0 1h7a.499.499 0 1 0 0-1h-7zm0 2a.499.499 0 1 0 0 1h7a.499.499 0 1 0 0-1h-7zm-.75 9.803a.5.5 0 0 0-.208.046c-.903.421-1.6.984-1.896 1.664-.3.692-.13 1.505.43 2.124C3.196 23.374 5.477 24 8 24c2.523 0 4.803-.626 5.923-1.863.56-.62.731-1.432.43-2.124-.293-.676-.997-1.242-1.891-1.662a.5.5 0 0 0-.419.906c.79.362 1.239.8 1.393 1.154.153.354.116.646-.254 1.055C12.442 22.284 10.339 23 8 23c-2.339 0-4.441-.716-5.182-1.534-.37-.41-.408-.701-.255-1.055.154-.353.605-.791 1.395-1.153a.501.501 0 0 0-.208-.955z"
                ></path>
              </svg>
            </span>
            <!-- <span class="nav-link-text">Lasagna</span> -->
          </a>
        </li>
      </ul>
    </div>
    <div class="slider-btn">
      <i aria-hidden="true" class="fa fa-chevron-down"></i>
    </div>
    <div class="navigation-avatar">
      <a class="nav-link">
        <img src="img/pos/profile-pic.png" alt="profile" />
        <div class="nav-link-user-name">Admin</div>
      </a>
    </div>
    <!--top Menu-->
  </div>
</template>

<script>
export default {
  name: 'SystemNavigation',
  methods: {
    baseurl(link) {
      return (
        window.location.href.replace(
          new RegExp('/delivery-manager/.*'),
          '/' + link
        ) + this.$store.getters['context/brand']
      )
    },
  },
  data() {
    return {
      dm: '/delivery-manager' + this.$store.getters['context/store'],
      dashboard: this.baseurl('dashboard'),
      menu: this.baseurl('menu'),
      store: this.baseurl('locations'),
    }
  },
}
</script>

<style scoped></style>
