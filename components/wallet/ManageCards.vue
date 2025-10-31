<template>
    <!-- Card Management Section -->
    <div class="">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h2 class="text-lg font-semibold">Your Cards</h2>
            <Button size="sm" class="w-full sm:w-auto" @click="showAddCardDialog">
              <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
              Add New Card
            </Button>
          </div>
          
          <div v-if="isLoadingCards" class="py-8 flex justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          
          <div v-else-if="cards.length === 0" class="bg-white rounded-lg border p-8 text-center">
            <div class="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 mb-4">
              <Icon name="lucide:credit-card" class="h-6 w-6 text-gray-500" />
            </div>
            <h3 class="text-lg font-medium mb-2">No Cards Added</h3>
            <p class="text-gray-500 mb-4">Add a credit or debit card to load funds to your wallet</p>
            <Button @click="showAddCardDialog">Add Card</Button>
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card v-for="card in cards" :key="card.id" class="p-4 bg-white border shadow-sm">
              <div class="flex justify-between items-start">
                <div>
                  <div class="flex items-center mb-2">
                    <Icon :name="getCardIcon(card.type)" class="mr-2 h-5 w-5" />
                    <span class="font-medium">{{ card.type }}</span>
                  </div>
                  <p class="text-xl mb-2">**** **** **** {{ card.last4 }}</p>
                  <p class="text-sm text-gray-500">Expires {{ card.expiryMonth }}/{{ card.expiryYear }}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="sm">
                      <Icon name="lucide:more-vertical" class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="setDefaultCard(card.id)">
                      <Icon name="lucide:check" class="mr-2 h-4 w-4" />
                      <span>Set as Default</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="deleteCard(card.id)" class="text-red-500">
                      <Icon name="lucide:trash-2" class="mr-2 h-4 w-4" />
                      <span>Remove Card</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Badge v-if="card.isDefault" class="mt-4">Default</Badge>
            </Card>
          </div>
        </div>
</template>
<script>
</script>