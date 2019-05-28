<template>
  <div>
    <table width="100%">
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

      <tr v-for="item in itemsDetails" :key="item._id">
        <td style="vertical-align: top;">{{ item.item_quantity }}</td>
        <td style="vertical-align: top;">
          {{ item.item_name }}
          <div
            v-if="item.item_modifiers.length"
            class="online-order-details-wrap"
          >
            <div v-for="(modifier, index) in item.item_modifiers" :key="index">
              <p
                style="margin: 0; font-size: 14px; padding-left: 10px;"
                v-for="PMDetails in modifier.modifiers.price_modifiers"
                :key="PMDetails._id"
              >
                {{ PMDetails.item_name }} ({{ PMDetails.location_price }})
              </p>
              <p
                style="margin: 0; font-size: 14px; padding-left: 10px;"
                v-for="MMDetails in modifier.modifiers.mandatory_modifiers"
                :key="MMDetails._id"
              >
                {{ MMDetails.item_name }}
              </p>
              <p
                style="margin: 0; font-size: 14px; padding-left: 10px;"
                v-for="RMDetails in modifier.modifiers.regular_modifiers"
                :key="RMDetails._id"
              >
                {{ RMDetails.item_name }}
              </p>
            </div>
          </div>
        </td>
        <td style="vertical-align: top;" class="text-right">
          {{ formatPrice(item.item_price_each) }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Items',
  props: ['labels', 'itemsDetails', 'tpl'],
  computed: {
    ...mapGetters('location', ['formatPrice']),
  },
  methods: {
    /* itemName(item) {
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
    },*/
  },
}
</script>
<style scoped lang="css"></style>
