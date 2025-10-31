export { default as PieChart } from '@/components/ui/chart-pie/PieChart.vue'

import type { Spacing } from '@unovis/ts'

type KeyOf<T extends Record<string, any>> = Extract<keyof T, string>

export interface BasePieChartProps<T extends Record<string, any>> {
  /**
   * The source data array
   */
  data: T[]
  /**
   * The key to use for values in the pie chart
   */
  value: KeyOf<T>
  /**
   * The key to use for labels in the pie chart
   */
  label: KeyOf<T>
  /**
   * Custom colors for pie segments
   */
  colors?: string[]
  /**
   * Show or hide the legend
   * @default true
   */
  showLegend?: boolean
  /**
   * Show or hide value labels
   * @default true
   */
  showLabels?: boolean
  /**
   * Inner radius for donut effect (0-1)
   * @default 0.6
   */
  innerRadius?: number
} 