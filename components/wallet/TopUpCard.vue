<template>
	<div class="w-full">
		<div 
			class="relative overflow-hidden rounded-2xl p-5 md:p-6 shadow-lg text-white"
			:style="{ background: cardBackground }"
		>
			<!-- top row -->
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<span class="inline-block h-2.5 w-2.5 rounded-full bg-white/90"></span>
					<p class="text-sm md:text-base font-semibold">Uvend Prepaid Utilities</p>
				</div>
				<div class="h-8 w-12 rounded-lg bg-gradient-to-br from-yellow-300 to-amber-500 shadow-inner"></div>
			</div>

			<!-- balance -->
			<div class="mt-4 md:mt-6">
				<p class="text-xs md:text-sm text-white/80">Available balance</p>
				<p class="mt-1 text-2xl md:text-3xl font-extrabold tracking-tight">{{ currency }} {{ formattedBalance }}</p>
			</div>

			<!-- account + action -->
			<div class="mt-5 md:mt-6 flex items-center justify-between gap-3">
				<div>
					<p class="text-xs md:text-sm text-white/80">Account</p>
					<p class="mt-1 tracking-widest font-semibold" :class="{'text-white': true}">{{ maskedAccount }}</p>
				</div>
				<button 
					class="shrink-0 inline-flex items-center justify-center rounded-xl bg-white text-blue-700 hover:bg-blue-50 transition-colors px-4 py-2 text-sm font-semibold"
					@click="handleTopUp"
				>
					Top up
				</button>
			</div>

			<!-- subtle highlight -->
			<div class="pointer-events-none absolute -top-6 -right-10 h-28 w-28 rounded-full bg-white/10 blur-2xl"></div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'WalletTopUpCard',
	props: {
		balance: { type: Number, default: 1250.75 },
		currency: { type: String, default: 'R' },
		accountLast4: { type: String, default: '3456' },
		bgPrimary: { type: String, default: () => `#${APP_BG_2?.replace('#','') || '1287c9'}` },
		bgSecondary: { type: String, default: () => '#3b5bdb' }
	},
	computed: {
		cardBackground(){
			return `linear-gradient(135deg, ${this.bgPrimary} 0%, ${this.bgSecondary} 70%)`;
		},
		formattedBalance(){
			try{
				return this.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
			}catch(e){
				return this.balance
			}
		},
		maskedAccount(){
			return `1234 •••• •••• ${this.accountLast4}`
		}
	},
	methods: {
		handleTopUp(){
			// Navigate to payments screen by default
			this.$router.push('/wallet/payments')
		}
	}
}
</script>
<style scoped>
/* Ensure the card looks great on mobile */
</style>

