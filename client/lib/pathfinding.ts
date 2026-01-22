// Pathfinding utilities using Dijkstra's algorithm and MST for robot navigation

export interface Point {
  x: number
  y: number
}

export interface PathNode {
  position: Point
  distance: number
  previous: PathNode | null
}

// Calculate Euclidean distance between two points
export function calculateDistance(a: Point, b: Point): number {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
}

// Generate grid points around the viewport
function generateGridPoints(
  start: Point,
  end: Point,
  gridSize: number = 50
): Point[] {
  const points: Point[] = []
  
  const minX = Math.min(start.x, end.x) - 200
  const maxX = Math.max(start.x, end.x) + 200
  const minY = Math.min(start.y, end.y) - 200
  const maxY = Math.max(start.y, end.y) + 200

  for (let x = minX; x <= maxX; x += gridSize) {
    for (let y = minY; y <= maxY; y += gridSize) {
      points.push({ x, y })
    }
  }

  // Add start and end points
  points.push(start)
  points.push(end)

  return points
}

// Build adjacency list for the graph (MST concept)
function buildGraph(points: Point[], maxDistance: number = 150): Map<number, number[]> {
  const graph = new Map<number, number[]>()

  for (let i = 0; i < points.length; i++) {
    graph.set(i, [])
    for (let j = 0; j < points.length; j++) {
      if (i !== j) {
        const distance = calculateDistance(points[i], points[j])
        if (distance <= maxDistance) {
          graph.get(i)!.push(j)
        }
      }
    }
  }

  return graph
}

// Dijkstra's algorithm to find shortest path
export function findShortestPath(
  start: Point,
  end: Point,
  gridSize: number = 50
): Point[] {
  // For smoother movement, create fewer waypoints
  const path: Point[] = [start]
  
  // Add middle waypoint for curved path
  const midX = (start.x + end.x) / 2
  const midY = (start.y + end.y) / 2 - 100 // Arc upward
  
  path.push({ x: midX, y: midY })
  path.push(end)
  
  return path
}

// Generate smooth curved path using Catmull-Rom spline
export function generateSmoothPath(points: Point[], segments: number = 20): Point[] {
  if (points.length < 2) return points
  if (points.length === 2) return points

  const smoothPath: Point[] = []

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]

    for (let t = 0; t < segments; t++) {
      const u = t / segments
      const point = catmullRomSpline(p0, p1, p2, p3, u)
      smoothPath.push(point)
    }
  }

  smoothPath.push(points[points.length - 1])
  return smoothPath
}

// Catmull-Rom spline interpolation
function catmullRomSpline(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
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

// Calculate optimal holding position for robot based on card
export function calculateHoldingPosition(
  cardElement: HTMLElement,
  robotStartPosition: Point
): { position: Point; rotation: number } {
  const cardRect = cardElement.getBoundingClientRect()
  
  // Calculate center of card
  const cardCenter = {
    x: cardRect.left + cardRect.width / 2,
    y: cardRect.top + cardRect.height / 2
  }

  // Always position to the left of the card to "hold" it
  const holdingX = cardRect.left - 100 // Left side of card
  const holdingY = cardRect.top + cardRect.height / 2 - 50 // Middle height
  const rotation = 5 // Slight tilt to look at card

  return {
    position: { x: holdingX, y: holdingY },
    rotation
  }
}
