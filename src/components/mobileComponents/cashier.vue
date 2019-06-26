<template>
    <div class="cashier">
        <div class="user-login">
            <div class="cashier-list-header">
                <div class="user-block">
                    <div class="title">ADNOC Al Wathba</div>
                    <div class="subtitle">Logged in as, <strong>Nirmala</strong></div>
                    <div class="image"></div>
                </div>
            </div>
            <div class="cashier-list-body"></div>
            <div class="cashier-list-footer">
                <date-time/>
            </div>
        </div>
        <div class="user-list">
            <div class="title">Please Select User</div>
            <div class="list">
                <user :userSrc="'src/assets/images/userimg.jpg'" :userName="'Aisyah Zidni'"/>
                <user :userSrc="'src/assets/images/userimg.jpg'" :userName="'Aisyah Zidni'"/>
                <user :userSrc="'src/assets/images/userimg.jpg'" :userName="'Aisyah Zidni'"/>
                <user :userSrc="'src/assets/images/userimg.jpg'" :userName="'Aisyah Zidni'"/>
                <user :userSrc="'src/assets/images/userimg.jpg'" :userName="'Aisyah Zidni'"/>
                <user :userSrc="'src/assets/images/userimg.jpg'" :userName="'Aisyah Zidni'"/>
                <user :userSrc="'src/assets/images/userimg.jpg'" :userName="'Aisyah Zidni'"/>
                <user :userSrc="'src/assets/images/userimg.jpg'" :userName="'Aisyah Zidni'"/>
            </div>
        </div>
        <div class="user-calc">
            <div class="user-calc-header">
                <user :userSrc="'src/assets/images/userimg.jpg'" :userName="'Aisyah Zidni'"/>
            </div>
            <div class="user-calc-body"></div>
        </div>
    </div>
</template>

<script>
    import dateTime from './mobileElements/dateTime.vue'
    import user from './mobileElements/user'

    export default {
        name: "cashierList",
        components: {
            dateTime,
            user
        }
    }
</script>

<style lang="scss">
    @import '../../assets/scss/pixels_rem.scss';
    @import '../../assets/scss/variables.scss';
    @import '../../assets/scss/mixins.scss';

    .cashier {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        background-color: #fff;
        background-image: url("../../assets/images/bg.jpg");
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        color: #fff;
        display: none;

        .user-login {
            display: grid;
            grid-template-rows: max-content 1fr max-content;
            position: absolute;
            top: 0;
            right: -100vw;
            bottom: 0;
            width: 100vw;
            background-color: rgba(0, 0, 0, 0.5);

            .cashier-list-header {
                padding: 20px;
                display: grid;
                justify-content: right;

                .user-block {
                    display: inline-grid;
                    grid-template-columns: 1fr max-content;
                    grid-column-gap: 20px;
                    margin-left: auto;

                    .title {
                        display: grid;
                        align-items: end;
                        font-weight: 600;
                        letter-spacing: 1px;
                    }

                    .subtitle {
                        strong {
                            letter-spacing: 1px;
                        }
                    }

                    .image {
                        width: 55px;
                        height: 55px;
                        grid-column-start: 2;
                        grid-column-end: 3;
                        grid-row-start: 1;
                        grid-row-end: 3;
                        border: 2px solid #fff;
                        border-radius: 50%;
                    }
                }
            }

            .cashier-list-body {

            }

            .cashier-list-footer {
                padding: 20px;


                .date-time {
                    a {
                        color: #fff;
                        font-weight: 400;
                        display: grid;

                        .time {
                            font-size: 50px;
                            line-height: 50px;
                        }

                        .date {
                            font-size: 14px;
                        }
                    }
                }
            }
        }

        .user-list {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 0;
            right: -100vw;
            bottom: 0;
            width: 100vw;
            background-color: rgba(0, 0, 0, 0.5);
            padding: 70px 20px;

            .title {
                margin-bottom: 50px;
            }

            .list {
                display: grid;
                grid-gap: 20px;
                overflow: auto;

                &::-webkit-scrollbar {
                    display: none;
                }

            }

        }
        .user-calc{
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 100vw;
            background-color: rgba(0,0,0,0.5);
        }
    }
</style>