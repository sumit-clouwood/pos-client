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
      if (
        !this.$refs[this.container] ||
        !this.$refs[this.container].parentNode
      ) {
        return Promise.resolve(false)
      }
      if (
        !this.$refs[this.container].offsetHeight &&
        !this.$refs[this.container].offsetWidth
      ) {
        //element doesn't exist or not mounted in DOM
        return Promise.reject(false)
      }
      const parentHeight = this.$refs[this.container].parentNode.offsetHeight
      const currentHeight = this.$refs[this.container].offsetHeight

      if (!parentHeight || !currentHeight) {
        return Promise.resolve(false)
      }

      if (currentHeight > parentHeight) {
        this.showScroll = true
      } else {
        this.showScroll = false
      }
      return Promise.resolve(this.showScroll)
    },
    getEntity(refElem, ref) {
      let elem = null
      if (refElem.className && refElem.className.split(' ').includes(ref)) {
        return refElem
      }
      if (refElem.children && refElem.children.length) {
        for (const i in refElem.children) {
          const child = refElem.children[i]
          if (child.className && child.className.split(' ').includes(ref)) {
            return child
          }
          elem = this.getEntity(child, ref)
          if (elem) {
            return elem
          }
        }
        if (elem) {
          return elem
        }
      }
      return elem
    },
    scroll(direction = 'up') {
      if (
        !this.$refs[this.container] ||
        !this.$refs[this.container].parentNode
      ) {
        return false
      }
      if (
        !this.$refs[this.container].offsetHeight &&
        !this.$refs[this.container].offsetWidth
      ) {
        //element doesn't exist or not mounted in DOM
        return false
      }
      //on 0 it ll be a scroll button
      let entity = this.$refs[this.entity] ? this.$refs[this.entity][0] : false
      if (!entity) {
        entity = this.getEntity(this.$refs[this.container], this.entity)
      }
      const element = this.$refs[this.container].parentNode

      //10 is margin-top of the entity, which starts from second element
      let toScroll = Math.round(
        element.offsetHeight / (entity.offsetHeight + this.margin)
      )
      //add space for navigation icon, so -1 the category
      toScroll =
        (toScroll - this.keepEntitiesInScroll) *
        (entity.offsetHeight + this.margin)

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
