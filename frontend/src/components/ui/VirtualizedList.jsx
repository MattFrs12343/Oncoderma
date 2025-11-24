import { memo, useCallback, useRef, useEffect } from 'react'
import { useVirtualizedList } from '../../hooks/useOptimizedState'

/**
 * Componente de lista virtualizada para manejar grandes cantidades de datos
 */
const VirtualizedList = memo(({
  items = [],
  itemHeight = 60,
  containerHeight = 400,
  renderItem,
  className = '',
  onScroll = null,
  overscan = 3,
  ...props
}) => {
  const containerRef = useRef(null)
  const { visibleItems, handleScroll, totalHeight } = useVirtualizedList(
    items,
    itemHeight,
    containerHeight
  )

  // Manejar scroll con callback personalizado
  const onScrollHandler = useCallback((e) => {
    handleScroll(e)
    onScroll?.(e)
  }, [handleScroll, onScroll])

  // Auto-scroll al top cuando cambian los items
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0
    }
  }, [items.length])

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={onScrollHandler}
      {...props}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${visibleItems.offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.items.map((item, index) => {
            const actualIndex = visibleItems.startIndex + index
            return (
              <div
                key={item.id || actualIndex}
                style={{ height: itemHeight }}
                className="flex items-center"
              >
                {renderItem(item, actualIndex)}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
})

VirtualizedList.displayName = 'VirtualizedList'

/**
 * Componente de tabla virtualizada
 */
export const VirtualizedTable = memo(({
  data = [],
  columns = [],
  rowHeight = 50,
  headerHeight = 40,
  containerHeight = 400,
  className = '',
  onRowClick = null,
  ...props
}) => {
  const renderRow = useCallback((row, index) => (
    <div
      className={`flex border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors`}
      onClick={() => onRowClick?.(row, index)}
    >
      {columns.map((column, colIndex) => (
        <div
          key={column.key || colIndex}
          className={`px-4 py-2 flex items-center ${column.className || ''}`}
          style={{ 
            width: column.width || `${100 / columns.length}%`,
            minWidth: column.minWidth || 'auto'
          }}
        >
          {column.render ? column.render(row[column.key], row, index) : row[column.key]}
        </div>
      ))}
    </div>
  ), [columns, onRowClick])

  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div 
        className="flex bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 font-semibold"
        style={{ height: headerHeight }}
      >
        {columns.map((column, index) => (
          <div
            key={column.key || index}
            className={`px-4 py-2 flex items-center text-gray-700 dark:text-gray-300 ${column.headerClassName || ''}`}
            style={{ 
              width: column.width || `${100 / columns.length}%`,
              minWidth: column.minWidth || 'auto'
            }}
          >
            {column.title}
          </div>
        ))}
      </div>

      {/* Virtualized Body */}
      <VirtualizedList
        items={data}
        itemHeight={rowHeight}
        containerHeight={containerHeight - headerHeight}
        renderItem={renderRow}
        {...props}
      />
    </div>
  )
})

VirtualizedTable.displayName = 'VirtualizedTable'

/**
 * Componente de grid virtualizado
 */
export const VirtualizedGrid = memo(({
  items = [],
  itemWidth = 200,
  itemHeight = 200,
  containerWidth = 800,
  containerHeight = 600,
  gap = 16,
  renderItem,
  className = '',
  ...props
}) => {
  const itemsPerRow = Math.floor((containerWidth + gap) / (itemWidth + gap))
  const rows = Math.ceil(items.length / itemsPerRow)
  const rowHeight = itemHeight + gap

  // Convertir items a filas
  const rowItems = []
  for (let i = 0; i < rows; i++) {
    const startIndex = i * itemsPerRow
    const endIndex = Math.min(startIndex + itemsPerRow, items.length)
    rowItems.push({
      id: i,
      items: items.slice(startIndex, endIndex),
      startIndex
    })
  }

  const renderRow = useCallback((row, rowIndex) => (
    <div 
      className="flex"
      style={{ 
        gap: gap,
        paddingLeft: gap / 2,
        paddingRight: gap / 2
      }}
    >
      {row.items.map((item, itemIndex) => (
        <div
          key={item.id || (row.startIndex + itemIndex)}
          style={{ 
            width: itemWidth, 
            height: itemHeight,
            flexShrink: 0
          }}
        >
          {renderItem(item, row.startIndex + itemIndex)}
        </div>
      ))}
    </div>
  ), [itemWidth, itemHeight, gap, renderItem])

  return (
    <VirtualizedList
      items={rowItems}
      itemHeight={rowHeight}
      containerHeight={containerHeight}
      renderItem={renderRow}
      className={className}
      {...props}
    />
  )
})

VirtualizedGrid.displayName = 'VirtualizedGrid'

export default VirtualizedList