<script setup lang="ts" generic="T extends Record<string, any>">
import type { BulletLegendItemInterface } from '@unovis/ts'
import { cn } from '@/lib/utils'
import { ChartLegend, defaultColors } from '@/components/ui/chart'
import { Donut } from '@unovis/ts'
import VisDonut from '@unovis/vue/components/donut'
import { useMounted } from '@vueuse/core'
import { type Component, computed, ref, watchEffect } from 'vue'
import type { BasePieChartProps } from '.'

const props = withDefaults(defineProps<BasePieChartProps<T>>(), {
  showLegend: true,
  showLabels: true,
  innerRadius: 0.6,
})

const emits = defineEmits<{
  legendItemClick: [d: BulletLegendItemInterface, i: number]
}>()

const colors = computed(() => props.colors?.length ? props.colors : defaultColors(props.data.length))
const legendItems = ref<BulletLegendItemInterface[]>([])

const isMounted = useMounted()

// Update legend items when data changes
watchEffect(() => {
  legendItems.value = props.data.map((item, i) => ({
    name: String(item[props.label]),
    color: colors.value[i],
    inactive: false,
  }))
})

function handleLegendItemClick(d: BulletLegendItemInterface, i: number) {
  emits('legendItemClick', d, i)
}

// Format value for labels
function formatValue(value: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
</script>

<template>
  <div :class="cn('w-full h-[400px] flex flex-col items-end', $attrs.class ?? '')">
    <ChartLegend v-if="showLegend" v-model:items="legendItems" @legend-item-click="handleLegendItemClick" />

    <VisDonut
      :data="data"
      :style="{ height: isMounted ? '100%' : 'auto' }"
      :value="(d: T) => Number(d[value])"
      :color="colors"
      :arc-width="30"
      :inner-radius="innerRadius"
      :label="showLabels ? {
        text: (d: T) => `${formatValue(Number(d[value]))}`,
        position: 'outside'
      } : undefined"
      :label-line="showLabels ? { stroke: colors } : undefined"
      :arc-opacity="(d: T, i: number) => legendItems[i]?.inactive ? 0.2 : 1"
    />
  </div>
</template> 