<template>
    <div class="menu-language">
        <button
                class="v-btn v-btn--icon theme--light dropdown-toggle lang-flag-container"
                type="button"
                id="dropdownLanguage"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
        >
            <img :src="'/img/flag_icon/4x3/' + iconCodeSelection + '.svg'" />
        </button>
        <div
                aria-labelledby="dropdownLanguage"
                class="dropdown-menu cursor-pointer"
                v-if="availableLanguages"
                @change="changeLanguage(vlocale)"
        >
            <a
                    class="dropdown-item"
                    role="button"
                    v-for="language in availableLanguages"
                    :key="language._id"
                    :value="language.code"
                    @click="iconCode(language.icon_code)"
            >
        <span>
          <img :src="'/img/flag_icon/4x3/' + language.icon_code + '.svg'" />
        </span>
                {{ language.name }}
            </a>
        </div>
            </div>
</template>

<script>
/* global $ */
import { mapState, mapGetters, mapActions } from 'vuex'
import bootstrap from '@/bootstrap'
export default {
    name: 'LanguageMenu',
    props: {},
    components: {
    },
    updated() {},
    computed: {
        vlocale: {
            get() {
                return this.$store.state.location.locale
            },
            set(val) {
                return this.$store.commit('location/SET_LOCALE', val)
            },
        },
        ...mapGetters('context', ['store']),
        ...mapGetters('auth', ['waiter', 'carhop']),
        ...mapState('location', ['availableLanguages', 'language']),
        ...mapState('dinein', ['dineInTabType', 'activeArea']),
        ...mapState('sync', ['online']),
        ...mapState({
            latestOnlineOrders: state =>
                state.order.onlineOrders ? state.order.onlineOrders.length : 0,
            username: state =>
                state.auth.userDetails ? state.auth.userDetails.name : '',
        }),
        ...mapGetters('location', ['_t', 'permitted']),
    },
    methods: {
        iconCode: function(iconCode) {
            this.iconCodeSelection = iconCode
        },
        ...mapActions('auth', ['logout']),
        changeLanguage(locale) {
            // const language = this.languages.find(lang => lang.code === this.vlocale).code
            bootstrap.loadUI(this.$store)
            this.$store.dispatch('location/changeLanguage', locale)
        },

        /*...mapActions('customer', ['fetchCustomerAddress']),*/
    },
}
</script>
