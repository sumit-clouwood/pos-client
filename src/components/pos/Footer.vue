<!-- eslint-disable -->
<template>
  <div class="footer">
    <div class="footer-slider color-dashboard-background">
      <div v-show="carhop || waiter">
        <ul class="common-menu">
          <li
            class="color-secondary active"
            data-toggle="modal"
            data-target="#add-note"
          >
            <a class="color-text-invert" role="button">
              <!--<img src="images/footer-images/a.png" alt="customer">-->
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="pen-square"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="svg-inline--fa fa-pen-square fa-w-14 fa-2x"
              >
                <path
                  fill="currentColor"
                  d="M400 480H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zM238.1 177.9L102.4 313.6l-6.3 57.1c-.8 7.6 5.6 14.1 13.3 13.3l57.1-6.3L302.2 242c2.3-2.3 2.3-6.1 0-8.5L246.7 178c-2.5-2.4-6.3-2.4-8.6-.1zM345 165.1L314.9 135c-9.4-9.4-24.6-9.4-33.9 0l-23.1 23.1c-2.3 2.3-2.3 6.1 0 8.5l55.5 55.5c2.3 2.3 6.1 2.3 8.5 0L345 199c9.3-9.3 9.3-24.5 0-33.9z"
                  class
                ></path>
              </svg>
              <span>{{ _t('Add Note') }}</span>
            </a>
          </li>
        </ul>
      </div>
      <div v-show="!carhop && !waiter">
        <ul class="footer-slider-list ullist-icons">
          <li
            class="footer-slider-list-item color-secondary"
            data-toggle="modal"
            :class="[{ deactive_class: !enabled(CONST.MODULE_CRM) }]"
            data-target="#manage-customer"
            @click="calculateHeights()"
            v-if="!cashier_walkin && enabled(CONST.MODULE_CRM)"
          >
            <a
              class="footer-slider-list-item-link color-text-invert"
              role="button"
            >
              <!--<img src="images/footer-images/user.svg" alt="customer">-->
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="user"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="svg-inline--fa fa-user fa-w-14 fa-2x"
              >
                <path
                  fill="currentColor"
                  d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"
                  class
                ></path>
              </svg>
              <span>{{ _t('Customer') }}</span>
            </a>
          </li>
          <!-- <li
            v-if="cartType === 'new' && orderType.OTApi !== 'dine_in'"
            @click="viewHoldOrders"
            class="footer-slider-list-item footer-slider-list-item-open-orders color-secondary"
            :class="[{ active: vbutton === 'hold' }]"
            id="hold-order-box"
          >
            <a
              class="footer-slider-list-item-link color-text-invert"
              role="button"
            >
               <svg
                fill="#fff"
                viewBox="-45 0 327 327"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m158 0h71c4.417969 0 8 3.582031 8 8v311c0 4.417969-3.582031 8-8 8h-71c-4.417969 0-8-3.582031-8-8v-311c0-4.417969 3.582031-8 8-8zm0 0"
                />
                <path
                  d="m8 0h71c4.417969 0 8 3.582031 8 8v311c0 4.417969-3.582031 8-8 8h-71c-4.417969 0-8-3.582031-8-8v-311c0-4.417969 3.582031-8 8-8zm0 0"
                />
              </svg>
              <span>{{ _t('Hold Orders') }}</span>
            </a>
          </li>
          <li
            v-else
            @click="newOrders"
            class="footer-slider-list-item footer-slider-list-item-open-orders color-secondary"
            :class="[
              {
                active: vbutton === 'new',
              },
            ]"
            id="new-order-box"
          >
            <a
              class="footer-slider-list-item-link color-text-invert"
              role="button"
            >
               <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="play"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="svg-inline--fa fa-play fa-w-14 fa-2x"
              >
                <path
                  fill="currentColor"
                  d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"
                  class=""
                ></path>
              </svg>
              <span>{{ _t('New Orders') }}</span>
            </a>
          </li> -->
          <template v-if="enabled(CONST.MODULE_LOYALTY)">
            <li
              data-toggle="modal"
              :data-target="loaylty_apply_modal"
              class="footer-slider-list-item color-secondary"
              :class="[{ loyaltyApplied: loyaltyCard }]"
              @click="loyaltyHendlerChange"
            >
              <a
                role="button"
                class="footer-slider-list-item-link color-text-invert"
              >
                <svg
                  v-if="!loyaltyCard"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  viewBox="0 0 448 512"
                  style="enable-background:new 0 0 512 512;"
                  xml:space="preserve"
                  fill="#fff"
                >
                  <g>
                    <g>
                      <path
                        d="M47.054,302h-32c-8.291,0-15,6.709-15,15v180c0,8.291,6.709,15,15,15h32c24.814,0,45-20.186,45-45V347
        C92.054,322.186,71.869,302,47.054,302z"
                      />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path
                        d="M507.554,331.099c-1.8-2.999-4.199-5.4-6.899-7.5c-11.045-9.662-29.654-8.749-40.499,3.001l-68.101,78.6l-2.1,2.399
        c-8.399,9.3-20.4,14.401-32.999,14.401h-116.4c-8.401,0-15-6.601-15-15c0-8.401,6.599-15,15-15h91.5c16.5,0,30-13.5,30-30v-0.3
        c-0.3-16.5-13.5-29.7-30-29.7h-54.3c-8.996,0-18.636-3.303-26.4-9.901c-36.599-32.1-90-34.2-129.3-6.899v184.499
        c29.7,8.101,60.3,12.301,91.199,12.301h133.801c32.999,0,64.2-15.601,84-42.001l72.001-96
        C513.56,360.21,514.352,341.3,507.554,331.099z"
                      />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path
                        d="M402.264,28.995C385.627,10.297,362.564,0,337.324,0c-28.172,0-52.593,13.321-70.622,38.522
        c-1.352,1.889-2.617,3.779-3.802,5.649c-1.184-1.871-2.449-3.76-3.801-5.649C241.07,13.321,216.649,0,188.477,0
        c-25.24,0-48.303,10.297-64.939,28.994C107.75,46.738,99.054,70.459,99.054,95.788c0,27.525,10.681,52.924,33.611,79.934
        c20.009,23.565,48.708,47.788,81.938,75.836c12.28,10.365,24.979,21.083,38.473,32.778c2.819,2.443,6.321,3.665,9.824,3.665
        c3.502,0,7.005-1.222,9.824-3.665c13.492-11.693,26.189-22.41,38.469-32.773c21.342-18.014,39.773-33.57,55.767-48.66
        c31.053-29.298,59.787-62.553,59.787-107.114C426.747,70.46,418.052,46.739,402.264,28.995z"
                      />
                    </g>
                  </g>
                </svg>
                <!--<img
                  src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/loyalty.svg"
                  :alt="_t('Loyalty')"
                  v-if="!loyaltyCard"
                />-->
                <span v-if="!loyaltyCard">{{ _t('Loyalty') }}</span>
                <span v-if="loyaltyCard">
                  <span>
                    {{
                      isNaN(loyaltyCard.balance)
                        ? 0
                        : formatPrice(loyaltyCard.balance)
                    }}
                    {{ _t('Loyalty') }}</span
                  >
                  <br />
                  <span class="shorten-sentence">
                    {{ selectedCustomer }}
                  </span>
                  <!--<br />
                <span>{{ selectedCustomer }}</span>-->
                </span>
              </a>
            </li>
          </template>
          <template>
            <li
                data-toggle="modal"
                data-target="#credit-customer"
                class="footer-slider-list-item color-secondary"
                @click="creditCustomerAction"
            >
              <a
                  role="button"
                  class="footer-slider-list-item-link color-text-invert"
              >
                <svg
                    v-if="!creditCustomer"
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 448 512"
                    style="enable-background:new 0 0 512 512;"
                    xml:space="preserve"
                    fill="#fff"
                >
                  <g>
		<path d="M434.717,123.98c0-22.231-18.021-40.251-40.251-40.251H40.251C18.021,83.729,0,101.75,0,123.98v35.247h434.717V123.98
			L434.717,123.98z"/>
                    <path d="M402.391,253.235c-0.978-0.978-2.56-0.978-3.535,0l-38.537,38.535l-15.392-15.39c-0.938-0.938-2.598-0.938-3.534,0
			l-14.144,14.144c-0.469,0.469-0.731,1.104-0.731,1.768s0.264,1.299,0.731,1.768l31.301,31.299
			c0.488,0.488,1.127,0.732,1.769,0.732c0.639,0,1.279-0.244,1.768-0.732l54.447-54.445c0.469-0.469,0.732-1.104,0.732-1.769
			c0-0.663-0.265-1.299-0.732-1.769L402.391,253.235z"/>
                    <path d="M372.023,188.502c-18.222,0-35.312,4.912-50.029,13.475H0v122.11c0,22.229,18.021,40.251,40.251,40.251h267.227
			c17.414,14.805,39.954,23.75,64.547,23.75c55.025,0,99.793-44.766,99.793-99.793C471.816,233.269,427.05,188.502,372.023,188.502z
			 M148.392,309.309c0,2.852-2.313,5.164-5.164,5.164H63.604c-2.852,0-5.165-2.312-5.165-5.164v-15.71
			c0-2.853,2.313-5.165,5.165-5.165h79.624c2.852,0,5.164,2.312,5.164,5.165V309.309L148.392,309.309z M372.023,351.547
			c-34.935,0-63.251-28.318-63.251-63.251s28.316-63.25,63.251-63.25c34.933,0,63.25,28.318,63.25,63.25
			S406.956,351.547,372.023,351.547z"/>
	</g>
                </svg>
                <span v-if="!creditCustomer">{{ _t('Credit Customer') }}</span>
                <span v-if="creditCustomer">
                  <span>
                    100
                    {{ _t('creditCustomer') }}</span
                  >
                  <br />
                  <span class="shorten-sentence">
                    {{ selectedCustomer }}
                  </span>
                  <!--<br />
                <span>{{ selectedCustomer }}</span>-->
                </span>
              </a>
            </li>
          </template>
          <li
            class="footer-slider-list-item color-secondary"
            data-toggle="modal"
            data-dismiss="modal"
            :class="{ deactive_class: !isBrandHasDeliveryOrder }"
            v-if="!cashier_walkin && enabled(CONST.MODULE_CRM)"
            @click="add_customer_address"
          >
            <!--<a
            class="footer-slider-list-item-link"
            role="button"
            @click="setOrderType({ OTview: 'Delivery', OTApi: 'call_center' })"
          >-->
            <a
              class="footer-slider-list-item-link color-text-invert"
              role="button"
            >
              <!--<img src="images/footer-images/d_2.png" alt="customer">-->
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="suitcase"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="svg-inline--fa fa-suitcase fa-w-16 fa-2x"
              >
                <path
                  fill="currentColor"
                  d="M128 480h256V80c0-26.5-21.5-48-48-48H176c-26.5 0-48 21.5-48 48v400zm64-384h128v32H192V96zm320 80v256c0 26.5-21.5 48-48 48h-48V128h48c26.5 0 48 21.5 48 48zM96 480H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48h48v352z"
                  class
                ></path>
              </svg>
              <span>{{ _t('Send to Delivery') }}</span>
            </a>
          </li>
          <li
            class="footer-slider-list-item color-secondary active"
            data-toggle="modal"
            data-target="#select-discount"
            id="discount-footer"
            @click="discountHeights()"
          >
            <a
              class="footer-slider-list-item-link color-text-invert"
              role="button"
            >
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="badge-percent"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="svg-inline--fa fa-badge-percent fa-w-16 fa-2x"
              >
                <path
                  fill="currentColor"
                  d="M512 256c0-37.7-23.7-69.9-57.1-82.4 14.7-32.4 8.8-71.9-17.9-98.6-26.7-26.7-66.2-32.6-98.6-17.9C325.9 23.7 293.7 0 256 0s-69.9 23.7-82.4 57.1c-32.4-14.7-72-8.8-98.6 17.9-26.7 26.7-32.6 66.2-17.9 98.6C23.7 186.1 0 218.3 0 256s23.7 69.9 57.1 82.4c-14.7 32.4-8.8 72 17.9 98.6 26.6 26.6 66.1 32.7 98.6 17.9 12.5 33.3 44.7 57.1 82.4 57.1s69.9-23.7 82.4-57.1c32.6 14.8 72 8.7 98.6-17.9 26.7-26.7 32.6-66.2 17.9-98.6 33.4-12.5 57.1-44.7 57.1-82.4zm-320-96c17.67 0 32 14.33 32 32s-14.33 32-32 32-32-14.33-32-32 14.33-32 32-32zm12.28 181.65c-6.25 6.25-16.38 6.25-22.63 0l-11.31-11.31c-6.25-6.25-6.25-16.38 0-22.63l137.37-137.37c6.25-6.25 16.38-6.25 22.63 0l11.31 11.31c6.25 6.25 6.25 16.38 0 22.63L204.28 341.65zM320 352c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"
                  class
                ></path>
              </svg>
              <span>{{ _t('Select') + ' ' + _t('Discount') }}</span>
            </a>
          </li>
          <template
            v-if="
              allowed(PERMS.CAN_REMOVE_SURCHRAGES) ||
                allowed(PERMS.CAN_REMOVE_DELIVERY_SURCHRAGES)
            "
          >
            <li
              class="footer-slider-list-item color-secondary"
              data-toggle="modal"
              id="remove-surcharge"
              @click="removeSurchargeFromOrder"
            >
              <a
                class="footer-slider-list-item-link color-text-invert"
                role="button"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="badge-percent"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  class="svg-inline--fa fa-badge-percent fa-w-16 fa-2x"
                  style=" fill: #fff;"
                >
                  <g>
                    <g>
                      <path
                        d="M319.266,295.133L127.052,102.919c6.014-10.166,9.481-22.008,9.481-34.652C136.533,30.622,105.911,0,68.267,0
			S0,30.622,0,68.267s30.622,68.267,68.267,68.267c12.643,0,24.486-3.467,34.652-9.481l192.215,192.215
			c3.333,3.333,7.699,4.999,12.066,4.999s8.734-1.667,12.066-5C325.932,312.6,325.932,301.799,319.266,295.133z M92.429,92.353
			c-0.013,0.013-0.026,0.023-0.04,0.035c-0.014,0.013-0.023,0.026-0.035,0.04c-6.178,6.159-14.694,9.971-24.087,9.971
			c-18.822,0-34.133-15.311-34.133-34.133s15.311-34.133,34.133-34.133S102.4,49.444,102.4,68.267
			C102.4,77.659,98.587,86.175,92.429,92.353z"
                      />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path
                        d="M319.266,22.067c-6.666-6.666-17.467-6.666-24.133,0L194.799,122.401l24.133,24.133L319.266,46.201
			C325.934,39.533,325.934,28.733,319.266,22.067z"
                      />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path
                        d="M146.533,218.932L122.4,194.8l-19.481,19.482c-10.166-6.015-22.009-9.482-34.652-9.482C30.622,204.8,0,235.422,0,273.067
			c0,37.645,30.622,68.267,68.267,68.267s68.267-30.622,68.267-68.267c0-12.644-3.467-24.486-9.481-34.652L146.533,218.932z
			 M68.267,307.2c-18.822,0-34.133-15.311-34.133-34.133c0-18.822,15.311-34.133,34.133-34.133c9.392,0,17.909,3.813,24.087,9.971
			c0.013,0.013,0.023,0.026,0.035,0.04s0.026,0.023,0.04,0.035c6.159,6.178,9.971,14.694,9.971,24.087
			C102.4,291.889,87.089,307.2,68.267,307.2z"
                      />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path
                        d="M494.933,170.667H243.067L343.401,271c9.677,9.667,14.999,22.522,14.999,36.2s-5.323,26.533-15,36.2
			c-9.667,9.678-22.522,15-36.2,15s-26.533-5.323-36.2-15L170.667,243.067v251.866c0,9.422,7.645,17.067,17.067,17.067h307.2
			c9.422,0,17.067-7.645,17.067-17.067v-307.2C512,178.311,504.355,170.667,494.933,170.667z M204.8,324.267
			c0-9.422,7.645-17.067,17.067-17.067c9.422,0,17.067,7.645,17.067,17.067V358.4c0,9.422-7.645,17.067-17.067,17.067
			c-9.422,0-17.067-7.645-17.067-17.067V324.267z M256,477.867h-34.133c-9.422,0-17.067-7.645-17.067-17.067v-34.133
			c0-9.422,7.645-17.067,17.067-17.067c9.422,0,17.067,7.645,17.067,17.067v17.067H256c9.422,0,17.067,7.645,17.067,17.067
			C273.067,470.222,265.422,477.867,256,477.867z M358.4,477.867h-34.133c-9.422,0-17.067-7.645-17.067-17.067
			c0-9.422,7.645-17.067,17.067-17.067H358.4c9.422,0,17.067,7.645,17.067,17.067C375.467,470.222,367.822,477.867,358.4,477.867z
			 M358.4,238.933h-34.133c-9.422,0-17.067-7.645-17.067-17.067c0-9.422,7.645-17.067,17.067-17.067H358.4
			c9.422,0,17.067,7.645,17.067,17.067C375.467,231.289,367.822,238.933,358.4,238.933z M477.867,460.8
			c0,9.422-7.645,17.067-17.067,17.067h-34.133c-9.422,0-17.067-7.645-17.067-17.067c0-9.422,7.645-17.067,17.067-17.067h17.067
			v-17.067c0-9.422,7.645-17.067,17.067-17.067c9.422,0,17.067,7.645,17.067,17.067V460.8z M477.867,358.4
			c0,9.422-7.645,17.067-17.067,17.067c-9.422,0-17.067-7.645-17.067-17.067v-34.133c0-9.422,7.645-17.067,17.067-17.067
			c9.422,0,17.067,7.645,17.067,17.067V358.4z M477.867,256c0,9.422-7.645,17.067-17.067,17.067
			c-9.422,0-17.067-7.645-17.067-17.067v-17.067h-17.067c-9.422,0-17.067-7.645-17.067-17.067c0-9.422,7.645-17.067,17.067-17.067
			H460.8c9.422,0,17.067,7.645,17.067,17.067V256z"
                      />
                    </g>
                  </g>
                </svg>
                <span>{{ _t('Remove Surcharge') }}</span>
              </a>
            </li>
          </template>

          <li
              class="footer-slider-list-item color-secondary"
              data-toggle="modal"
              data-target="#dining-option"
              v-if="!cashier_walkin"
          >
            <a
                class="footer-slider-list-item-link color-text-invert"
                role="button"
            >
              <!--<img src="images/footer-images/group_9.png" alt="customer">-->
              <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="utensils"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 416 512"
                  class="svg-inline--fa fa-utensils fa-w-13 fa-2x"
              >
                <path
                    fill="currentColor"
                    d="M207.9 15.2c.8 4.7 16.1 94.5 16.1 128.8 0 52.3-27.8 89.6-68.9 104.6L168 486.7c.7 13.7-10.2 25.3-24 25.3H80c-13.7 0-24.7-11.5-24-25.3l12.9-238.1C27.7 233.6 0 196.2 0 144 0 109.6 15.3 19.9 16.1 15.2 19.3-5.1 61.4-5.4 64 16.3v141.2c1.3 3.4 15.1 3.2 16 0 1.4-25.3 7.9-139.2 8-141.8 3.3-20.8 44.7-20.8 47.9 0 .2 2.7 6.6 116.5 8 141.8.9 3.2 14.8 3.4 16 0V16.3c2.6-21.6 44.8-21.4 48-1.1zm119.2 285.7l-15 185.1c-1.2 14 9.9 26 23.9 26h56c13.3 0 24-10.7 24-24V24c0-13.2-10.7-24-24-24-82.5 0-221.4 178.5-64.9 300.9z"
                    class
                ></path>
              </svg>
              <span>{{ _t('Dinning Options') }}</span>
            </a>
          </li>

          <li
            class="footer-slider-list-item color-secondary"
            data-toggle="modal"
            data-target="#add-note"
          >
            <a
              class="footer-slider-list-item-link color-text-invert"
              role="button"
            >
              <!--<img src="images/footer-images/a.png" alt="customer">-->
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="pen-square"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="svg-inline--fa fa-pen-square fa-w-14 fa-2x"
              >
                <path
                  fill="currentColor"
                  d="M400 480H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zM238.1 177.9L102.4 313.6l-6.3 57.1c-.8 7.6 5.6 14.1 13.3 13.3l57.1-6.3L302.2 242c2.3-2.3 2.3-6.1 0-8.5L246.7 178c-2.5-2.4-6.3-2.4-8.6-.1zM345 165.1L314.9 135c-9.4-9.4-24.6-9.4-33.9 0l-23.1 23.1c-2.3 2.3-2.3 6.1 0 8.5l55.5 55.5c2.3 2.3 6.1 2.3 8.5 0L345 199c9.3-9.3 9.3-24.5 0-33.9z"
                  class
                ></path>
              </svg>
              <span>{{ _t('Add Note') }}</span>
            </a>
          </li>
          <open-item-button></open-item-button>
        </ul>
      </div>
    </div>
    <div class="footer-buttons color-dashboard-background">
      <div :class="{ active: items.length > 0 }">
        <div
          v-if="orderType.OTApi === 'dine_in'"
          class="dinein-order pay-btn-holder"
        >
          <dinein-btn></dinein-btn>
        </div>
        <div
          v-else-if="orderType.OTApi === 'call_center'"
          class="crm-order pay-btn-holder"
        >
          <crm-btn></crm-btn>
        </div>
        <div
          v-else-if="orderType.OTApi === 'carhop' && enabled(CONST.MODULE_CARHOP)"
          class="carhop-order pay-btn-holder"
        >
          <carhop-btn></carhop-btn>
        </div>
        <div v-else class="walkin-order template-btn">
          <walkin-btn></walkin-btn>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" id="transparent-screen"></div>

    <!--All popup including online order, because we need to apply few js which are not on header so all popups will be here-->
    <DineIn />
    <openItem />
    <generic-open-item></generic-open-item>
    <AddNote />
    <item-note></item-note>
    <Discount />
    <Referral />
    <SendToDelivery />
    <ManageCustomer v-if="online" />
    <OfflineManageCustomer v-else />
    <OrderItemPopup />
    <CustomerCreate />
    <CreateCustomerAddress />
    <CartItemDiscount />
    <SelectCustomerAddress />
    <CustomerInformation />
    <CustomerNote />
    <CustomerNotes />
    <CartAddEmail />
    <CartAmountChange />
    <amount-error></amount-error>
    <ModificationPermissions v-if="needSupervisorAccess" />
    <create-loyalty-customer></create-loyalty-customer>
    <CartPaymentMsg />
    <CartTipAmount />
    <GiftCard />
    <Card />
    <GiftCardInfo />
    <SearchLoyaltyCustomer />
    <Loyalty />
    <Invoice />
    <OrderDetailsPopup />
    <InformationPopup :responseInformation="this.message" :title="this.title" />
    <combox-box></combox-box>
    <UpSelliing />
    <DineInCoverSelection
      v-if="brand && brand.number_of_covers && covers && cartType !== 'hold'"
    />
    <DineInTableSelection
      v-if="brand && brand.move_table && availableTables && cartType !== 'hold'"
    />
    <alert-popup></alert-popup>
    <scale-popup></scale-popup>
    <item-delivery-time-slots></item-delivery-time-slots>
    <credit-customer></credit-customer>
  </div>
</template>

<script>
import { bus } from '@/eventBus'
import Invoice from '../pos/content/cart/payNow/Invoice'
import DineIn from './footer/popups/DineIn'
import AddNote from './footer/popups/AddNote'
import itemNote from './footer/popups/itemNote'
import Discount from './footer/popups/Discount'
import SendToDelivery from './footer/popups/SendToDelivery'
import ManageCustomer from './footer/popups/ManageCustomer'
import OfflineManageCustomer from './footer/popups/OfflineManageCustomer'
import CartItemDiscount from './footer/popups/CartItemDiscount'
import OrderItemPopup from './content/cart/newOrders/items/Popup'
import CustomerNote from '../pos/footer/popups/ManageCustomer/CustomerNote'
import CustomerCreate from '../pos/footer/popups/ManageCustomer/CustomerCreate'
import CreateCustomerAddress from './footer/popups/ManageCustomer/CustomerAddress/CreateCustomerAddress'
import CartAddEmail from '../pos/content/cart/payNow/popups/AddEmail'
import CartAmountChange from '../pos/content/cart/payNow/popups/AmountChange'
import AmountError from '../pos/content/cart/payNow/popups/AmountError'
import CartPaymentMsg from '../pos/content/cart/payNow/popups/PaymentMsg'
import CartTipAmount from '../pos/content/cart/payNow/popups/TipAmount'
import CustomerInformation from './footer/popups/ManageCustomer/CustomerInformation'
import CustomerNotes from './footer/popups/ManageCustomer/CustomerInformation/CustomerNotes'
import SelectCustomerAddress from '../pos/footer/popups/ManageCustomer/CustomerAddress/SelectCustomerAddress'
import GiftCard from '../pos/content/cart/newOrders/popup/GiftCard.vue'
import Card from '../pos/content/cart/newOrders/popup/Card.vue'
import GiftCardInfo from '../pos/content/cart/newOrders/popup/GiftCardInfo.vue'
import SearchLoyaltyCustomer from '../pos/footer/popups/SearchLoyaltyCustomer'
import Loyalty from '../pos/content/cart/newOrders/popup/Loyalty.vue'
import OrderDetailsPopup from '@/components/pos/content/OrderDetailPopup'
import InformationPopup from '@/components/pos/content/InformationPopup'
import AlertPopup from '@/components/pos/content/Alert'
import ModificationPermissions from '@/components/pos/content/orderDetails/ModificationPermissions'
import DineinBtn from './footer/buttons/cart/dinein'
import CrmBtn from './footer/buttons/cart/crm'
import WalkinBtn from './footer/buttons/cart/walkin'
import CarhopBtn from './footer/buttons/cart/carhop'
import openItemButton from '@/components/pos/openItem/button'
import openItem from '@/components/pos/openItem/item'
import ComboxBox from '@/components/pos/content/catalog/comboBox/ComboBox'
import UpSelliing from '@/components/pos/content/catalog/upSelling/UpSelling'

import genericOpenItem from '@/components/pos/openItem/genericItem'
import DineInTableSelection from '@/components/dinein/cart/popup/DineInTableSelection'
import DineInCoverSelection from '@/components/dinein/cart/popup/DineInCoverSelection.vue'
import ScalePopup from '@/components/pos/content/catalog/items/popup/ScalePopup.vue'

import * as CONST from '@/constants'

import { mapState, mapGetters, mapActions } from 'vuex'
import Referral from '@/components/pos/footer/popups/Referrals'
import CreateLoyaltyCustomer from '@/components/pos/footer/popups/ManageCustomer/CreateLoyaltyCustomer'
import ItemDeliveryTimeSlots from '@/components/pos/content/cart/newOrders/items/popup/footer/buttons/ItemDeliveryTimeSlots'
import CreditCustomer from './footer/popups/CreditCustomer'
/* global $ */
export default {
  name: 'Footer',
  props: {},
  components: {
    CreditCustomer,
    ItemDeliveryTimeSlots,
    CreateLoyaltyCustomer,
    Referral,
    DineIn,
    AddNote,
    itemNote,
    Discount,
    CustomerNote,
    ManageCustomer,
    OfflineManageCustomer,
    SendToDelivery,
    OrderItemPopup,
    CustomerCreate,
    CreateCustomerAddress,
    CartItemDiscount,
    SelectCustomerAddress,
    CustomerInformation,
    CustomerNotes,
    CartAddEmail,
    CartAmountChange,
    AmountError,
    CartPaymentMsg,
    CartTipAmount,
    GiftCard,
    Card,
    GiftCardInfo,
    SearchLoyaltyCustomer,
    Loyalty,
    Invoice,
    OrderDetailsPopup,
    InformationPopup,
    AlertPopup,
    ModificationPermissions,
    DineinBtn,
    CrmBtn,
    WalkinBtn,
    CarhopBtn,
    openItemButton,
    openItem,
    ComboxBox,
    UpSelliing,
    genericOpenItem,
    DineInTableSelection,
    DineInCoverSelection,
    ScalePopup,
  },
  data() {
    return {
      vbutton: '',
      title: '',
      status: 0,
      message: '',
      loaylty_apply_modal: '#search-loyalty-customer',
      slide_to_show: 5,
      creditCustomer: false,
    }
  },
  computed: {
    ...mapState('checkout', ['print', 'paymentMsgStatus']),
    ...mapState('customer', ['responseInformation', 'isBrandHasDeliveryOrder']),
    ...mapState('order', [
      'orderType',
      'cartType',
      'items',
      'is_pay',
      'orderId',
      'needSupervisorAccess',
    ]),
    ...mapState('location', ['brand']),
    ...mapState('dinein', ['availableTables', 'covers']),
    ...mapState('sync', ['online']),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('modules', ['enabled']),
    ...mapState({
      loyaltyCard: state => state.customer.customerLoyalty.card,
      paymentError: state => state.checkoutForm.error,
    }),
    ...mapState({ selectedCustomer: state => state.customer.customer.name }),
    ...mapGetters('auth', ['waiter', 'carhop', 'allowed', 'cashier_walkin']),
  },

  watch: {
    $route(to, from) {
      // react to route changes...
      if (to !== from) {
        if (this.$route.name.match('Carhop')) {
          this.$store.commit('order/ORDER_TYPE', {
            OTview: 'Carhop',
            OTApi: CONST.ORDER_TYPE_CARHOP,
          })
        }
      }
    },
    orderType() {
      this.$nextTick(() => {
        $('ul.ullist-icons').slick('refresh')
      })
    },
    // paymentMsgStatus(newVal) {
    //   if (newVal) {
    //     if (this.$store.getters['checkout/complete']) {
    //       if (this.$store.state.order.orderType.OTApi === 'dine_in') {
    //         $('#payment-msg').modal('hide')
    //         this.$router.replace({ name: 'Dinein' })
    //       }
    //       this.$store.commit('checkout/PAYMENT_MSG_STATUS', false)
    //     }
    //   }
    // },
  },
  methods: {
    calculateHeights() {
      this.$store.dispatch('customer/fetchCustomers')
      bus.$emit('check-height')
    },
    discountHeights() {
      bus.$emit('check-discount-height')
    },
    setOrderType(opt) {
      this.$store.commit('order/ORDER_TYPE', opt)
    },
    viewHoldOrders() {
      this.vbutton = 'new'
      this.$store.commit('order/SET_CART_TYPE', 'hold')
      this.$store.dispatch('holdOrders/getHoldOrders')
    },

    loyaltyHendlerChange() {
      if (this.online) {
        this.loaylty_apply_modal = '#search-loyalty-customer'
        this.$store.dispatch('loyaltyHendlerChange')
      } else {
        this.loaylty_apply_modal = ''
        this.$store.commit('order/setAlert', {
          type: 'error',
          title: this._t('Check your network connection'),
          msg: this._t('Loyalty will not work on offline mode'),
        })
        $('#alert-popup').modal('show')
        this.$store.commit('checkoutForm/forceCash', true)
        return false
      }
    },
    creditCustomerAction() {
      /**/
    },
    newOrders() {
      this.vbutton = 'hold'
      this.$store.commit('order/SET_CART_TYPE', 'new')
    },
    add_customer_address() {
      this.calculateHeights()
      this.setOrderType({ OTview: 'Delivery', OTApi: 'call_center' })
      if (this.$store.state.customer.address === false) {
        $('#manage-customer').modal()
      } else {
        $('#order-confirmation').modal()
      }
    },
    slicker() {
      let scope = this
      $('ul.ullist-icons').slick({
        slidesToShow: scope.slide_to_show,
        slidesToScroll: 4,
        accessibility: false,
        dots: false,
        arrows: true,
        nextArrow:
          '<img class="next-btn" src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/next-arrow.png"/>',
        prevArrow:
          '<img class="back-btn" src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/back-arrow.png"/>',
      })

      $('.next-btn').click()
      setTimeout(function() {
        $('.back-btn').click()
      }, 1000)
    },
    removeSurchargeFromOrder() {
      this.removeSurcharge()
    },
    ...mapActions('surcharge', ['removeSurcharge']),
  },
  mounted() {
    this.$store.commit('dinein/KITCHEN_PRINT', true)
    if (!this.enabled(CONST.MODULE_CRM)) {
      this.slide_to_show = 4
    }
    if (this.cashier_walkin === true) {
      this.slide_to_show = 4
    }
    if (window.location.href.indexOf('dine-in') > -1) {
      this.setOrderType({ OTview: 'Dine In', OTApi: 'dine_in' })
    }
    this.$nextTick(() => {
      this.slicker()
    })
  },
}
</script>

<style scoped>
.displayBlock {
  display: inline-block;
}
.hide {
  display: none !important;
}
.deactive_class {
  /*background: rgba(250, 248, 248, 0.97) !important;*/
  opacity: 0.5;
  pointer-events: none;
}
</style>
<style lang="sass" scoped>
.button
  .inactive
    background-color: #ccc
    cursor: not-allowed
  .waiter
    background-color: #fff

.common-menu
  margin-left: 1.25rem

  li
    cursor: pointer
    background-color: #4b4e53
    color: #fff
    height: 3.75rem
    display: grid!important
    -webkit-box-align: center
    -ms-flex-align: center
    -webkit-box-pack: center
    -ms-flex-pack: center
    grid-template-columns: auto
    align-items: center
    justify-content: center
    -webkit-transition: .2s linear
    transition: .2s linear
    width: 122px
    margin-right: 1.875rem
    border-radius: 3px
    overflow: hidden

    &.active
      background-color: #5056ca
      border-color: #5056ca

    a
      color: #fff
      font-size: .75rem
      display: grid
      grid-template-columns: 1fr
      text-align: center

      svg
        width: .75rem
        margin: .3125rem auto
</style>
<style lang="scss" scoped>
.button {
  &.waiter {
    background-color: #fff !important;
  }
}
</style>
