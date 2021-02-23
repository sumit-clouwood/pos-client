<template>
  <div class="navigation toggle-navigation navigatorHeight">
    <div class="logo" @click="collapseExpend">
      <a class="logo-link" role="button">
        <img src="img/other/icon.png" alt="icon" />
      </a>
    </div>
    <div class="navigation-list-wrapper">
      <ul v-if="!cashier_walkin" class="navigation-list">
        <li
          class="nav-item active-opacity"
          data-toggle="tooltip"
          data-placement="right"
          title="Dashboard"
          v-if="permitted('dashboard', 'root')"
        >
          <a class="nav-link-nav" :href="dashboard" target="_self">
            <div class="nav-link-text">
              <svg id="dashboard_icon" viewBox="0 0 24 24">
                <path
                  fill=""
                  fill-rule="nonzero"
                  d="M14.105 12.702l3.664-4.188a.375.375 0 0 0-.017-.512l-.254-.254a.375.375 0 0 0-.512-.017l-4.188 3.664A2.254 2.254 0 0 0 9.75 13.5a2.25 2.25 0 1 0 4.355-.798zM12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm-.375-21.371v.743c0 .218.168.378.375.378a.38.38 0 0 0 .375-.378v-.743A.371.371 0 0 0 12 2.25a.38.38 0 0 0-.375.379zM3.746 11.25h-.743a.371.371 0 0 0-.378.375c0 .202.17.375.378.375h.743a.371.371 0 0 0 .379-.375.38.38 0 0 0-.379-.375zm17.25 0h-.743a.371.371 0 0 0-.378.375c0 .202.17.375.378.375h.743a.371.371 0 0 0 .379-.375.38.38 0 0 0-.379-.375zm-2.9-6.252l-.525.526a.37.37 0 0 0-.002.532.38.38 0 0 0 .532-.002l.526-.525a.372.372 0 0 0 .002-.533.382.382 0 0 0-.533.002zm-11.667.526l-.525-.526a.372.372 0 0 0-.533-.002.382.382 0 0 0 .002.533l.526.525a.37.37 0 0 0 .532.002.38.38 0 0 0-.002-.532zm8.703-2.317l-.284.686a.371.371 0 0 0 .201.493.38.38 0 0 0 .491-.206l.285-.686a.371.371 0 0 0-.202-.493.38.38 0 0 0-.49.206zM4.554 8.157l-.687-.284a.372.372 0 0 0-.493.201.383.383 0 0 0 .206.492l.687.284a.372.372 0 0 0 .493-.202.38.38 0 0 0-.206-.49zm15.65-.284l-.687.284a.37.37 0 0 0-.206.491.38.38 0 0 0 .493.202l.687-.284c.2-.084.285-.3.206-.492a.382.382 0 0 0-.493-.201zm-10.98-3.98l-.285-.686a.37.37 0 0 0-.491-.206.381.381 0 0 0-.202.493l.285.686a.37.37 0 0 0 .49.206.381.381 0 0 0 .202-.493z"
                ></path>
              </svg>
            </div>
            <span class="nav-link-name">{{ _t('Dashboard') }}</span>
            <!-- <span class="nav-link-text"></span> -->
          </a>
        </li>
        <li
          class="nav-item active-opacity"
          data-toggle="tooltip"
          data-placement="right"
          :title="_t('Menu Setup')"
          v-if="permitted('menu', 'root')"
        >
          <a class="nav-link-nav" :href="menu" target="_self">
            <div class="nav-link-text">
              <svg id="menu_menu_icon" viewBox="0 0 24 20">
                <g fill="" fill-rule="nonzero">
                  <path
                    d="M.878 15.951h22.244c.498 0 .878-.38.878-.878a.862.862 0 0 0-.878-.878h-.263c-.322-4.449-3.747-8.107-8.254-9.16.38-.498.615-1.142.615-1.815a3.073 3.073 0 1 0-6.147 0c0 .643.205 1.258.556 1.756-4.624.965-8.166 4.683-8.488 9.22H.878a.862.862 0 0 0-.878.877c0 .498.38.878.878.878zM12.146 1.902c.732 0 1.317.586 1.317 1.318 0 .731-.585 1.317-1.317 1.317A1.312 1.312 0 0 1 10.83 3.22c0-.732.586-1.318 1.317-1.318zM23.122 18H.878a.862.862 0 0 0-.878.878c0 .498.38.878.878.878h22.244c.498 0 .878-.38.878-.878a.862.862 0 0 0-.878-.878z"
                  ></path>
                </g>
              </svg>
            </div>
            <span class="nav-link-name">{{ _t('Menu Setup') }}</span>
            <!-- <span class="nav-link-text"></span> -->
          </a>
        </li>
        <li
          class="nav-item active-opacity"
          data-toggle="tooltip"
          data-placement="right"
          :title="_t('Store Setup')"
          v-if="permitted('store', 'root')"
        >
          <a class="nav-link-nav" :href="store" target="_self">
            <div class="nav-link-text">
              <svg id="menu_locations_icon" viewBox="0 0 16 24">
                <path
                  fill=""
                  fill-rule="evenodd"
                  d="M8 0a7.985 7.985 0 0 0-5.143 1.87A8.005 8.005 0 0 0 1.071 12l5.846 8.376a1.253 1.253 0 0 0 2.166 0l5.846-8.376A8.005 8.005 0 0 0 13.143 1.87 7.985 7.985 0 0 0 8 0zM4.5 6.5a.499.499 0 1 0 0 1h7a.499.499 0 1 0 0-1h-7zm0 2a.499.499 0 1 0 0 1h7a.499.499 0 1 0 0-1h-7zm-.75 9.803a.5.5 0 0 0-.208.046c-.903.421-1.6.984-1.896 1.664-.3.692-.13 1.505.43 2.124C3.196 23.374 5.477 24 8 24c2.523 0 4.803-.626 5.923-1.863.56-.62.731-1.432.43-2.124-.293-.676-.997-1.242-1.891-1.662a.5.5 0 0 0-.419.906c.79.362 1.239.8 1.393 1.154.153.354.116.646-.254 1.055C12.442 22.284 10.339 23 8 23c-2.339 0-4.441-.716-5.182-1.534-.37-.41-.408-.701-.255-1.055.154-.353.605-.791 1.395-1.153a.501.501 0 0 0-.208-.955z"
                ></path>
              </svg>
            </div>
            <span class="nav-link-name">{{ _t('Store Setup') }}</span>
            <!-- <span class="nav-link-text">Lasagna</span> -->
          </a>
        </li>
        <li
          class="nav-item active-opacity"
          data-toggle="tooltip"
          data-placement="right"
          :title="_t('CRM')"
          v-if="permitted('crm', 'root')"
        >
          <a class="nav-link-nav" :href="crm" target="_self">
            <div class="nav-link-text">
              <svg id="crm_icon" viewBox="0 0 22 24">
                <path
                  fill=""
                  fill-rule="nonzero"
                  d="M10.839.28C9.989.28 9.29.978 9.29 1.83c0 .85.698 1.548 1.549 1.548.85 0 1.548-.698 1.548-1.548 0-.85-.698-1.549-1.548-1.549zM8.634 2.654l-.671.388.387.67.671-.386-.387-.672zm4.41 0l-.388.672.672.387.387-.671-.672-.388zm-5.751.775l-.67.387.387.671.67-.387-.387-.671zm7.092 0l-.388.671.67.387.387-.671-.67-.387zm-8.433.774l-.67.387.387.671.67-.387-.387-.671zm9.774 0l-.387.671.67.387.387-.671-.67-.387zM4.61 4.977l-.67.387.388.671.67-.387-.388-.671zm12.457 0l-.387.671.67.387.387-.67-.67-.388zm-15.051.34c-.497.036-.968.31-1.234.77-.426.736-.17 1.69.567 2.115.736.426 1.688.17 2.114-.567a1.554 1.554 0 0 0-.566-2.115 1.539 1.539 0 0 0-.881-.203zm17.646 0a1.539 1.539 0 0 0-.882.203 1.554 1.554 0 0 0-.565 2.115 1.553 1.553 0 0 0 2.114.567 1.555 1.555 0 0 0 .567-2.115 1.552 1.552 0 0 0-1.234-.77zm-8.823.752a2.904 2.904 0 0 0-2.9 2.9v.967c0 .938.456 1.765 1.15 2.296-1.815.774-3.084 2.712-3.084 4.954 0 .267.217.483.484.483h8.7a.483.483 0 0 0 .483-.483c0-2.242-1.268-4.18-3.083-4.954a2.887 2.887 0 0 0 1.15-2.296v-.967c0-1.598-1.302-2.9-2.9-2.9zM1.736 9.184v.774h.774v-.774h-.774zm17.431 0v.774h.775v-.774h-.775zM1.736 10.732v.774h.774v-.774h-.774zm17.431 0v.774h.775v-.774h-.775zM1.736 12.28v.775h.774v-.775h-.774zm17.431 0v.775h.775v-.775h-.775zM1.736 13.83v.774h.774v-.774h-.774zm17.431 0v.774h.775v-.774h-.775zM2.23 15.382a1.534 1.534 0 0 0-.88.202A1.555 1.555 0 0 0 .782 17.7a1.555 1.555 0 0 0 2.115.567 1.555 1.555 0 0 0 .567-2.116 1.554 1.554 0 0 0-1.235-.77zm17.22 0c-.497.035-.97.309-1.236.77-.425.736-.17 1.69.567 2.115.737.425 1.69.17 2.116-.567.425-.737.17-1.69-.567-2.116a1.534 1.534 0 0 0-.88-.202zm-15.121 2.37l-.387.67.67.388.386-.672-.67-.387zm13.022 0l-.67.386.387.672.67-.387-.387-.672zm-11.681.773l-.387.672.67.387.387-.672-.67-.387zm10.34 0l-.67.387.387.672.67-.387-.387-.672zM7.01 19.3l-.387.67.67.388.387-.671-.67-.387zm7.657 0l-.67.387.388.671.67-.387-.388-.671zm-6.317.774l-.387.671.671.387.387-.671-.671-.387zm4.978 0l-.672.387.387.671.672-.387-.387-.671zm-2.49.335c-.85 0-1.548.698-1.548 1.549 0 .85.698 1.548 1.549 1.548.85 0 1.548-.698 1.548-1.548 0-.85-.698-1.549-1.548-1.549z"
                ></path>
              </svg>
            </div>
            <span class="nav-link-name">{{ _t('CRM') }}</span>

            <!-- <span class="nav-link-text"></span> -->
          </a>
        </li>
        <li
          class="nav-item active-opacity"
          data-toggle="tooltip"
          data-placement="right"
          :title="_t('Brands Settings')"
          v-if="permitted('brand', 'root')"
        >
          <a class="nav-link-nav" :href="brand" target="_self">
            <div class="nav-link-text">
              <svg id="brands_settings_icon" viewBox="0 0 21 18">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.5039 0.871912C9.86689 -0.290637 8.13311 -0.290637 7.49611 0.871912C7.06721 1.65468 6.06679 1.96677 5.24059 1.57554C4.01352 0.994499 2.61087 1.97293 2.80725 3.27294C2.93948 4.14825 2.32118 4.96531 1.41326 5.11506C0.0648221 5.33746 -0.470946 6.92061 0.483803 7.8615C1.12665 8.49503 1.12665 9.50497 0.483803 10.1385C-0.470946 11.0794 0.0648221 12.6625 1.41326 12.8849C2.32118 13.0347 2.93948 13.8517 2.80725 14.7271C2.61087 16.0271 4.01352 17.0055 5.24059 16.4245C6.06679 16.0332 7.06721 16.3453 7.49611 17.1281C8.13311 18.2906 9.86689 18.2906 10.5039 17.1281C10.9328 16.3453 11.9332 16.0332 12.7594 16.4245C13.1467 16.6079 13.5515 16.6359 13.918 16.5475C13.6012 16.2794 13.3158 15.9757 13.0677 15.6421L13.6858 14.5298C13.5124 14.2259 13.3758 13.8984 13.2809 13.5534L12.058 13.2035C12.0205 12.9461 12 12.6821 12 12.4138C12 12.1455 12.0206 11.8815 12.0586 11.6235L13.2815 11.2736C13.3764 10.9286 13.5136 10.6018 13.6864 10.2972L13.0683 9.18486C13.3843 8.76009 13.7607 8.38366 14.1855 8.06765L15.2978 8.68577C15.6017 8.51235 15.9292 8.3758 16.2742 8.28094L16.6241 7.05801C16.8815 7.02055 17.1455 7 17.4138 7C17.6019 7 17.7879 7.0101 17.9712 7.02926C18.136 6.18698 17.5833 5.27943 16.5867 5.11506C15.6788 4.96531 15.0605 4.14825 15.1928 3.27294C15.3891 1.97293 13.9865 0.994499 12.7594 1.57554C11.9332 1.96677 10.9328 1.65468 10.5039 0.871912ZM12.8978 6.30292C13.0651 6.08323 13.0226 5.76951 12.8029 5.60221C12.5832 5.4349 12.2695 5.47737 12.1022 5.69706L9.13789 9.58961C8.93073 9.86165 8.51773 9.85013 8.32605 9.56697L7.41406 8.21971C7.25926 7.99103 6.9484 7.93114 6.71972 8.08594C6.49105 8.24073 6.43115 8.5516 6.58595 8.78028L7.49794 10.1275C8.07298 10.977 9.31197 11.0116 9.93346 10.1955L12.8978 6.30292ZM20.9616 12.9369C20.9864 12.7664 21 12.5915 21 12.4138C21 12.2361 20.9864 12.0612 20.9616 11.8907L20.1515 11.6589C20.0886 11.4304 19.9982 11.2134 19.8833 11.0121L20.2928 10.2753C20.0834 9.99389 19.8341 9.74454 19.5527 9.5352L18.8159 9.94466C18.6141 9.83019 18.3976 9.73933 18.1691 9.67649L17.9373 8.8664C17.7664 8.84118 17.5915 8.82757 17.4138 8.82757C17.2361 8.82757 17.0612 8.84118 16.8907 8.866L16.6589 9.67609C16.4304 9.73893 16.2134 9.82939 16.0121 9.94426L15.2753 9.5348C14.9939 9.74414 14.7445 9.99349 14.5352 10.2749L14.9447 11.0117C14.8302 11.2135 14.7393 11.43 14.6765 11.6585L13.8664 11.8903C13.8412 12.0612 13.8276 12.2361 13.8276 12.4138C13.8276 12.5915 13.8412 12.7664 13.866 12.9369L14.6761 13.1687C14.7389 13.3972 14.8294 13.6141 14.9443 13.8155L14.5348 14.5523C14.7441 14.8337 14.9935 15.083 15.2749 15.2924L16.0117 14.8829C16.2135 14.9974 16.43 15.0882 16.6585 15.1511L16.8903 15.9612C17.0612 15.9864 17.2361 16 17.4138 16C17.5915 16 17.7664 15.9864 17.9369 15.9616L18.1687 15.1515C18.3972 15.0886 18.6141 14.9982 18.8155 14.8833L19.5523 15.2928C19.8337 15.0834 20.083 14.8341 20.2924 14.5527L19.8829 13.8159C19.9974 13.6141 20.0882 13.3976 20.1511 13.1691L20.9616 12.9369ZM17.4138 13.9507C16.5648 13.9507 15.8768 13.2627 15.8768 12.4138C15.8768 11.5649 16.5648 10.8768 17.4138 10.8768C18.2627 10.8768 18.9507 11.5649 18.9507 12.4138C18.9507 13.2627 18.2627 13.9507 17.4138 13.9507Z"
                  fill=""
                ></path>
              </svg>
            </div>
            <span class="nav-link-name">{{ _t('Brands Settings') }}</span>

            <!-- <span class="nav-link-text"></span> -->
          </a>
        </li>
        <li
          class="nav-item active-opacity"
          data-toggle="tooltip"
          data-placement="right"
          :title="_t('Delivery')"
          v-if="permitted('delivery', 'root')"
        >
          <a class="nav-link-nav" :href="dm" target="_self">
            <div class="nav-link-text">
              <svg id="delivery_manager_icon" viewBox="0 0 20 21">
                <path
                  d="M19.455 14.158a.545.545 0 0 0-.66-.43l-9.572 2.848a2.948 2.948 0 0 0-.611-.927l8.818-2.45a.545.545 0 0 0 .42-.647l-1.023-4.8a.545.545 0 0 0-.646-.42l-2.136.453-.921-4.269a.545.545 0 0 0-.647-.425L5.675 5.119a.545.545 0 0 0-.42.65l1.022 4.8.906 4.251a3.06 3.06 0 0 0-.728-.093H6.31L2.727.693a.545.545 0 0 0-.545-.42H.545a.545.545 0 1 0 0 1.09h1.206l3.498 13.62a3 3 0 1 0 4.206 2.744v-.084l9.569-2.825a.545.545 0 0 0 .43-.66zm-13-8.084l5.714-1.797.796 3.737-5.42 1.728-.313.076-.777-3.744zm-1.91 11.653a1.91 1.91 0 1 1 3.819 0 1.91 1.91 0 0 1-3.819 0zm3.71-3.117l-.797-3.736L15.86 8.51l.796 3.734-8.4 2.366z"
                  fill=""
                ></path>
              </svg>
            </div>
            <span class="nav-link-name">{{ _t('Delivery') }}</span>

            <!-- <span class="nav-link-text"></span> -->
          </a>
        </li>
        <li
          class="nav-item active-opacity"
          data-toggle="tooltip"
          data-placement="right"
          :title="_t('Dispatch')"
          v-if="permitted('dispatch', 'root')"
        >
          <a class="nav-link-nav" :href="dispatch" target="_self">
            <div class="nav-link-text">
              <svg id="dispatch_screen_icon" viewBox="0 0 21 16">
                <path
                  fill=""
                  fill-rule="evenodd"
                  d="M15.26 14.98v-1.89h-3.78c-.81 0-1.47-.66-1.47-1.47V10.5h-2.8v2.38h1.96a.49.49 0 1 1 0 .98h-4.9a.49.49 0 1 1 0-.98h1.96V10.5H1.469A1.47 1.47 0 0 1 0 9.034V1.466C0 .656.657 0 1.469 0H12.39c.81 0 1.469.659 1.469 1.466V5.04h5.67c.81 0 1.47.66 1.47 1.47v5.11c0 .813-.656 1.47-1.47 1.47h-3.29v1.89h1.96a.49.49 0 1 1 0 .98h-4.9a.49.49 0 1 1 0-.98h1.96zm-4.27-8.47v5.11c0 .269.22.49.49.49h8.05c.272 0 .49-.218.49-.49V6.51c0-.269-.22-.49-.49-.49h-8.05a.488.488 0 0 0-.49.49zm1.89-5.044a.49.49 0 0 0-.489-.486H1.47a.486.486 0 0 0-.489.486v7.568c0 .266.22.486.489.486h8.541V6.51c0-.813.656-1.47 1.47-1.47h1.4V1.466z"
                ></path>
              </svg>
            </div>
            <span class="nav-link-name">{{ _t('Dispatch') }}</span>

            <!-- <span class="nav-link-text"></span> -->
          </a>
        </li>
        <li
          class="nav-item active-opacity"
          data-toggle="tooltip"
          data-placement="right"
          :title="_t('Super Admin')"
          v-if="permitted('admin', 'root')"
        >
          <a class="nav-link-nav" :href="sadmin" target="_self">
            <div class="nav-link-text">
              <svg id="global_settings_icon" viewBox="0 0 21 21.21">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11 2C7.19692 2 4.05498 4.83064 3.56609 8.5H4H5V9.5V13.5V14.5H4H2C1.44772 14.5 1 14.0523 1 13.5V9.5C1 8.94772 1.44772 8.5 2 8.5H2.5582C3.05313 4.27683 6.64389 1 11 1C15.3561 1 18.9469 4.27683 19.4418 8.5H20C20.5523 8.5 21 8.94772 21 9.5V13.5C21 14.0523 20.5523 14.5 20 14.5H19.5V14.75C19.5 17.6495 17.1495 20 14.25 20H13.8662C13.6933 20.2989 13.3701 20.5 13 20.5H10C9.44771 20.5 9 20.0523 9 19.5V18.5C9 17.9477 9.44772 17.5 10 17.5H13C13.5523 17.5 14 17.9477 14 18.5V19H14.25C16.5972 19 18.5 17.0972 18.5 14.75V14.5H18H17V13.5V9.5V8.5H18H18.4339C17.945 4.83064 14.8031 2 11 2ZM2 9.5H2.5H3.5H4V13.5H2V9.5ZM18 9.5H18.5H19.5H20V13.5H18V9.5ZM13 18.5H10V19.5H13V18.5ZM8.54936 12.4968C8.49478 12.2261 8.27614 12 8 12C7.72386 12 7.49625 12.2251 7.53523 12.4985C7.77721 14.1954 9.23625 15.5 11 15.5C12.7638 15.5 14.2228 14.1954 14.4648 12.4985C14.5038 12.2251 14.2761 12 14 12C13.7239 12 13.5052 12.2261 13.4506 12.4968C13.2202 13.6395 12.2106 14.5 11 14.5C9.78939 14.5 8.77976 13.6395 8.54936 12.4968Z"
                  fill=""
                ></path>
              </svg>
            </div>
            <span class="nav-link-name">{{ _t('Super Admin') }}</span>

            <!-- <span class="nav-link-text"></span> -->
          </a>
        </li>
      </ul>
    </div>
    <div class="slider-btn" @click="showMore">
      <i aria-hidden="true" class="fa fa-chevron-down"></i>
    </div>
    <router-link
      class="navigation-avatar color-secondary"
      v-if="userDetails && permitted('profile', 'root')"
      :to="'/user-details' + currentStore"
    >
      <a
        class="nav-link"
        role="button"
        :title="userDetails.item ? userDetails.item.name : ''"
      >
        <img
          v-if="typeof userDetails.item != 'undefined'"
          :src="
            userDetails.item.avatar
              ? userDetails.item.avatar
              : 'img/profile/default_avatar.jpg'
          "
          alt="profile"
        />
        <div class="nav-link-user-name color-text-invert">
          {{ userDetails.item ? userDetails.item.name : '' }}
        </div>
      </a>
    </router-link>
    <!--top Menu-->
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
/* global $, menuShowMore */
export default {
  name: 'SystemNavigation',
  methods: {
    collapseExpend() {
      $('.navigation').toggleClass('collapse-menu')
      $('.toggle-nav-content').toggleClass('collapse-container')
    },
    showMore() {
      menuShowMore()
    },
    baseurl(link) {
      /*DeliveryManager, Dinein*/
      let replaceURI = ''
      if (this.$router.currentRoute.name === 'DeliveryManager') {
        replaceURI = '/delivery-manager/'
      } else if (this.$router.currentRoute.name === 'Dinein') {
        replaceURI = '/dine-in/'
      }
      return (
        window.location.href.replace(
          new RegExp('(/pos)?' + replaceURI + '.*'),
          '/' + link
        ) + this.$store.getters['context/brand']
      )
    },
  },
  data() {
    return {
      // dm: '/delivery-manager' + this.$store.getters['context/store'],
      dm: this.baseurl('delivery') + '/delivery_home/new',
      dashboard: this.baseurl('dashboard'),
      crm: this.baseurl('crm') + '/brand_customers',
      menu: this.baseurl('menu'),
      brand: this.baseurl('brands'),
      store: this.baseurl('locations'),
      dispatch: this.baseurl('dispatch'),
      sadmin: '/super-admin',
    }
  },
  computed: {
    ...mapGetters({
      currentStore: ['context/store'],
    }),
    ...mapGetters('location', ['_t', 'permitted']),
    ...mapGetters('auth', ['cashier_walkin']),
    ...mapState('auth', ['userDetails']),
    /*...mapState({
      profileImage: state =>
        state.auth.userDetails && state.auth.userDetails.image
          ? process.env.VUE_APP_API_ENDPOINT +
            '/profile_pic/' +
            state.auth.userDetails.image
          : '/img/pos/default_avatar.jpg',
    }),*/
  },
}
</script>

<style scoped></style>
