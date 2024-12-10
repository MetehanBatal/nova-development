<script>
	import moment from 'moment';
  	import { productsDictionary } from '$stores/products--dev';

	export let filteredOrder;

	let purchase = filteredOrder.purchase;
</script>


<div class="order-history-wrapper">
	<div class="order-summary-header">
	   <a href="/purchases">
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
				<path d="M8.75 3.5L5.25 7L8.75 10.5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</a>
		<div class="order-number">
			{`${filteredOrder.billingAddress.first_name} ${filteredOrder.billingAddress.last_name}`}
		</div>
		<div class="order-date">
			{moment(filteredOrder.date).format('MMMM D, YYYY [at] h:mm a')}
		</div>
	</div>
	
	<div class="order-summary-wrapper">
		<div class="order-summary">
			{#each purchase.products as product}
				<div class="order-item">
					<div class="order-img">
						{#if product.productImage === null }
							{#if productsDictionary.find((p) => p.variantId === product.variantId)?.thumbnail}
							<img src={productsDictionary.find((p) => p.variantId === product.variantId)?.thumbnail} alt={product.productTitle}>
							{:else}
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
								<path d="M15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M7.49967 9.16666C8.42015 9.16666 9.16634 8.42047 9.16634 7.49999C9.16634 6.57952 8.42015 5.83333 7.49967 5.83333C6.5792 5.83333 5.83301 6.57952 5.83301 7.49999C5.83301 8.42047 6.5792 9.16666 7.49967 9.16666Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M7.49967 9.16666C8.42015 9.16666 9.16634 8.42047 9.16634 7.49999C9.16634 6.57952 8.42015 5.83333 7.49967 5.83333C6.5792 5.83333 5.83301 6.57952 5.83301 7.49999C5.83301 8.42047 6.5792 9.16666 7.49967 9.16666Z" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M17.5 12.5001L14.9283 9.92848C14.6158 9.61603 14.1919 9.44051 13.75 9.44051C13.3081 9.44051 12.8842 9.61603 12.5717 9.92848L5 17.5001" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M17.5 12.5001L14.9283 9.92848C14.6158 9.61603 14.1919 9.44051 13.75 9.44051C13.3081 9.44051 12.8842 9.61603 12.5717 9.92848L5 17.5001" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
							{/if}
						{:else}
							<img src={product.productImage} alt={product.productTitle}>
						{/if}
					</div>
					<div class="order-description">
						<div class="item-name">
							{product.displayName}
						</div>
						<div class="item-spec">
							{product.productTitle}
						</div>
						<div class="item-sku">
							SKU: 11947-QN-SN
						</div>
					</div>
					<div class="order-pricing">
						<div class="item-subtotal">
							<div class="subprice">{(product.price).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</div>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
								<path d="M12 4L4 12" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M4 4L12 12" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
							<div class="quantity">
								{product.quantity}
							</div>
						</div>
						<div class="item-total">
							{product.price.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
						</div>
					</div>
				</div>
			{/each}
		</div>
		<div class="order-prices-summary">
			<div class="pricing-section">
				<div class="price-name">
					Subtotal
				</div>
				<div class="item-count">{purchase.products.length} items</div>
				<div class="total-order-count">
					{purchase.subTotal.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
				</div>
			</div>
			{#if purchase.shippingTotal && purchase.shippingTotal > 0}
			<div class="pricing-section">
				<div class="price-name">
					Shipping
				</div>
				<div class="item-count">
					Standard Shipping
				</div>
				<div class="total-order-count">
					{(purchase.shippingTotal).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
				</div>
			</div>
			{/if}
			<div class="pricing-section">
				<div class="price-name">
					Discount
				</div>
				<div class="item-count">
					{#if purchase.couponCode?.length > 0}
					{purchase.couponCode}
					{:else}
					NO COUPON CODE APPLIED
					{/if}
				</div>
				<div class="total-order-count">
					{(purchase.discount).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
				</div>
			</div>
			<div class="pricing-section">
				<div class="price-name">
					Tax
				</div>
				<div class="item-count">
					{#if purchase.tax > 0}
					Tax 7%
					{:else}
					NO TAX APPLIED
					{/if}
				</div>
				<div class="total-order-count">
					{(purchase.tax).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
				</div>
			</div>
			<div class="pricing-section total-with-tax">
				<div class="price-name">
					Total
				</div>
				<div class="total-price">
					{(purchase.subTotal + (purchase.shippingTotal ? purchase.shippingTotal : 0) - purchase.discount).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
				</div>
			</div>
			<div class="pricing-section total-paid-tax">
				<div class="price-name">
					Paid by customer
				</div>
				<div class="total-price">
					{(purchase.subTotal + (purchase.shippingTotal ? purchase.shippingTotal : 0) - purchase.discount).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
				</div>
			</div>
		</div>
	</div>
</div>


<style>

	.order-history-wrapper {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 2.4rem;
	}

	.order-summary-header {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: .8rem;

		margin-bottom: 2.4rem;
	}

	.order-summary-header svg {
		cursor: pointer;
	}

	.order-number {
		font-size: 1.8rem;
		line-height: 2.2rem;
	}
	.order-date {
		font-size: 1.4rem;
		line-height: 1.8rem;
		color: #88888A;
	}

	.order-summary-wrapper {
		border-radius: 1.6rem;
		border: .1rem solid #212830;
		background-color: #0D121A;
		width: 100%;		
	}

	.order-summary {
		padding: 3.2rem 3.2rem 4.2rem 3.2rem;
	   
		border-bottom: .1rem dashed #1A1F26;

		
		
	}

	.order-item {
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
		border-bottom: .1rem solid #1A1F26;
		padding-block: 3rem;
	}

	.order-item:last-child {
		border: none;
	}

	.order-img {
		height: 12rem;
   		width: 12rem;
		margin-right: 1.5rem;
		background-color: #fffef2;
		border-radius: 0.8rem;
		padding: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.order-img img {
		object-fit: contain;
    	max-height: 100%;
	}

	.item-name {
		font-size: 1.6rem;
		line-height: 2rem;
		text-decoration: capitalize;
	}

	.item-spec, .item-sku {
		font-size: 1.4rem;
		line-height: 1.8rem;
		color: #88888A;
	}

	.order-description {
		flex: 3;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		gap: .8rem;
	}

	.order-pricing {
		flex: 2;
		display: flex;
		align-items: space-between;
		justify-content: space-between;
	}

	.item-subtotal {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.6rem;

		font-size: 1.6rem;
		color: #88888A;
		line-height: 2rem;
		margin-inline: auto;
	}

	.item-total {
		font-size: 1.6rem;
		line-height: 2rem;
	}

	.order-prices-summary {
		padding: 2.4rem 3.2rem 2.4rem 14rem;
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
	}

	.pricing-section {
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		color: #88888A;
		font-size: 1.4rem;
	}

	.price-name {
		flex: 1
	}

	.item-count {
		flex: 3;
	}

	.total-order-count {
		flex: 1;
		text-align: right;
	}

	.total-with-tax {
		font-size: 1.6rem;
		color: #FFF;
		line-height: 2rem;
		font-weight: 500;
	}

	.total-paid-tax {
		border-top: .1rem solid #1A1F26;
		padding-top: 2rem;
	}



	.divider {
		background-color: #1A1F26;
		height: .1rem;
		width: 100%;

		margin-block: 3.2rem;
	}

</style>