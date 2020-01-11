<script>
import OnlineOrder from '@/components/pos/footer/popups/OnlineOrder'
import OnlineOrderDetails from '@/components/pos/footer/popups/OnlineOrderDetails'

import { mapState } from 'vuex'
export default {
  name: 'Footer',
  props: {},
  components: {
    OnlineOrderDetails,
    OnlineOrder,
  },
  computed: {
    ...mapState('sync', ['online']),
  },
}
</script>
