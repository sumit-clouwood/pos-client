<template>
  <div class="dine-in-tabel-wrapper ui-draggable ui-draggable-handle">
    <div class="inner-dinein-table">
      <div class="dinein-table-control">
        <div class="dinein-seat-available">
          <ul class="ullist-dinein-table">
            <li id="unavailable-seat"><span>3</span>Unavailable</li>
            <li id="available-seat"><span>4</span>Available</li>
            <li id="available-soon-seat"><span>3</span>Available Soon</li>
          </ul>
        </div>
        <div class="zoom-wrap-dinein">
          <div class="POSItemOptions_quantity_inputs">
            <!-- <input type='button' value='-' class='qtyminus value-qty' field='quantity'/> -->
            <button class="qtyminus value-qty">-</button>
            <input
              type="text"
              name="quantity"
              value="100"
              min="1"
              class="qty"
            />
            <button class="qtyplus value-qty">+</button>
            <!-- <input type='button' value='+' class='qtyplus value-qty' field='quantity'/> -->
          </div>
          <div class="round-dinein-circle">
            <span id="dine-top"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="7"
                viewBox="0 0 14 7"
              >
                <path
                  fill="#3D3F43"
                  fill-rule="evenodd"
                  d="M7.304.264c.132.009.257.061.356.148l5.928 5.336a.598.598 0 0 1 .046.842.595.595 0 0 1-.842.042l-5.53-4.978-5.53 4.978a.595.595 0 1 1-.796-.884L6.864.412a.594.594 0 0 1 .44-.148z"
                ></path>
              </svg> </span
            ><span id="dine-left"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="7"
                height="14"
                viewBox="0 0 7 14"
              >
                <path
                  fill="#3D3F43"
                  fill-rule="evenodd"
                  d="M.002 6.566c.008.132.06.258.148.357l5.335 5.928a.598.598 0 0 0 .843.045.595.595 0 0 0 .042-.842L1.39 6.524 6.37.995a.595.595 0 1 0-.885-.796L.15 6.126a.594.594 0 0 0-.148.44z"
                ></path>
              </svg>
            </span>
            <span id="dine-right"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="7"
                height="14"
                viewBox="0 0 7 14"
              >
                <path
                  fill="#3D3F43"
                  fill-rule="evenodd"
                  d="M6.522 6.566a.598.598 0 0 1-.148.357L1.04 12.85a.598.598 0 0 1-.843.045.595.595 0 0 1-.042-.842l4.979-5.53L.154.995A.595.595 0 1 1 1.04.199l5.335 5.928c.107.12.16.28.148.44z"
                ></path>
              </svg>
            </span>
            <span id="dine-bottom"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="7"
                viewBox="0 0 14 7"
              >
                <path
                  fill="#3D3F43"
                  fill-rule="evenodd"
                  d="M7.304 6.785a.598.598 0 0 0 .356-.148L13.588 1.3a.598.598 0 0 0 .046-.842.595.595 0 0 0-.842-.042l-5.53 4.979-5.53-4.98a.595.595 0 1 0-.796.885l5.928 5.336c.12.107.279.16.44.148z"
                ></path>
              </svg>
            </span>
            <div class="inner-round">
              <div class="sub-inner-round"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="sitting-dinein-table ui-droppable" id="sitting-dinein-table">
        <div class="sitting-dine-wrap disable-sorting">
          <div class="sitting-image" data-target="/pos-walkin-cashier/pos.html">
            <span class="dine-top-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005.866c8.334 0 16.667 4.333 25 13h-50c8.334-8.667 16.667-13 25-13z"
                ></path>
              </svg>
            </span>
            <span class="dine-left-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="51"
                viewBox="0 0 14 51"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M.452 25.712c0-8.333 4.333-16.666 13-25v50c-8.667-8.333-13-16.666-13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-right-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="50"
                viewBox="0 0 14 50"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M13.973 25.005c0-8.333-4.333-16.666-13-25v50c8.667-8.333 13-16.666 13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-bottom-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"
                ></path>
              </svg>
            </span>
            <div class="sitting-tbl" id="table-1">
              <span class="unavailble-seat"></span
              ><span class="tbl-number">1</span>
              <div class="unavailable-tbl-dropdown">
                <button
                  type="button"
                  data-value=""
                  id="unavailable-tbl-dropdown"
                  class="btn dropdown-toggle"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span>&gt;</span></button
                ><!--<span><img src="images/referal-down.png"></span>-->
                <div class="dropdown-menu">
                  <a
                    class="dropdown-item"
                    data-value="Table 3"
                    href="javascript:void(0)"
                    >Table 3</a
                  >
                  <a
                    class="dropdown-item"
                    data-value="Table 3 A"
                    href="javascript:void(0)"
                    >Table 3 A</a
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="sitting-image" data-target="/pos-walkin-cashier/pos.html">
            <span class="dine-top-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005.866c8.334 0 16.667 4.333 25 13h-50c8.334-8.667 16.667-13 25-13z"
                ></path>
              </svg>
            </span>
            <span class="dine-left-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="51"
                viewBox="0 0 14 51"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M.452 25.712c0-8.333 4.333-16.666 13-25v50c-8.667-8.333-13-16.666-13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-right-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="50"
                viewBox="0 0 14 50"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M13.973 25.005c0-8.333-4.333-16.666-13-25v50c8.667-8.333 13-16.666 13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-bottom-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"
                ></path>
              </svg>
            </span>
            <div class="sitting-tbl" id="table-2">
              <span class="availble_soon-seat"></span
              ><span class="tbl-number">2</span>
            </div>
          </div>
          <div class="sitting-image" data-target="/pos-walkin-cashier/pos.html">
            <span class="dine-top-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005.866c8.334 0 16.667 4.333 25 13h-50c8.334-8.667 16.667-13 25-13z"
                ></path>
              </svg>
            </span>
            <span class="dine-left-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="51"
                viewBox="0 0 14 51"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M.452 25.712c0-8.333 4.333-16.666 13-25v50c-8.667-8.333-13-16.666-13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-right-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="50"
                viewBox="0 0 14 50"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M13.973 25.005c0-8.333-4.333-16.666-13-25v50c8.667-8.333 13-16.666 13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-bottom-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"
                ></path>
              </svg>
            </span>
            <div class="sitting-tbl" id="table-3">
              <span class="availble-seat"></span
              ><span class="tbl-number">3</span
              ><span class="booked-time">Booked in 2h</span>
            </div>
          </div>
          <div class="sitting-image" data-target="/pos-walkin-cashier/pos.html">
            <span class="dine-top-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005.866c8.334 0 16.667 4.333 25 13h-50c8.334-8.667 16.667-13 25-13z"
                ></path>
              </svg>
            </span>
            <span class="dine-left-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="51"
                viewBox="0 0 14 51"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M.452 25.712c0-8.333 4.333-16.666 13-25v50c-8.667-8.333-13-16.666-13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-right-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="50"
                viewBox="0 0 14 50"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M13.973 25.005c0-8.333-4.333-16.666-13-25v50c8.667-8.333 13-16.666 13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-bottom-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"
                ></path>
              </svg>
            </span>
            <div class="sitting-tbl" id="table-4">
              <span class="availble-seat"></span
              ><span class="tbl-number">4</span
              ><span class="booked-time">Booked in 2h</span>
            </div>
          </div>
          <div class="sitting-image" data-target="/pos-walkin-cashier/pos.html">
            <span class="dine-top-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005.866c8.334 0 16.667 4.333 25 13h-50c8.334-8.667 16.667-13 25-13z"
                ></path>
              </svg>
            </span>
            <span class="dine-left-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="51"
                viewBox="0 0 14 51"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M.452 25.712c0-8.333 4.333-16.666 13-25v50c-8.667-8.333-13-16.666-13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-right-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="50"
                viewBox="0 0 14 50"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M13.973 25.005c0-8.333-4.333-16.666-13-25v50c8.667-8.333 13-16.666 13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-bottom-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"
                ></path>
              </svg>
            </span>
            <div class="sitting-tbl" id="table-5">
              <span class="availble-seat"></span
              ><span class="tbl-number">5</span>
            </div>
          </div>
          <div
            class="sitting-image round-sitting-image round-four-chairs"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-top-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005.866c8.334 0 16.667 4.333 25 13h-50c8.334-8.667 16.667-13 25-13z"
                ></path>
              </svg>
            </span>
            <span class="dine-left-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="51"
                viewBox="0 0 14 51"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M.452 25.712c0-8.333 4.333-16.666 13-25v50c-8.667-8.333-13-16.666-13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-right-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="50"
                viewBox="0 0 14 50"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M13.973 25.005c0-8.333-4.333-16.666-13-25v50c8.667-8.333 13-16.666 13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-bottom-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"
                ></path>
              </svg>
            </span>
            <div class="sitting-tbl round-sitting-tbl" id="table-6">
              <span class="availble-seat"></span
              ><span class="tbl-number">6</span>
            </div>
          </div>
          <div
            class="sitting-image round-sitting-image round-two-chairs"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-top-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005.866c8.334 0 16.667 4.333 25 13h-50c8.334-8.667 16.667-13 25-13z"
                ></path>
              </svg>
            </span>
            <!--<span class="dine-left-img"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="51" viewBox="0 0 14 51">-->
            <!--<path fill="#E4E8F1" fill-rule="evenodd" d="M.452 25.712c0-8.333 4.333-16.666 13-25v50c-8.667-8.333-13-16.666-13-25z"/>-->
            <!--</svg>-->

            <!--</span>-->
            <!--<span class="dine-right-img"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="50" viewBox="0 0 14 50">-->
            <!--<path fill="#E4E8F1" fill-rule="evenodd" d="M13.973 25.005c0-8.333-4.333-16.666-13-25v50c8.667-8.333 13-16.666 13-25z"/>-->
            <!--</svg>-->

            <!--</span>-->
            <span class="dine-bottom-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"
                ></path>
              </svg>
            </span>
            <div class="sitting-tbl round-sitting-tbl" id="table-7">
              <span class="availble-seat"></span
              ><span class="tbl-number">7</span>
            </div>
          </div>
        </div>

        <div class="sitting-dine-wrap disable-sorting">
          <div
            class="sitting-image dine-large"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-top-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005.866c8.334 0 16.667 4.333 25 13h-50c8.334-8.667 16.667-13 25-13z"
                ></path>
              </svg>
            </span>
            <span class="dine-top-left-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005.866c8.334 0 16.667 4.333 25 13h-50c8.334-8.667 16.667-13 25-13z"
                ></path>
              </svg>
            </span>
            <span class="dine-bottom-right-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"
                ></path>
              </svg>
            </span>
            <span class="dine-bottom-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"
                ></path>
              </svg>
            </span>
            <div class="sitting-tbl-large" id="table-8">
              <span class="unavailble-seat"></span
              ><span class="tbl-number">8</span>
            </div>
          </div>
          <div
            class="sitting-image dine-large"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-top-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005.866c8.334 0 16.667 4.333 25 13h-50c8.334-8.667 16.667-13 25-13z"
                ></path>
              </svg>
            </span>
            <span class="dine-top-left-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005.866c8.334 0 16.667 4.333 25 13h-50c8.334-8.667 16.667-13 25-13z"
                ></path>
              </svg>
            </span>
            <span class="dine-bottom-right-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"
                ></path>
              </svg>
            </span>
            <span class="dine-bottom-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"
                ></path>
              </svg>
            </span>
            <div class="sitting-tbl-large" id="table-9">
              <span class="availble_soon-seat"></span
              ><span class="tbl-number">9</span>
            </div>
          </div>
          <div
            class="sitting-image dine-large"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-top-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005.866c8.334 0 16.667 4.333 25 13h-50c8.334-8.667 16.667-13 25-13z"
                ></path>
              </svg>
            </span>
            <span class="dine-top-left-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005.866c8.334 0 16.667 4.333 25 13h-50c8.334-8.667 16.667-13 25-13z"
                ></path>
              </svg>
            </span>
            <span class="dine-bottom-right-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"
                ></path>
              </svg>
            </span>
            <span class="dine-bottom-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"
                ></path>
              </svg>
            </span>
            <div class="sitting-tbl-large" id="table-10">
              <span class="availble-seat"></span
              ><span class="tbl-number">10</span>
            </div>
          </div>
          <div
            class="sitting-image dine-large dine-large-six-chairs"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-top-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005.866c8.334 0 16.667 4.333 25 13h-50c8.334-8.667 16.667-13 25-13z"
                ></path>
              </svg>
            </span>
            <span class="dine-top-left-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005.866c8.334 0 16.667 4.333 25 13h-50c8.334-8.667 16.667-13 25-13z"
                ></path>
              </svg>
            </span>
            <span class="dine-left-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="51"
                viewBox="0 0 14 51"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M.452 25.712c0-8.333 4.333-16.666 13-25v50c-8.667-8.333-13-16.666-13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-right-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="50"
                viewBox="0 0 14 50"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M13.973 25.005c0-8.333-4.333-16.666-13-25v50c8.667-8.333 13-16.666 13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-bottom-right-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"
                ></path>
              </svg>
            </span>
            <span class="dine-bottom-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"
                ></path>
              </svg>
            </span>
            <div class="sitting-tbl-large" id="table-11">
              <span class="availble-seat"></span
              ><span class="tbl-number">11</span>
            </div>
          </div>
          <div
            class="sitting-image round-sitting-image round-six-chairs"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-top-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005.866c8.334 0 16.667 4.333 25 13h-50c8.334-8.667 16.667-13 25-13z"
                ></path>
              </svg>
            </span>
            <span class="dine-left-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="51"
                viewBox="0 0 14 51"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M.452 25.712c0-8.333 4.333-16.666 13-25v50c-8.667-8.333-13-16.666-13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-left-top-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="51"
                viewBox="0 0 14 51"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M.452 25.712c0-8.333 4.333-16.666 13-25v50c-8.667-8.333-13-16.666-13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-right-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="50"
                viewBox="0 0 14 50"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M13.973 25.005c0-8.333-4.333-16.666-13-25v50c8.667-8.333 13-16.666 13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-right-top-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="50"
                viewBox="0 0 14 50"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M13.973 25.005c0-8.333-4.333-16.666-13-25v50c8.667-8.333 13-16.666 13-25z"
                ></path>
              </svg>
            </span>
            <!--<span class="dine-bottom-img"><svg xmlns="http://www.w3.org/2000/svg" width="50" height="14" viewBox="0 0 50 14">-->
            <!--<path fill="#E4E8F1" fill-rule="evenodd" d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"/>-->
            <!--</svg>-->
            <!--</span>-->
            <div class="sitting-tbl round-sitting-tbl" id="table-18">
              <span class="availble-seat"></span
              ><span class="tbl-number">6</span>
            </div>
          </div>
        </div>

        <div class="sitting-dine-wrap disable-sorting">
          <div
            class="sitting-image dine-long"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-left_side-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="51"
                viewBox="0 0 14 51"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M.452 25.712c0-8.333 4.333-16.666 13-25v50c-8.667-8.333-13-16.666-13-25z"
                ></path></svg
            ></span>
            <span class="dine-left-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="51"
                viewBox="0 0 14 51"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M.452 25.712c0-8.333 4.333-16.666 13-25v50c-8.667-8.333-13-16.666-13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-right-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="50"
                viewBox="0 0 14 50"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M13.973 25.005c0-8.333-4.333-16.666-13-25v50c8.667-8.333 13-16.666 13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-right_side-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="50"
                viewBox="0 0 14 50"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M13.973 25.005c0-8.333-4.333-16.666-13-25v50c8.667-8.333 13-16.666 13-25z"
                ></path></svg
            ></span>
            <div class="sitting-tbl-long" id="table-12">
              <span class="unavailble-seat"></span
              ><span class="tbl-number">12</span>
            </div>
          </div>
          <div
            class="sitting-image dine-long"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-left_side-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="51"
                viewBox="0 0 14 51"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M.452 25.712c0-8.333 4.333-16.666 13-25v50c-8.667-8.333-13-16.666-13-25z"
                ></path></svg
            ></span>
            <span class="dine-left-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="51"
                viewBox="0 0 14 51"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M.452 25.712c0-8.333 4.333-16.666 13-25v50c-8.667-8.333-13-16.666-13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-right-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="50"
                viewBox="0 0 14 50"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M13.973 25.005c0-8.333-4.333-16.666-13-25v50c8.667-8.333 13-16.666 13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-right_side-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="50"
                viewBox="0 0 14 50"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M13.973 25.005c0-8.333-4.333-16.666-13-25v50c8.667-8.333 13-16.666 13-25z"
                ></path></svg
            ></span>
            <div class="sitting-tbl-long" id="table-13">
              <span class="availble_soon-seat"></span
              ><span class="tbl-number">13</span>
            </div>
          </div>
          <div
            class="sitting-image dine-long"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-left_side-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="51"
                viewBox="0 0 14 51"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M.452 25.712c0-8.333 4.333-16.666 13-25v50c-8.667-8.333-13-16.666-13-25z"
                ></path></svg
            ></span>
            <span class="dine-left-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="51"
                viewBox="0 0 14 51"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M.452 25.712c0-8.333 4.333-16.666 13-25v50c-8.667-8.333-13-16.666-13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-right-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="50"
                viewBox="0 0 14 50"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M13.973 25.005c0-8.333-4.333-16.666-13-25v50c8.667-8.333 13-16.666 13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-right_side-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="50"
                viewBox="0 0 14 50"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M13.973 25.005c0-8.333-4.333-16.666-13-25v50c8.667-8.333 13-16.666 13-25z"
                ></path></svg
            ></span>
            <div class="sitting-tbl-long" id="table-14">
              <span class="availble-seat"></span
              ><span class="tbl-number">14</span>
            </div>
          </div>
          <div
            class="sitting-image dine-large ten-chairs sevn"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-top-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005.866c8.334 0 16.667 4.333 25 13h-50c8.334-8.667 16.667-13 25-13z"
                ></path>
              </svg>
            </span>
            <span class="dine-top-full-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005.866c8.334 0 16.667 4.333 25 13h-50c8.334-8.667 16.667-13 25-13z"
                ></path>
              </svg>
            </span>
            <span class="dine-top-left-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005.866c8.334 0 16.667 4.333 25 13h-50c8.334-8.667 16.667-13 25-13z"
                ></path>
              </svg>
            </span>
            <span class="dine-bottom-full-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"
                ></path>
              </svg>
            </span>
            <span class="dine-bottom-right-full-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"
                ></path>
              </svg>
            </span>
            <span class="dine-bottom-right-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"
                ></path>
              </svg>
            </span>
            <span class="dine-bottom-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"
                ></path>
              </svg>
            </span>
            <div class="sitting-tbl-large medium" id="table-15">
              <span class="availble-seat"></span
              ><span class="tbl-number">15</span>
            </div>
          </div>
          <div
            class="sitting-image dine-large ten-chairs"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-top-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005.866c8.334 0 16.667 4.333 25 13h-50c8.334-8.667 16.667-13 25-13z"
                ></path>
              </svg>
            </span>
            <span class="dine-top-full-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005.866c8.334 0 16.667 4.333 25 13h-50c8.334-8.667 16.667-13 25-13z"
                ></path>
              </svg>
            </span>
            <span class="dine-top-left-full-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005.866c8.334 0 16.667 4.333 25 13h-50c8.334-8.667 16.667-13 25-13z"
                ></path>
              </svg>
            </span>

            <span class="dine-top-left-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005.866c8.334 0 16.667 4.333 25 13h-50c8.334-8.667 16.667-13 25-13z"
                ></path>
              </svg>
            </span>
            <span class="dine-left-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="51"
                viewBox="0 0 14 51"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M.452 25.712c0-8.333 4.333-16.666 13-25v50c-8.667-8.333-13-16.666-13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-right-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="50"
                viewBox="0 0 14 50"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M13.973 25.005c0-8.333-4.333-16.666-13-25v50c8.667-8.333 13-16.666 13-25z"
                ></path>
              </svg>
            </span>
            <span class="dine-bottom-right-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"
                ></path>
              </svg>
            </span>
            <span class="dine-bottom-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"
                ></path>
              </svg>
            </span>
            <span class="dine-bottom-right-full-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"
                ></path>
              </svg>
            </span>
            <span class="dine-bottom-full-img"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="14"
                viewBox="0 0 50 14"
              >
                <path
                  fill="#E4E8F1"
                  fill-rule="evenodd"
                  d="M25.005 13.266c8.334 0 16.667-4.333 25-13h-50c8.334 8.667 16.667 13 25 13z"
                ></path>
              </svg>
            </span>
            <div class="sitting-tbl-large full" id="table-16">
              <span class="availble-seat"></span
              ><span class="tbl-number">16</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tables',
  props: {},
  components: {},
}
</script>
