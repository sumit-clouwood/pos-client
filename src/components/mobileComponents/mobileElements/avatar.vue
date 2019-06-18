<template>
    <div class="avatar">
        <a class="avatar-link" href="">
            <img class="avatar-link-img" :src="profileImage" alt="profile"/>
            <div class="avatar-link-user">Admin</div>
            <status/>
        </a>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import status from './status.vue'

    export default {
        components: {
            status
        },
        computed: {
            ...mapState({
                profileImage: state =>
                    state.auth.userDetails && state.auth.userDetails.image
                        ? process.env.VUE_APP_API_ENDPOINT +
                        '/profile_pic/' +
                        state.auth.userDetails.image
                        : 'img/pos/profile-pic.png',
            }),
        }
    }
</script>
<style lang="scss">
    .avatar {
        grid-column-start: 1;
        grid-column-end: 3;
        .avatar-link {
            display: grid;
            grid-template-columns: max-content max-content;

            .avatar-link-img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-right: 20px;
                grid-row-start: 1;
                grid-row-end: 3;
            }

            .avatar-link-user {
                font-size: 20px;
                line-height: 20px;
                font-weight: 600;
                color: #4B4E53;
            }
        }
    }
</style>