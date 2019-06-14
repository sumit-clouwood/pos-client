<template>
    <div class="date-time">
        <a href="#">
            <span class="time">{{ todayTime }}</span>
            <span class="date">{{ todayDate }}</span>
        </a>
    </div>
</template>
<script>
    import moment from 'moment-timezone'

    export default {
        data() {
            return {
                todayDate: moment().format('L'),
                todayTime: moment().format('h:mm:ss a'),
            }
        },
        mounted() {
            setInterval(() => {
                this.todayTime = moment().format('LT')
            }, 1000)
        },
    }
</script>
<style lang="scss">
.date-time{
    grid-column-start: 1;
    grid-column-end: 2;
    a{
        color: #4B4E53;
        font-weight: 600;
        letter-spacing: 0.8px;
        font-size: 14px;
        .time{
            margin-right: 10px;
        }
    }
}
</style>