/**
 * Converte objeto de snake_case para camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Converte objeto de camelCase para snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

/**
 * Converte objeto completo de snake_case para camelCase
 */
export function convertKeysToCamelCase<T = any>(obj: any): T {
  if (obj === null || obj === undefined) {
    return obj
  }
  
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase) as T
  }
  
  if (typeof obj === 'object' && obj.constructor === Object) {
    const converted: any = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const camelKey = snakeToCamel(key)
        converted[camelKey] = convertKeysToCamelCase(obj[key])
      }
    }
    return converted as T
  }
  
  return obj as T
}

/**
 * Converte objeto completo de camelCase para snake_case
 */
export function convertKeysToSnakeCase<T = any>(obj: any): T {
  if (obj === null || obj === undefined) {
    return obj
  }
  
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToSnakeCase) as T
  }
  
  if (typeof obj === 'object' && obj.constructor === Object) {
    const converted: any = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const snakeKey = camelToSnake(key)
        converted[snakeKey] = convertKeysToSnakeCase(obj[key])
      }
    }
    return converted as T
  }
  
  return obj as T
}

