<template>
    <div :class="['manage-customer-wrapper', {active: openManageCustomerHendler}]">
        <div class="manage-customer">
            <div class="manage-customer-header">
                <div class="header-title">Manage Customers</div>
                <div class="header-btn-close" @click="openManageCustomer">✖</div>
            </div>
            <div class="manage-customer-search">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4ZM2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11C20 15.9706 15.9706 20 11 20C6.02944 20 2 15.9706 2 11Z"
                            fill="#4B4E53"
                    ></path>
                    <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M15.9428 15.9429C16.3333 15.5524 16.9665 15.5524 17.357 15.9429L21.707 20.2929C22.0975 20.6834 22.0975 21.3166 21.707 21.7071C21.3165 22.0977 20.6833 22.0977 20.2928 21.7071L15.9428 17.3571C15.5523 16.9666 15.5523 16.3334 15.9428 15.9429Z"
                            fill="#4B4E53"
                    ></path>
                </svg>
                <input class="manage-customer-search" type="text" placeholder="Search or scan for items">
            </div>
            <div class="manage-customer-body">
                <div class="customer-list">
                    <div class="wrapper" v-for="(item, key) in customerList" :key="key">
                        <div :class="['customer-list-item', {active: item.class}]">
                            <div class="item-cell">
                                <div class="item-title">Customer Name</div>
                                <div class="item-text">{{item.name}}</div>
                                <div class="item-title">Email</div>
                                <div class="item-text">{{item.email}}</div>
                                <div class="item-title">CITY LOCATION</div>
                                <div class="item-text">{{item.location}}</div>
                            </div>
                            <div class="item-cell">
                                <div class="item-title">Phone#</div>
                                <div class="item-text">{{item.phone}}</div>
                                <div class="item-title">REF. CODE</div>
                                <div class="item-text">{{item.refCode}}</div>
                                <div class="item-btn" @click="item.class = !item.class">{{item.class ? 'Short' :
                                    'More'}}
                                </div>
                            </div>
                            <div class="item-cell">
                                <div class="item-article display-order-btn">
                                    <svg
                                            width="16"
                                            height="12"
                                            viewBox="0 0 16 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                                d="M14.75 2.24999H5C4.55 2.24999 4.25 1.94999 4.25 1.49999C4.25 1.04999 4.55 0.749987 5 0.749987H14.75C15.2 0.749987 15.5 1.04999 15.5 1.49999C15.5 1.94999 15.2 2.24999 14.75 2.24999Z"
                                                fill="white"
                                        ></path>
                                        <path
                                                d="M14.75 6.74999H5C4.55 6.74999 4.25 6.44999 4.25 5.99999C4.25 5.54999 4.55 5.24999 5 5.24999H14.75C15.2 5.24999 15.5 5.54999 15.5 5.99999C15.5 6.44999 15.2 6.74999 14.75 6.74999Z"
                                                fill="white"
                                        ></path>
                                        <path
                                                d="M14.75 11.25H5C4.55 11.25 4.25 10.95 4.25 10.5C4.25 10.05 4.55 9.74999 5 9.74999H14.75C15.2 9.74999 15.5 10.05 15.5 10.5C15.5 10.95 15.2 11.25 14.75 11.25Z"
                                                fill="white"
                                        ></path>
                                        <path
                                                d="M1.25 2.24999C1.175 2.24999 1.175 2.24999 1.1 2.24999C1.025 2.24999 1.025 2.24999 0.95 2.17499C0.875 2.17499 0.875 2.09999 0.8 2.09999C0.725 2.09999 0.725 2.02499 0.725 2.02499C0.65 1.94999 0.575 1.87499 0.575 1.79999C0.5 1.72499 0.5 1.57499 0.5 1.49999C0.5 1.42499 0.5 1.27499 0.575 1.19999C0.65 1.12499 0.65 1.04999 0.725 0.974987C0.95 0.749987 1.25 0.674987 1.55 0.824987C1.625 0.899987 1.7 0.899987 1.775 0.974987C1.925 1.12499 2 1.27499 2 1.49999C2 1.72499 1.925 1.87499 1.775 2.02499C1.625 2.17499 1.475 2.24999 1.25 2.24999Z"
                                                fill="white"
                                        ></path>
                                        <path
                                                d="M1.25 6.74999C1.025 6.74999 0.875 6.67499 0.725 6.52499C0.575 6.37499 0.5 6.22499 0.5 5.99999C0.5 5.92499 0.5 5.92499 0.5 5.84999C0.5 5.77499 0.5 5.77499 0.575 5.69999C0.575 5.62499 0.65 5.62499 0.65 5.54999C0.65 5.47499 0.725 5.47499 0.725 5.47499C0.8 5.39999 0.875 5.32499 0.95 5.32499C1.25 5.17499 1.55 5.24999 1.775 5.47499L1.85 5.54999C1.85 5.62499 1.925 5.62499 1.925 5.69999C1.925 5.77499 1.925 5.77499 2 5.84999C2 5.92499 2 5.92499 2 5.99999C2 6.22499 1.925 6.37499 1.775 6.52499C1.625 6.67499 1.475 6.74999 1.25 6.74999Z"
                                                fill="white"
                                        ></path>
                                        <path
                                                d="M1.25 11.25C1.025 11.25 0.875 11.175 0.725 11.025C0.575 10.875 0.5 10.725 0.5 10.5C0.5 10.425 0.5 10.275 0.575 10.2C0.65 10.125 0.65 10.05 0.725 9.97499C1.025 9.67499 1.475 9.67499 1.775 9.97499C1.925 10.125 2 10.275 2 10.5C2 10.725 1.925 10.875 1.775 11.025C1.625 11.175 1.475 11.25 1.25 11.25Z"
                                                fill="white"
                                        ></path>
                                    </svg>
                                    <div class="text">Display Order</div>
                                </div>
                                <div class="item-article edit-info-btn">
                                    <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 18 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M9.96967 0.96967C10.2626 0.676777 10.7374 0.676777 11.0303 0.96967L14.0303 3.96967C14.3232 4.26256 14.3232 4.73744 14.0303 5.03033L5.78033 13.2803C5.63968 13.421 5.44891 13.5 5.25 13.5H2.25C1.83579 13.5 1.5 13.1642 1.5 12.75V9.75C1.5 9.55109 1.57902 9.36032 1.71967 9.21967L9.96967 0.96967ZM3 10.0607V12H4.93934L12.4393 4.5L10.5 2.56066L3 10.0607Z"
                                                fill="white"
                                        ></path>
                                        <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M1.5 16.5C1.5 16.0858 1.83579 15.75 2.25 15.75H15.75C16.1642 15.75 16.5 16.0858 16.5 16.5C16.5 16.9142 16.1642 17.25 15.75 17.25H2.25C1.83579 17.25 1.5 16.9142 1.5 16.5Z"
                                                fill="white"
                                        ></path>
                                    </svg>
                                    <div class="text">Edit info</div>
                                </div>
                                <div class="item-article add-order-btn">
                                    <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 18 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g clip-path="url(#clip0)">
                                            <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M5.25 15.75C5.25 14.9216 5.92157 14.25 6.75 14.25C7.57843 14.25 8.25 14.9216 8.25 15.75C8.25 16.5784 7.57843 17.25 6.75 17.25C5.92157 17.25 5.25 16.5784 5.25 15.75Z"
                                                    fill="white"
                                            ></path>
                                            <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M13.5 15.75C13.5 14.9216 14.1716 14.25 15 14.25C15.8284 14.25 16.5 14.9216 16.5 15.75C16.5 16.5784 15.8284 17.25 15 17.25C14.1716 17.25 13.5 16.5784 13.5 15.75Z"
                                                    fill="white"
                                            ></path>
                                            <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M0 0.75C0 0.335786 0.335786 0 0.75 0H3.75C4.10747 0 4.41526 0.252289 4.48541 0.602807L5.11532 3.75H17.25C17.4735 3.75 17.6854 3.8497 17.8279 4.02192C17.9704 4.19414 18.0286 4.42093 17.9867 4.6405L16.7857 10.9386C16.6828 11.4566 16.401 11.9218 15.9896 12.2529C15.5803 12.5824 15.0687 12.7582 14.5435 12.75H7.26648C6.74128 12.7582 6.22965 12.5824 5.82036 12.2529C5.40919 11.922 5.12748 11.4569 5.0245 10.9392C5.02445 10.939 5.02454 10.9395 5.0245 10.9392L3.77159 4.6794C3.76651 4.6587 3.76229 4.63765 3.75896 4.61631L3.13524 1.5H0.75C0.335786 1.5 0 1.16421 0 0.75ZM5.41555 5.25L6.49563 10.6464C6.52992 10.819 6.62384 10.9741 6.76096 11.0845C6.89807 11.1949 7.06964 11.2535 7.24563 11.2501L7.26 11.25H14.55L14.5644 11.2501C14.7404 11.2535 14.9119 11.1949 15.049 11.0845C15.1855 10.9746 15.2792 10.8205 15.3139 10.6488L16.3435 5.25H5.41555Z"
                                                    fill="white"
                                            ></path>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0">
                                                <rect width="18" height="18" fill="white"></rect>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <div class="text">Add to order</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="manage-customer-footer">
                <div class="btn-add-customer"
                     id="cust-new"
                     @click="setDefaultSettingsGlobalAddUpdate({alternative_phone: '', gender: 'male',})"
                     data-toggle="modal"
                     data-target="#customer"
                     data-dismiss="modal">{{ _t('Create New Customer') }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapState, mapActions, mapGetters} from 'vuex'

    export default {
        data() {
            return {
                customerList: [
                    {
                        name: "Beby Jovanca",
                        email: "beby@gmail.com",
                        location: "Abu Dhabi",
                        phone: "0812921312",
                        refCode: "-",
                        class: false
                    },
                    {
                        name: "Beby Jovanca",
                        email: "beby@gmail.com",
                        location: "Abu Dhabi",
                        phone: "0812921312",
                        refCode: "-",
                        class: false
                    },
                    {
                        name: "Beby Jovanca",
                        email: "beby@gmail.com",
                        location: "Abu Dhabi",
                        phone: "0812921312",
                        refCode: "-",
                        class: false
                    },
                    {
                        name: "Beby Jovanca",
                        email: "beby@gmail.com",
                        location: "Abu Dhabi",
                        phone: "0812921312",
                        refCode: "-",
                        class: false
                    }
                ],
                articlesHendler: false
            };
        },
        computed: {
            ...mapGetters(['openManageCustomerHendler']),
            ...mapGetters('location', ['_t']),
        },
        methods: {
            openManageCustomer() {
                this.$store.dispatch("openManageCustomer")
            },
            ...mapActions('customer', ['setDefaultSettingsGlobalAddUpdate']),
        }
    };
</script>
<style lang="scss">
    .manage-customer-wrapper {
        position: fixed;
        top: 0;
        right: -100vw;
        bottom: 0;
        width: 100vw;
        background-color: #fff;
        transition: .5s ease-out;
        z-index: 50;
        border-left: 1px solid #ddd;

        &.active {
            right: 0;
        }

        .manage-customer {
            height: 100%;
            display: grid;
            grid-template-rows: max-content max-content 1fr max-content;

            .manage-customer-header {
                padding: 20px;
                display: grid;
                grid-template-columns: 1fr max-content;
                align-items: center;

                .header-title {
                    font-weight: 500;
                    font-size: 20px;
                }

                .header-btn-close {
                }
            }

            .manage-customer-search {
                border-top: 1px solid #ddd;
                border-bottom: 1px solid #ddd;
                display: grid;
                grid-template-columns: max-content 1fr;
                align-items: center;
                padding: 8px 20px;

                svg {
                    margin-right: 20px;
                }

                .manage-customer-search {
                    outline: none;
                    border: none;
                    border-left: 1px solid #ddd;
                    padding: 0 20px;
                    height: 35px;
                }
            }

            .manage-customer-body {
                padding: 20px;
                overflow: auto;

                .customer-list {
                    width: calc(100vw - 40px);

                    .wrapper {
                        border: 1px solid #ddd;
                        border-radius: 3px;
                        overflow: hidden;
                        margin-bottom: 20px;

                        .customer-list-item {
                            display: grid;
                            grid-template-columns: auto auto auto;
                            transition: 0.3s ease-out;

                            &.active {
                                margin-left: calc(-100vw / 2 * 3 / 3 + 20px);
                            }

                            .item-cell {
                                padding: 20px;
                                width: calc((100vw - 40px) / 2);

                                &:nth-child(1) {
                                    z-index: 3;
                                }

                                &:nth-child(2) {
                                    box-shadow: 7px 0 5px rgba(0, 0, 0, 0.3);
                                    z-index: 2;
                                }

                                &:nth-child(3) {
                                    z-index: 1;
                                }

                                &:last-child {
                                    padding: 0;
                                }

                                .item-title {
                                    color: #a4a4a4;
                                    font-size: 12px;
                                    text-transform: uppercase;
                                }

                                .item-text {
                                    font-size: 14px;
                                    margin-bottom: 10px;

                                    &:last-child {
                                        margin: 0;
                                    }
                                }

                                .item-btn {
                                    background-color: #4b4e53;
                                    color: #fff;
                                    border-radius: 3px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    height: 35px;
                                }

                                svg {
                                    margin-right: 20px;
                                }

                                .item-article {
                                    display: grid;
                                    grid-template-columns: max-content 1fr;
                                    align-items: center;
                                    height: 60px;
                                    color: #fff;
                                    padding: 0 20px;

                                    &.display-order-btn {
                                        background-color: #4b4e53;
                                    }

                                    &.edit-info-btn {
                                        background-color: #f99c32;
                                    }

                                    &.add-order-btn {
                                        background-color: #64c434;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            .manage-customer-footer {
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                padding: 20px;

                .btn-add-customer {
                    height: 50px;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #64c434;
                    border-radius: 3px;
                }
            }
        }
    }
</style>


