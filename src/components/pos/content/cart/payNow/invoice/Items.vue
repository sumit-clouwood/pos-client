<template>
  <div>
    <table width="100%" cellpadding="4" cellspacing="4">
      <tr>
        <th class="text-left" width="15%">
          {{ labels.qty_label }}
        </th>
        <th class="text-left">
          {{ labels.item_label }}
        </th>
        <th class="text-right" width="25%">
          {{ labels.price_label }}
        </th>
      </tr>
      <tr v-for="item in items" :key="item._id">
        <td>{{ item.quantity }}</td>
        <td>
          <span class="item-name">{{ itemName(item) }}</span>
          <div v-if="item.modifiers" class="modifiers">
            <span>
              <i v-html="modifiers(item)"></i>
            </span>
          </div>
        </td>
        <td class="text-right">
          {{ formatPrice(item.item_discount_price * item.quantity) }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Items',
  props: ['labels', 'items', 'tpl'],
  computed: {
    ...mapGetters('location', ['formatPrice']),
  },
  methods: {
    modifiers(item) {
      let modifiers = []
      item.modifiers.regular_modifiers.forEach(modifier =>
        modifiers.push(modifier.item_name)
      )
      item.modifiers.mandatory_modifiers.forEach(modifier =>
        modifiers.push(modifier.item_name)
      )
      item.modifiers.price_modifiers.forEach(modifier =>
        modifiers.push(modifier.item_name)
      )

      return modifiers.join('</i>, <i>')
    },
    itemName(item) {
      const engName = item.item_name.find(locale => locale.language == 'en_US')
        .name

      if (this.tpl.foreignLang && this.tpl.template.language != 'en_US') {
        //send both english and other lang
        return (
          engName +
          ' / ' +
          item.item_name.find(
            locale => locale.language == this.tpl.template.language
          ).name
        )
      }
      return engName
    },
  },
}
</script>
<style lang="sass" scoped>
.item-name
  font-size: 16px
.modifiers
  margin-left: 10px
  span
    font-size: 14pxcccc
</style>
