<template>
	<div class="vegetable-pizza-wrapper">
		<!--Added Breadcrumb here-->
		<Breadcrumb />
		<div class="vegetable-pizza-block">
				<div class="vegetable-pizza">
					<div class="vegetable" v-for="item in items" :key="item._id">
						<div>
							<img :src="itemImage(item.item_image)" :alt="t(item.item_name).name">
							<p class="remove-bottom popover-btn">Vegetable Pizza Small + Vegetable Pizza Small beverage
									amlet</p>
						</div>
					</div>
				</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex'

	import Breadcrumb from '../Breadcrumb'
	export default {
		name: 'Items',
		props: {
			msg: String
		},
		components: {
			Breadcrumb
		},
		computed: {
			...mapGetters('category', [
					'items',
					'itemImage'
			])
		}
	}
</script>