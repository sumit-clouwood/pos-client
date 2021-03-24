import { mapState } from 'vuex'

export default {
  props: {
    slides: [Array, Object],
    perPage: Number,
    width: Number,
  },
  data() {
    return {
      currentPage: 1,
      positionX: 0,
      dragging: false,
      dragX: '',
      dragY: '',
      aggregatorChild: false,
      currentSlide: 0,
    }
  },
  computed: {
    slideWidth() {
      return this.width / this.perPage
    },
    ...mapState('checkoutForm', ['method']),
    // currentSlide() {
    //   if (this.method && this.method.type !== 'cash') {
    //     return this.method.type
    //   } else return 'cash'
    // },
  },
  methods: {
    imagePath(key) {
      return 'img/icons/svgs/' + key + '.svg'
    },
    setActive(index) {
      this.currentSlide = index
      if (index < this.perPage) {
        //move to slide one
        this.movePage(1)
      }
    },
    fetchImage(method) {
      return this.$store.getters['payment/findAggregateGroup'](
        method.payment_type_group
      )['icon']
    },
    // eslint-disable-next-line no-unused-vars
    startDrag(event) {
      event = event || window.event
      // event.preventDefault()
      this.dragging = true
      this.x = this.getClientX()
      this.y = this.getClientY()
      this.dx = this.getClientX()
      this.dy = this.getClientY()
    },
    // eslint-disable-next-line no-unused-vars
    stopDrag(event) {
      event = event || window.event
      //event.preventDefault()
      if (this.dragging) {
        if (this.getClientX() < this.x) {
          //drag to left, move right
          if (this.currentPage + 1 <= this.totalPages) {
            this.movePage(this.currentPage + 1)
          }
        } else if (this.getClientX() > this.x) {
          //drag to right, move right
          if (this.currentPage - 1 >= 1) {
            this.movePage(this.currentPage - 1)
          }
        }
        this.dragging = false
        // this.x = this.getClientX()
        //this.y = this.getClientY()
      }

      document.onmousemove = null
    },
    doDrag(event) {
      event = event || window.event
      event.preventDefault()

      if (this.dragging) {
        if (this.getClientX() < this.dx) {
          //drag to left, move right
          //this.positionX -= 10
        } else if (this.getClientX() > this.dx) {
          //drag to right, move right
          //this.positionX += 10
        }
        this.dx = this.getClientX()
        this.dy = this.getClientY()
      }
    },
    getClientX() {
      const event = window.event
      let x = null
      if (
        event.targetTouches &&
        typeof event.targetTouches[0] !== 'undefined'
      ) {
        x = event.targetTouches[0].pageX
      } else if (event.changedTouches && event.changedTouches.length) {
        x = event.changedTouches[event.changedTouches.length - 1].pageX
      } else {
        x = event.clientX
      }
      return x
    },

    getClientY() {
      const event = window.event
      let y = null
      if (
        event.targetTouches &&
        typeof event.targetTouches[0] !== 'undefined'
      ) {
        y = event.targetTouches[0].pageY
      } else if (event.changedTouches && event.changedTouches.length) {
        event.changedTouches[event.changedTouches.length - 1].pageY
      } else {
        y = event.clientY
      }
      return y
    },
  },
}
