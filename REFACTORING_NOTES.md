# Code Refactoring Notes - Prepaid UI Color Inversion

## Changes Completed

### 1. Color Scheme Inversion
- **Electricity**: Changed from Blue → Orange
- **Water**: Changed from Orange → Blue

### 2. Components Updated
- ✅ `components/wallet/KpiCards.vue` - Inverted colors for Total Spent (orange) and Total Purchases (blue)
- ✅ `components/wallet/RecentTransactions.vue` - Inverted electricity/water colors throughout
- ✅ `components/wallet/SpendingTrendsChart.vue` - Inverted chart colors and legend
- ✅ `pages/wallet/meters.vue` - Updated all utility type color methods
- ✅ `pages/wallet/transactions.vue` - Updated all utility type color methods and computed properties

### 3. Removed Components
- ✅ `components/wallet/BuyNow.vue` - Removed (buy section no longer needed)

## Color Mapping Reference

### Electricity (Now Orange)
- Background: `bg-orange-50`, `bg-orange-100`, `bg-orange-200`
- Text: `text-orange-600`, `text-orange-700`
- Borders: `border-orange-200`
- Hex: `#f97316` (orange-500)

### Water (Now Blue)
- Background: `bg-blue-50`, `bg-blue-100`, `bg-blue-200`
- Text: `text-blue-600`, `text-blue-700`
- Borders: `border-blue-200`
- Hex: `#3b82f6` (blue-500)

## Code Structure Improvements Needed

### 1. Centralize Color Utilities
**Recommendation**: Create a composable or utility file for utility colors

```typescript
// composables/useUtilityColors.ts
export const useUtilityColors = () => {
  const getElectricityColors = () => ({
    bg: 'bg-orange-50',
    bgHover: 'bg-orange-100',
    text: 'text-orange-600',
    border: 'border-orange-200',
    hex: '#f97316'
  })
  
  const getWaterColors = () => ({
    bg: 'bg-blue-50',
    bgHover: 'bg-blue-100',
    text: 'text-blue-600',
    border: 'border-blue-200',
    hex: '#3b82f6'
  })
  
  return { getElectricityColors, getWaterColors }
}
```

### 2. Extract Common Methods
**Recommendation**: Create shared utility functions for:
- `getServiceIcon()` - Icon mapping
- `getServiceIconBg()` - Background color mapping
- `getServiceIconColor()` - Text color mapping
- `getRemainingUnits()` - Units formatting
- `getRemainingUnitsBg()` - Units background colors

### 3. Component Organization
**Recommendation**: Group related components:
```
components/
  wallet/
    prepaid/
      - KpiCards.vue
      - RecentTransactions.vue
      - SpendingTrendsChart.vue
    postpaid/
      - (future components)
    shared/
      - DebitCard.vue
      - AddMeter.vue
```

### 4. Type Safety
**Recommendation**: Add TypeScript interfaces:
```typescript
interface UtilityType {
  type: 'Electricity' | 'Water'
  name: string
  icon: string
  colors: {
    bg: string
    text: string
    hex: string
  }
}
```

## Files That May Need Future Updates

- `components/wallet/DebitCard.vue` - General UI colors (not utility-specific)
- `layouts/wallet.vue` - General UI colors (not utility-specific)
- `pages/wallet/payments.vue` - General UI colors (not utility-specific)

## Notes
- General UI elements (buttons, cards, etc.) still use blue as the primary brand color
- Only utility-specific colors (electricity/water) were inverted
- Chart components now use inverted colors for data visualization

