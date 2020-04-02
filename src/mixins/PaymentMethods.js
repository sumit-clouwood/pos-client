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
    }
  },
  computed: {
    totalPages() {
      if (this.slides instanceof Object) {
        let totalLength = Object.keys(this.slides).length || 6
        return Math.ceil(totalLength / this.perPage)
      }
      return Math.ceil(this.slides.length / this.perPage)
    },
    slideWidth() {
      return this.width / this.perPage
    },
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
    movePage(page) {
      let toMove = (page - 1) * this.perPage * this.slideWidth
      if (page == this.totalPages) {
        let slidesToAdjust = 0
        if (this.slides instanceof Object) {
          slidesToAdjust = Object.keys(this.slides).length % this.perPage
        } else {
          slidesToAdjust = this.slides.length % this.perPage
        }
        if (slidesToAdjust > 0) {
          //that means last page has less slides than no of per page
          const missingSlies = this.perPage - slidesToAdjust
          toMove -= missingSlies * this.slideWidth
        }
      }
      this.positionX = -toMove
      this.currentPage = page
      this.show = false
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
