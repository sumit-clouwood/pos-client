<template>
  <!-- CRM details -->
  <div class="modal fade" id="display-order" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-body manage-customer-wrap">
          <div class="crm-details-wrap">
            <div id="order-profile" class="profile-order">
              <ul class="ullist-profile">
                <li>
                  <img src="img/pos/order-profile.png" alt="order-profile" />
                </li>
                <li>
                  <p class="profile-customer-title">Customer Name:</p>
                  <h2 id="profile-customer-name">Beby Jovanca</h2>
                  <p class="name-confrimation">
                    Not Beby?
                    <span
                      data-toggle="modal"
                      data-target="#customer"
                      data-dismiss="modal"
                      >Create new customer</span
                    >
                  </p>
                </li>
                <li>
                  <p class="profile-customer-title">Phone Number:</p>
                  <h2 id="profile-customer-number">0509690771</h2>
                </li>
                <li>
                  <a class="cu-edit-icon" href="#"
                    ><span
                      ><svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="16"
                        viewBox="0 0 17 16"
                      >
                        <g
                          fill="none"
                          fill-rule="evenodd"
                          stroke="#566177"
                          transform="translate(-1 -1)"
                        >
                          <path
                            d="M2.504 15.756l3.608-.792a1.83 1.83 0 0 0 .27-.07.354.354 0 0 0 .085-.047c.04-.03.08-.065.204-.19l9.908-9.907c.234-.234.291-.32.325-.431a.409.409 0 0 0 0-.245c-.034-.111-.091-.196-.325-.43L14.856 1.92c-.234-.234-.319-.291-.43-.325a.409.409 0 0 0-.245 0c-.112.034-.197.091-.43.325l-9.94 9.94c-.118.118-.15.153-.178.19a.347.347 0 0 0-.045.074 2.032 2.032 0 0 0-.081.246l-1.003 3.385z"
                          />
                          <rect
                            width="11"
                            height="1"
                            x="4.5"
                            y="8.5"
                            rx=".5"
                            transform="rotate(-45 10 8.5)"
                          />
                        </g></svg></span
                    >Edit</a
                  ><a class="cu-delete-icon" href="#"
                    ><span
                      ><svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="18"
                        viewBox="0 0 16 18"
                      >
                        <g fill="none" fill-rule="evenodd" stroke="#DE3C3C">
                          <path
                            d="M2.278 4.808V15.23a1.5 1.5 0 0 0 1.5 1.5h8.444a1.5 1.5 0 0 0 1.5-1.5V4.808H2.278zM6.727 1.654l.079.57H1.723a1.223 1.223 0 0 0 0 2.445h12.554a1.223 1.223 0 0 0 0-2.446H9.194l.079-.569a.509.509 0 0 0 .005-.07V1a.5.5 0 0 0-.5-.5H7.222a.5.5 0 0 0-.5.5v.585c0 .023.002.047.005.07z"
                          />
                          <rect
                            width="1"
                            height="4.169"
                            x="5.833"
                            y="8.254"
                            fill="#D8D8D8"
                            rx=".5"
                          />
                          <rect
                            width="1"
                            height="4.169"
                            x="10.278"
                            y="8.254"
                            fill="#D8D8D8"
                            rx=".5"
                          />
                        </g></svg></span
                    >Delete</a
                  >
                </li>
              </ul>
              <div id="delivery-area-address">
                <div class="order-address-details">
                  <p>Select Delivery Address</p>
                  <button
                    id="cu-add-address"
                    data-toggle="modal"
                    data-target="#add_address"
                    data-dismiss="modal"
                  >
                    + Add address
                  </button>
                </div>
                <div class="location-delivery-area-address">
                  <div
                    class="order-location option-contain cu-delivery-area-location active"
                  >
                    <p>
                      <span>Test Location</span>, 13 -BNearby Street, Delhi,
                      India
                    </p>
                    <p class="cu-location-select">
                      <span
                        ><svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="11"
                          height="17"
                          viewBox="0 0 11 17"
                        >
                          <path
                            fill="#566177"
                            fill-rule="evenodd"
                            d="M5.5 0a5.49 5.49 0 0 0-3.535 1.286A5.504 5.504 0 0 0 .737 8.25l4.019 5.758a.861.861 0 0 0 1.489 0l4.019-5.758a5.504 5.504 0 0 0-1.228-6.964A5.49 5.49 0 0 0 5.5 0zM3.094 4.469a.343.343 0 1 0 0 .687h4.813a.343.343 0 1 0 0-.687H3.094zm0 1.375a.343.343 0 1 0 0 .688h4.813a.343.343 0 1 0 0-.688H3.094zm-.516 6.74c-.049 0-.098.01-.143.031-.62.29-1.1.677-1.303 1.144-.207.476-.09 1.035.296 1.46.77.852 2.338 1.282 4.072 1.282 1.735 0 3.303-.43 4.072-1.281.385-.426.503-.985.297-1.46-.202-.465-.687-.854-1.301-1.143a.344.344 0 0 0-.288.623c.543.248.852.55.957.793.106.243.08.444-.174.725-.51.563-1.955 1.055-3.563 1.055s-3.053-.492-3.562-1.055c-.255-.281-.281-.482-.175-.725.105-.243.415-.544.958-.793a.345.345 0 0 0-.143-.656z"
                          />
                        </svg> </span
                      ><span
                        ><svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="17"
                          height="16"
                          viewBox="0 0 17 16"
                        >
                          <g
                            fill="none"
                            fill-rule="evenodd"
                            stroke="#566177"
                            transform="translate(-1 -1)"
                          >
                            <path
                              d="M2.504 15.756l3.608-.792a1.83 1.83 0 0 0 .27-.07.354.354 0 0 0 .085-.047c.04-.03.08-.065.204-.19l9.908-9.907c.234-.234.291-.32.325-.431a.409.409 0 0 0 0-.245c-.034-.111-.091-.196-.325-.43L14.856 1.92c-.234-.234-.319-.291-.43-.325a.409.409 0 0 0-.245 0c-.112.034-.197.091-.43.325l-9.94 9.94c-.118.118-.15.153-.178.19a.347.347 0 0 0-.045.074 2.032 2.032 0 0 0-.081.246l-1.003 3.385z"
                            />
                            <rect
                              width="11"
                              height="1"
                              x="4.5"
                              y="8.5"
                              rx=".5"
                              transform="rotate(-45 10 8.5)"
                            />
                          </g></svg></span
                      ><span
                        ><svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="18"
                          viewBox="0 0 16 18"
                        >
                          <g fill="none" fill-rule="evenodd" stroke="#DE3C3C">
                            <path
                              d="M2.278 4.808V15.23a1.5 1.5 0 0 0 1.5 1.5h8.444a1.5 1.5 0 0 0 1.5-1.5V4.808H2.278zM6.727 1.654l.079.57H1.723a1.223 1.223 0 0 0 0 2.445h12.554a1.223 1.223 0 0 0 0-2.446H9.194l.079-.569a.509.509 0 0 0 .005-.07V1a.5.5 0 0 0-.5-.5H7.222a.5.5 0 0 0-.5.5v.585c0 .023.002.047.005.07z"
                            />
                            <rect
                              width="1"
                              height="4.169"
                              x="5.833"
                              y="8.254"
                              fill="#D8D8D8"
                              rx=".5"
                            />
                            <rect
                              width="1"
                              height="4.169"
                              x="10.278"
                              y="8.254"
                              fill="#D8D8D8"
                              rx=".5"
                            />
                          </g></svg
                      ></span>
                    </p>
                  </div>
                  <div
                    class="order-location option-contain cu-delivery-area-location"
                  >
                    <p>
                      <span>Test Location</span>, 13 -BNearby Street, Delhi,
                      India
                    </p>
                    <p class="cu-location-select">
                      <span
                        ><svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="11"
                          height="17"
                          viewBox="0 0 11 17"
                        >
                          <path
                            fill="#566177"
                            fill-rule="evenodd"
                            d="M5.5 0a5.49 5.49 0 0 0-3.535 1.286A5.504 5.504 0 0 0 .737 8.25l4.019 5.758a.861.861 0 0 0 1.489 0l4.019-5.758a5.504 5.504 0 0 0-1.228-6.964A5.49 5.49 0 0 0 5.5 0zM3.094 4.469a.343.343 0 1 0 0 .687h4.813a.343.343 0 1 0 0-.687H3.094zm0 1.375a.343.343 0 1 0 0 .688h4.813a.343.343 0 1 0 0-.688H3.094zm-.516 6.74c-.049 0-.098.01-.143.031-.62.29-1.1.677-1.303 1.144-.207.476-.09 1.035.296 1.46.77.852 2.338 1.282 4.072 1.282 1.735 0 3.303-.43 4.072-1.281.385-.426.503-.985.297-1.46-.202-.465-.687-.854-1.301-1.143a.344.344 0 0 0-.288.623c.543.248.852.55.957.793.106.243.08.444-.174.725-.51.563-1.955 1.055-3.563 1.055s-3.053-.492-3.562-1.055c-.255-.281-.281-.482-.175-.725.105-.243.415-.544.958-.793a.345.345 0 0 0-.143-.656z"
                          />
                        </svg> </span
                      ><span
                        ><svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="17"
                          height="16"
                          viewBox="0 0 17 16"
                        >
                          <g
                            fill="none"
                            fill-rule="evenodd"
                            stroke="#566177"
                            transform="translate(-1 -1)"
                          >
                            <path
                              d="M2.504 15.756l3.608-.792a1.83 1.83 0 0 0 .27-.07.354.354 0 0 0 .085-.047c.04-.03.08-.065.204-.19l9.908-9.907c.234-.234.291-.32.325-.431a.409.409 0 0 0 0-.245c-.034-.111-.091-.196-.325-.43L14.856 1.92c-.234-.234-.319-.291-.43-.325a.409.409 0 0 0-.245 0c-.112.034-.197.091-.43.325l-9.94 9.94c-.118.118-.15.153-.178.19a.347.347 0 0 0-.045.074 2.032 2.032 0 0 0-.081.246l-1.003 3.385z"
                            />
                            <rect
                              width="11"
                              height="1"
                              x="4.5"
                              y="8.5"
                              rx=".5"
                              transform="rotate(-45 10 8.5)"
                            />
                          </g></svg></span
                      ><span
                        ><svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="18"
                          viewBox="0 0 16 18"
                        >
                          <g fill="none" fill-rule="evenodd" stroke="#DE3C3C">
                            <path
                              d="M2.278 4.808V15.23a1.5 1.5 0 0 0 1.5 1.5h8.444a1.5 1.5 0 0 0 1.5-1.5V4.808H2.278zM6.727 1.654l.079.57H1.723a1.223 1.223 0 0 0 0 2.445h12.554a1.223 1.223 0 0 0 0-2.446H9.194l.079-.569a.509.509 0 0 0 .005-.07V1a.5.5 0 0 0-.5-.5H7.222a.5.5 0 0 0-.5.5v.585c0 .023.002.047.005.07z"
                            />
                            <rect
                              width="1"
                              height="4.169"
                              x="5.833"
                              y="8.254"
                              fill="#D8D8D8"
                              rx=".5"
                            />
                            <rect
                              width="1"
                              height="4.169"
                              x="10.278"
                              y="8.254"
                              fill="#D8D8D8"
                              rx=".5"
                            />
                          </g></svg
                      ></span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="cu-loyality-points">
                <div class="cu-loyality-points-title">
                  <p>
                    Loyalty Points:
                    <span data-toggle="tooltip" title="Redeem"
                      ><svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                      >
                        <path
                          fill="#FFC10E"
                          fill-rule="evenodd"
                          d="M3.64 8.135h.472a5.326 5.326 0 0 0 3.725 3.004v1.75H6.532a.73.73 0 0 0-.729.729v.957h-.65a.465.465 0 0 0-.472.474v2.486c0 .257.209.465.465.465h7.618a.463.463 0 0 0 .472-.465V15.05a.465.465 0 0 0-.464-.465h-.657v-.956a.729.729 0 0 0-.73-.73h-1.304v-1.76a5.326 5.326 0 0 0 3.725-3.003h.473a3.637 3.637 0 0 0 3.637-3.64v-2.21a.583.583 0 0 0-.583-.584h-3.055V.583A.583.583 0 0 0 13.695 0H4.221a.583.583 0 0 0-.584.583v1.12H.583A.583.583 0 0 0 0 2.286v2.209a3.639 3.639 0 0 0 3.64 3.64zm10.639-2.191v-2.4h1.797v.951a1.8 1.8 0 0 1-1.797 1.796h-.012c.005-.114.012-.231.012-.347zM6.684 4.318l1.313-.194a.23.23 0 0 0 .17-.125l.584-1.188a.227.227 0 0 1 .408 0L9.743 4a.228.228 0 0 0 .17.125l1.313.194a.228.228 0 0 1 .126.389l-.948.926a.229.229 0 0 0-.067.194l.224 1.306a.228.228 0 0 1-.33.24l-1.167-.617a.227.227 0 0 0-.212 0l-1.167.617a.227.227 0 1 1-.33-.24l.223-1.306a.227.227 0 0 0-.066-.195l-.948-.926v.001a.228.228 0 0 1 .12-.389zm-4.84-.777H3.64v2.403c0 .117 0 .233.01.347h-.01a1.8 1.8 0 0 1-1.797-1.797v-.953z"
                        />
                      </svg>
                      300 pts</span
                    >
                  </p>
                </div>
                <div class="btn-right-neworder">
                  <button id="place-new-order">Place New Order</button>
                </div>
              </div>
            </div>
            <div class="customer-insight">
              <div class="title-cu">
                <h2>Customer Insights</h2>
              </div>
              <div class="last-order-wrap">
                <div class="insight-last-order">
                  <h3>LAST ORDER</h3>
                  <p class="last-order-time">About 28 D 15 H 31 M ago</p>
                  <p class="last-order-details">1 x Family meal</p>
                </div>
                <div class="insight-last-order">
                  <ul class="ullist-business-slider">
                    <li>TOTAL BUSINESS <span>10</span></li>
                    <li>CANCELLED <span>0</span></li>
                  </ul>
                  <div class="total-amount-business-slider">
                    <p>TOTAL AMOUNT</p>
                    <h3>AED 600.00</h3>
                  </div>
                </div>
                <div class="insight-last-order">
                  <h3>LAST ORDER</h3>
                  <ul class="fav-item-slider">
                    <li><img src="img/pos/bottle.jpg" alt="fav-item" /></li>
                    <li>Water Small</li>
                  </ul>
                </div>
              </div>
              <div class="dob-customer-insight">
                <ul class="ullist-dob">
                  <li>Birthday : <span>18 jul 1994</span></li>
                  <li>Age : <span>24</span></li>
                  <li>Gender : <span>Male</span></li>
                </ul>
              </div>
              <div class="customer-insights-notes">
                <div>
                  <p>Notes :</p>
                  <p>This is example of notes</p>
                  <a href="#">Show more</a>
                </div>
                <div>
                  <button
                    id="customer-notes-add"
                    data-toggle="modal"
                    data-target="#admin-popup"
                  >
                    + Add
                  </button>
                </div>
              </div>
              <div class="customer-insight-feedback">
                <p>User Feedback :</p>
                <ul class="ullist-feedback">
                  <li>
                    <a href="#"
                      ><span class="black-smile"
                        ><img src="img/pos/unhappy.png"/></span
                      ><span class="color-smile"
                        ><img src="img/pos/unhappy-color.png"/></span
                    ></a>
                  </li>
                  <li>
                    <a href="#"
                      ><span class="black-smile"
                        ><img src="img/pos/unhappy-copy.png"/></span
                      ><span class="color-smile"
                        ><img src="img/pos/unhappy-copy-color.png"/></span
                    ></a>
                  </li>
                  <li>
                    <a href="#"
                      ><span class="black-smile"
                        ><img src="img/pos/confused.png"/></span
                      ><span class="color-smile"
                        ><img src="img/pos/confused-color.png"/></span
                    ></a>
                  </li>
                  <li class="active">
                    <a href="#"
                      ><span class="black-smile"
                        ><img src="img/pos/unhappy-copy-2.png"/></span
                      ><span class="color-smile"
                        ><img src="img/pos/unhappy-copy-2-color.png"/></span
                    ></a>
                  </li>
                  <li>
                    <a href="#"
                      ><span class="black-smile"
                        ><img src="img/pos/happy.png"/></span
                      ><span class="color-smile"
                        ><img src="img/pos/happy-color.png"/></span
                    ></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <h2 class="past-order">Past Orders</h2>
          <div class="manage-customer-table">
            <table class="table table-responsive">
              <tr>
                <th style="width: 190px">ORDER NUMBER</th>
                <th style="width: 250px">DATE & TIME</th>
                <th style="width: 190px">TYPE</th>
                <th style="width: 255px">TIME TAKEN</th>
                <th style="width: 190px">AMOUNT</th>
                <th style="width: 190px">STATUS</th>
                <th style="width: 190px">DRIVER</th>
                <th style="width: 205px">AGENT</th>
                <th style="width: 250px">SOURCE</th>
              </tr>
              <tr class="referal-code-customer">
                <td>#22537828</td>
                <td>My 28, 2018 6:19 pm</td>
                <td>Delivery</td>
                <td>28d 15h 53mins</td>
                <td>83.00</td>
                <td>Running</td>
                <td></td>
                <td>Tecom</td>
                <td class="show-details-his">
                  <span
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="13"
                      viewBox="0 0 20 13"
                    >
                      <g fill="#27A83D" fill-rule="nonzero">
                        <path
                          d="M10 12.971c-2.229 0-4.621-1.053-6.921-3.063A19.21 19.21 0 0 1 .263 6.884a.526.526 0 0 1 0-.608A19.21 19.21 0 0 1 3.08 3.25C5.379 1.245 7.77.187 10 .187s4.621 1.052 6.921 3.063a19.21 19.21 0 0 1 2.816 3.024.526.526 0 0 1 0 .608 19.21 19.21 0 0 1-2.816 3.026c-2.3 2.005-4.692 3.063-6.921 3.063zM1.363 6.58c.924 1.174 4.492 5.34 8.637 5.34 4.145 0 7.716-4.164 8.637-5.34-.924-1.174-4.492-5.34-8.637-5.34-4.145 0-7.716 4.164-8.637 5.34z"
                        />
                        <path
                          d="M10 10.39a3.81 3.81 0 1 1 3.713-3.811A3.766 3.766 0 0 1 10 10.389zm0-6.58a2.758 2.758 0 1 0 2.66 2.769A2.713 2.713 0 0 0 10 3.82v-.01z"
                        />
                      </g></svg
                    >Show Details</span
                  >
                </td>
              </tr>
              <tr class="referal-code-customer">
                <td>#22537828</td>
                <td>My 28, 2018 6:19 pm</td>
                <td>Delivery</td>
                <td>28d 15h 53mins</td>
                <td>83.00</td>
                <td>Running</td>
                <td></td>
                <td>Tecom</td>
                <td class="show-details-his">
                  <span
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="13"
                      viewBox="0 0 20 13"
                    >
                      <g fill="#27A83D" fill-rule="nonzero">
                        <path
                          d="M10 12.971c-2.229 0-4.621-1.053-6.921-3.063A19.21 19.21 0 0 1 .263 6.884a.526.526 0 0 1 0-.608A19.21 19.21 0 0 1 3.08 3.25C5.379 1.245 7.77.187 10 .187s4.621 1.052 6.921 3.063a19.21 19.21 0 0 1 2.816 3.024.526.526 0 0 1 0 .608 19.21 19.21 0 0 1-2.816 3.026c-2.3 2.005-4.692 3.063-6.921 3.063zM1.363 6.58c.924 1.174 4.492 5.34 8.637 5.34 4.145 0 7.716-4.164 8.637-5.34-.924-1.174-4.492-5.34-8.637-5.34-4.145 0-7.716 4.164-8.637 5.34z"
                        />
                        <path
                          d="M10 10.39a3.81 3.81 0 1 1 3.713-3.811A3.766 3.766 0 0 1 10 10.389zm0-6.58a2.758 2.758 0 1 0 2.66 2.769A2.713 2.713 0 0 0 10 3.82v-.01z"
                        />
                      </g></svg
                    >Show Details</span
                  >
                </td>
              </tr>
              <tr class="referal-code-customer">
                <td>#22537828</td>
                <td>My 28, 2018 6:19 pm</td>
                <td>Delivery</td>
                <td>28d 15h 53mins</td>
                <td>83.00</td>
                <td>Running</td>
                <td></td>
                <td>Tecom</td>
                <td class="show-details-his">
                  <span
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="13"
                      viewBox="0 0 20 13"
                    >
                      <g fill="#27A83D" fill-rule="nonzero">
                        <path
                          d="M10 12.971c-2.229 0-4.621-1.053-6.921-3.063A19.21 19.21 0 0 1 .263 6.884a.526.526 0 0 1 0-.608A19.21 19.21 0 0 1 3.08 3.25C5.379 1.245 7.77.187 10 .187s4.621 1.052 6.921 3.063a19.21 19.21 0 0 1 2.816 3.024.526.526 0 0 1 0 .608 19.21 19.21 0 0 1-2.816 3.026c-2.3 2.005-4.692 3.063-6.921 3.063zM1.363 6.58c.924 1.174 4.492 5.34 8.637 5.34 4.145 0 7.716-4.164 8.637-5.34-.924-1.174-4.492-5.34-8.637-5.34-4.145 0-7.716 4.164-8.637 5.34z"
                        />
                        <path
                          d="M10 10.39a3.81 3.81 0 1 1 3.713-3.811A3.766 3.766 0 0 1 10 10.389zm0-6.58a2.758 2.758 0 1 0 2.66 2.769A2.713 2.713 0 0 0 10 3.82v-.01z"
                        />
                      </g></svg
                    >Show Details</span
                  >
                </td>
              </tr>
              <tr class="referal-code-customer">
                <td>#22537828</td>
                <td>My 28, 2018 6:19 pm</td>
                <td>Delivery</td>
                <td>28d 15h 53mins</td>
                <td>83.00</td>
                <td>Running</td>
                <td></td>
                <td>Tecom</td>
                <td class="show-details-his">
                  <span
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="13"
                      viewBox="0 0 20 13"
                    >
                      <g fill="#27A83D" fill-rule="nonzero">
                        <path
                          d="M10 12.971c-2.229 0-4.621-1.053-6.921-3.063A19.21 19.21 0 0 1 .263 6.884a.526.526 0 0 1 0-.608A19.21 19.21 0 0 1 3.08 3.25C5.379 1.245 7.77.187 10 .187s4.621 1.052 6.921 3.063a19.21 19.21 0 0 1 2.816 3.024.526.526 0 0 1 0 .608 19.21 19.21 0 0 1-2.816 3.026c-2.3 2.005-4.692 3.063-6.921 3.063zM1.363 6.58c.924 1.174 4.492 5.34 8.637 5.34 4.145 0 7.716-4.164 8.637-5.34-.924-1.174-4.492-5.34-8.637-5.34-4.145 0-7.716 4.164-8.637 5.34z"
                        />
                        <path
                          d="M10 10.39a3.81 3.81 0 1 1 3.713-3.811A3.766 3.766 0 0 1 10 10.389zm0-6.58a2.758 2.758 0 1 0 2.66 2.769A2.713 2.713 0 0 0 10 3.82v-.01z"
                        />
                      </g></svg
                    >Show Details</span
                  >
                </td>
              </tr>
              <tr class="referal-code-customer">
                <td>#22537828</td>
                <td>My 28, 2018 6:19 pm</td>
                <td>Delivery</td>
                <td>28d 15h 53mins</td>
                <td>83.00</td>
                <td>Running</td>
                <td></td>
                <td>Tecom</td>
                <td class="show-details-his">
                  <span
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="13"
                      viewBox="0 0 20 13"
                    >
                      <g fill="#27A83D" fill-rule="nonzero">
                        <path
                          d="M10 12.971c-2.229 0-4.621-1.053-6.921-3.063A19.21 19.21 0 0 1 .263 6.884a.526.526 0 0 1 0-.608A19.21 19.21 0 0 1 3.08 3.25C5.379 1.245 7.77.187 10 .187s4.621 1.052 6.921 3.063a19.21 19.21 0 0 1 2.816 3.024.526.526 0 0 1 0 .608 19.21 19.21 0 0 1-2.816 3.026c-2.3 2.005-4.692 3.063-6.921 3.063zM1.363 6.58c.924 1.174 4.492 5.34 8.637 5.34 4.145 0 7.716-4.164 8.637-5.34-.924-1.174-4.492-5.34-8.637-5.34-4.145 0-7.716 4.164-8.637 5.34z"
                        />
                        <path
                          d="M10 10.39a3.81 3.81 0 1 1 3.713-3.811A3.766 3.766 0 0 1 10 10.389zm0-6.58a2.758 2.758 0 1 0 2.66 2.769A2.713 2.713 0 0 0 10 3.82v-.01z"
                        />
                      </g></svg
                    >Show Details</span
                  >
                </td>
              </tr>
              <tr class="referal-code-customer">
                <td>#22537828</td>
                <td>My 28, 2018 6:19 pm</td>
                <td>Delivery</td>
                <td>28d 15h 53mins</td>
                <td>83.00</td>
                <td>Running</td>
                <td></td>
                <td>Tecom</td>
                <td class="show-details-his">
                  <span
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="13"
                      viewBox="0 0 20 13"
                    >
                      <g fill="#27A83D" fill-rule="nonzero">
                        <path
                          d="M10 12.971c-2.229 0-4.621-1.053-6.921-3.063A19.21 19.21 0 0 1 .263 6.884a.526.526 0 0 1 0-.608A19.21 19.21 0 0 1 3.08 3.25C5.379 1.245 7.77.187 10 .187s4.621 1.052 6.921 3.063a19.21 19.21 0 0 1 2.816 3.024.526.526 0 0 1 0 .608 19.21 19.21 0 0 1-2.816 3.026c-2.3 2.005-4.692 3.063-6.921 3.063zM1.363 6.58c.924 1.174 4.492 5.34 8.637 5.34 4.145 0 7.716-4.164 8.637-5.34-.924-1.174-4.492-5.34-8.637-5.34-4.145 0-7.716 4.164-8.637 5.34z"
                        />
                        <path
                          d="M10 10.39a3.81 3.81 0 1 1 3.713-3.811A3.766 3.766 0 0 1 10 10.389zm0-6.58a2.758 2.758 0 1 0 2.66 2.769A2.713 2.713 0 0 0 10 3.82v-.01z"
                        />
                      </g></svg
                    >Show Details</span
                  >
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <div class="pagination-customer-details">
            <ul class="ullist-pagination">
              <li class="order-pagination active">1</li>
              <li class="order-pagination">2</li>
              <li class="order-pagination">3</li>
              <li class="order-pagination">4</li>
              <li class="next-page" id="next-page">
                <img src="img/pos/next-arrow.png" alt="next-btn" />
              </li>
              <li>Last</li>
            </ul>
          </div>
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce"
              data-dismiss="modal"
            >
              <span>X</span> Dismiss
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
  <!-- End CRM details -->
</template>

<script>
export default {
  name: 'ManageCustomerInformationEdit',
  props: {},
}
</script>
