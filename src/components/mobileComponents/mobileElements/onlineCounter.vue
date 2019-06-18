<template>
    <div class="online-counter">
        <div class="online-counter-text">{{ _t('Online') }}</div>
        <div class="online-counter-num">2</div>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'

    export default {
        computed: {
            ...mapGetters('location', ['_t']),
        }
    }
</script>
<style lang="scss">
.online-counter{
    display: grid;
    grid-template-columns: max-content max-content;
    align-items: center;
    .online-counter-text{
        font-size: 14px;
        margin-right: 10px;
    }
    .online-counter-num{
        width: 25px;
        height: 25px;
        background-color: #64C434;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-weight: 600;
    }
}
</style>