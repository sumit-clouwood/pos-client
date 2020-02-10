/* eslint-disable no-console */
import { bus } from '@/eventBus'

export default {
  data: function() {
    return {
      showScroll: false,
      showScrollUp: false,
      showScrollDown: false,
      container: 'scroll-container',
      entity: 'scroll-entity',
      margin: 0,
      keepEntitiesInScroll: 0,
      scrollMarginBottom: 0,
      toScroll: 0,
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
        return Promise.reject()
      }
      if (
        !this.$refs[this.container].offsetHeight &&
        !this.$refs[this.container].offsetWidth
      ) {
        //element doesn't exist or not mounted in DOM
        return Promise.reject()
      }
      const parentHeight = this.$refs[this.container].parentNode.offsetHeight
      const currentHeight = this.$refs[this.container].offsetHeight

      if (!parentHeight || !currentHeight) {
        Promise.resolve()
      }

      if (currentHeight > parentHeight) {
        this.showScroll = true
      } else {
        this.showScroll = false
      }
      this.setScrolls()
      return Promise.resolve()
    },
    setScrolls() {
      this.showScrollUp = false
      this.showScrollDown = false

      if (this.showScroll) {
        this.showScrollDown = true
      }
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
      this.toScroll = Math.floor(
        element.offsetHeight / (entity.offsetHeight + this.margin)
      )
      //add space for navigation icon, so -1 the category
      this.toScroll =
        (this.toScroll - this.keepEntitiesInScroll) *
        (entity.offsetHeight + this.margin)

      //element.scrollTop = element.scrollHeight
      if (direction === 'up') {
        //its down scroll but natural up
        this.showScrollUp = true
        bus.$emit('showScrollUp-' + this.container, this.showScrollUp)

        if (
          element.scrollTop + this.toScroll + this.margin <=
          element.scrollHeight - this.toScroll
        ) {
          element.scrollTop += this.toScroll
        } else {
          if (!this.scrollMarginBottom) {
            this.scrollMarginBottom =
              element.scrollHeight -
              (element.scrollTop + this.toScroll + this.margin)
          }
          element.scrollTop = element.scrollHeight
        }

        setTimeout(() => {
          if (element.scrollTop >= element.scrollHeight) {
            this.showScrollUp = true
            this.showScrollDown = false
          }
          console.log(
            element.scrollTop,
            this.toScroll,
            this.margin,
            this.keepEntitiesInScroll * entity.offsetHeight,
            this.keepEntitiesInScroll * this.margin,
            this.scrollMarginBottom,
            '>=',
            element.scrollHeight
          )
          if (
            element.scrollTop +
              this.toScroll +
              this.margin +
              this.keepEntitiesInScroll * entity.offsetHeight +
              this.keepEntitiesInScroll * this.margin +
              this.scrollMarginBottom >=
            element.scrollHeight
          ) {
            this.showScrollDown = false
          }
          bus.$emit('showScrollUp-' + this.container, this.showScrollUp)
          bus.$emit('showScrollDown-' + this.container, this.showScrollDown)
        }, 300)
      } else {
        this.showScrollDown = true
        bus.$emit('showScrollDown-' + this.container, this.showScrollDown)
        if (element.scrollTop - this.toScroll >= 0) {
          if (this.scrollMarginBottom) {
            element.scrollTop =
              element.scrollHeight -
              (this.toScroll + this.margin + this.scrollMarginBottom)
            this.scrollMarginBottom = 0
          } else {
            element.scrollTop -= this.toScroll
          }
        } else {
          element.scrollTop = 0
        }

        setTimeout(() => {
          if (element.scrollTop <= 0) {
            this.showScrollUp = false
            this.showScrollDown = true
          }

          bus.$emit('showScrollUp-' + this.container, this.showScrollUp)
          bus.$emit('showScrollDown-' + this.container, this.showScrollDown)
        }, 300)
      }
    },
  },
}
