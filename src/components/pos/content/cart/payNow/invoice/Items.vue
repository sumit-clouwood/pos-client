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
      <tr v-for="item in items" :key="item._id">
        <td>{{ item.quantity }}</td>
        <td>
          {{ item.itemName }}
          <div v-if="item.modifiers">
            <span v-for="(modifierGroup, key) in item.modifiers" :key="key">
              <span v-for="(modifier, key) in modifierGroup" :key="key">
                {{ modifier.item_name }}
              </span>
            </span>
          </div>
        </td>
        <td class="text-right">{{ formatPrice(item.item_price_each) }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Items',
  props: ['labels', 'items'],
  computed: {
    ...mapGetters('location', ['formatPrice']),
  },
}
</script>
