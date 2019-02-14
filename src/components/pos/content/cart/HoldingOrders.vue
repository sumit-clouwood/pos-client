<template>
	<div class="holding-order-panel animated zoomIn">
		<Header />
		<div class="wrappers-order-block">
				<Items />
		</div>
	</div>
</template>

<script>
  import Header from './holdingOrders/Header.vue'
  import Items from './holdingOrders/Items.vue'

	export default {
			name:'HoldingOrders',
			components : {
					Header,
					Items
			},
			props: {}
	}
</script>