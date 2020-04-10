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
      currentSlide: 'cash',
      positionX: 0,
      dragging: false,
      dragX: '',
      dragY: '',
      aggregatorChild: false,
    }
  },
  computed: {
    slideWidth() {
      return this.width / this.perPage
    },
    ...mapState('checkoutForm', ['method']),
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
    startDrag(event) {
      event = event || window.event
      event.preventDefault()
      this.dragging = true
      this.x = this.y = 0
    },
    stopDrag(event) {
      event = event || window.event
      event.preventDefault()
      this.dragging = false
      this.x = this.y = ''
      document.onmouseup = null
      document.onmousemove = null
    },
    doDrag(event) {
      event = event || window.event
      event.preventDefault()
      if (this.dragging) {
        if (event.clientX > this.x) {
          //drag to right
          if (this.currentPage - 1 >= 1) {
            this.movePage(this.currentPage - 1)
          }
        } else if (event.clientX < this.x) {
          //drag to left
          if (this.currentPage + 1 <= this.totalPages) {
            this.movePage(this.currentPage + 1)
          }
        }
        this.x = event.clientX
        this.y = event.clientY
      }
    },
  },
}
