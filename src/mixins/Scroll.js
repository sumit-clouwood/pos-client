export default {
  data: function() {
    return {
      showScroll: false,
      container: 'scroll-container',
      entity: 'scroll-entity',
      margin: 0,
      keepEntitiesInScroll: 0,
      scrollMarginBottom: 0,
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.calculateScrolls()
    })
  },

  methods: {
    calculateScrolls() {
      if (!this.$refs[this.container].parentNode) {
        return false
      }
      const parentHeight = this.$refs[this.container].parentNode.clientHeight
      const currentHeight = this.$refs[this.container].clientHeight

      if (!parentHeight || !currentHeight) {
        return false
      }

      if (currentHeight > parentHeight) {
        this.showScroll = true
      } else {
        this.showScroll = false
      }
    },
    scroll(direction = 'up') {
      if (!this.$refs[this.container].parentNode) {
        return false
      }
      //on 0 it ll be a scroll button
      const entity = this.$refs[this.entity][0]
      const element = this.$refs[this.container].parentNode
      //10 is margin-top of the entity, which starts from second element
      let toScroll = Math.round(
        element.clientHeight / (entity.clientHeight + this.margin)
      )
      //add space for navigation icon, so -1 the category
      toScroll =
        (toScroll - this.keepEntitiesInScroll) *
        (entity.clientHeight + this.margin)

      //element.scrollTop = element.scrollHeight
      if (direction === 'up') {
        if (element.scrollTop + toScroll <= element.scrollHeight - toScroll) {
          element.scrollTop += toScroll
        } else {
          if (!this.scrollMarginBottom) {
            this.scrollMarginBottom =
              element.scrollHeight -
              (element.scrollTop + toScroll + this.margin)
          }
          element.scrollTop = element.scrollHeight
        }
      } else {
        if (element.scrollTop - toScroll >= 0) {
          if (this.scrollMarginBottom) {
            element.scrollTop =
              element.scrollHeight -
              (toScroll + this.margin + this.scrollMarginBottom)
            this.scrollMarginBottom = 0
          } else {
            element.scrollTop -= toScroll
          }
        } else {
          element.scrollTop = 0
        }
      }
    },
  },
}
