// Grid-based pathfinding for robot movement

export interface GridPoint {
  x: number
  y: number
  row: number
  col: number
}

export interface GridConfig {
  cellSize: number
  rows: number
  cols: number
}

// Create grid based on viewport
export function createGrid(cellSize: number = 100): GridConfig {
  const cols = Math.ceil(window.innerWidth / cellSize)
  const rows = Math.ceil(window.innerHeight / cellSize)
  
  return { cellSize, rows, cols }
}

// Get all grid points
export function getAllGridPoints(config: GridConfig): GridPoint[] {
  const points: GridPoint[] = []
  
  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.cols; col++) {
      points.push({
        x: col * config.cellSize + config.cellSize / 2,
        y: row * config.cellSize + config.cellSize / 2,
        row,
        col
      })
    }
  }
  
  return points
}

// Find closest grid point to a position
export function findClosestGridPoint(
  x: number,
  y: number,
  config: GridConfig
): GridPoint {
  const col = Math.floor(x / config.cellSize)
  const row = Math.floor(y / config.cellSize)
  
  return {
    x: col * config.cellSize + config.cellSize / 2,
    y: row * config.cellSize + config.cellSize / 2,
    row: Math.max(0, Math.min(row, config.rows - 1)),
    col: Math.max(0, Math.min(col, config.cols - 1))
  }
}

// Calculate distance between two points
function distance(p1: GridPoint, p2: GridPoint): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

// Generate flowing path with random intermediate points
export function generateFlowingPath(
  start: GridPoint,
  end: GridPoint,
  config: GridConfig,
  randomPoints: number = 3
): GridPoint[] {
  const path: GridPoint[] = [start]
  
  // Calculate general direction
  const deltaCol = end.col - start.col
  const deltaRow = end.row - start.row
  
  // Generate random intermediate points that flow toward target
  const intermediatePoints: GridPoint[] = []
  
  for (let i = 1; i <= randomPoints; i++) {
    const progress = i / (randomPoints + 1)
    
    // Base position along the path
    const baseCol = Math.floor(start.col + deltaCol * progress)
    const baseRow = Math.floor(start.row + deltaRow * progress)
    
    // Add random offset
    const randomOffsetCol = Math.floor(Math.random() * 5) - 2 // -2 to +2
    const randomOffsetRow = Math.floor(Math.random() * 5) - 2
    
    const col = Math.max(0, Math.min(config.cols - 1, baseCol + randomOffsetCol))
    const row = Math.max(0, Math.min(config.rows - 1, baseRow + randomOffsetRow))
    
    intermediatePoints.push({
      x: col * config.cellSize + config.cellSize / 2,
      y: row * config.cellSize + config.cellSize / 2,
      row,
      col
    })
  }
  
  // Add intermediate points
  path.push(...intermediatePoints)
  
  // Add end point
  path.push(end)
  
  return path
}

// Generate smooth curve through grid points using Catmull-Rom
export function smoothPath(points: GridPoint[], segments: number = 20): Array<{x: number, y: number}> {
  if (points.length < 2) return points
  
  const smoothPoints: Array<{x: number, y: number}> = []
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]
    
    for (let t = 0; t < segments; t++) {
      const u = t / segments
      const point = catmullRom(p0, p1, p2, p3, u)
      smoothPoints.push(point)
    }
  }
  
  smoothPoints.push({ x: points[points.length - 1].x, y: points[points.length - 1].y })
  
  return smoothPoints
}

function catmullRom(
  p0: GridPoint,
  p1: GridPoint,
  p2: GridPoint,
  p3: GridPoint,
  t: number
): { x: number, y: number } {
  const t2 = t * t
  const t3 = t2 * t
  
  const x = 0.5 * (
    (2 * p1.x) +
    (-p0.x + p2.x) * t +
    (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
    (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
  )
  
  const y = 0.5 * (
    (2 * p1.y) +
    (-p0.y + p2.y) * t +
    (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
    (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
  )
  
  return { x, y }
}

// Get grid point near an element
export function getGridPointNearElement(
  element: HTMLElement,
  config: GridConfig,
  offset: { x: number, y: number } = { x: -150, y: 0 }
): GridPoint {
  const rect = element.getBoundingClientRect()
  
  const targetX = rect.left + rect.width / 2 + offset.x
  const targetY = rect.top + rect.height / 2 + offset.y
  
  return findClosestGridPoint(targetX, targetY, config)
}
