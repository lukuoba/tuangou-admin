import regions from '@/assets/chinaRegions.json'

/**
 * 将扁平化的地区数据转换为级联选择器需要的树形结构
 */
export function getRegionTree() {
  const tree = []
  
  // 处理省级(第一级)
  const provinceCodes = Object.keys(regions['86'])
  provinceCodes.forEach(provinceCode => {
    const province = {
      value: provinceCode,
      label: regions['86'][provinceCode],
      children: []
    }
    
    // 处理市级(第二级)
    const cityCodes = Object.keys(regions[provinceCode] || {})
    cityCodes.forEach(cityCode => {
      const city = {
        value: cityCode,
        label: regions[provinceCode][cityCode],
        children: []
      }
      
      // 处理区级(第三级)
      const districtCodes = Object.keys(regions[cityCode] || {})
      districtCodes.forEach(districtCode => {
        city.children.push({
          value: districtCode,
          label: regions[cityCode][districtCode]
        })
      })
      
      province.children.push(city)
    })
    
    tree.push(province)
  })
  
  return tree
}

/**
 * 根据单个code获取地区名称
 */
export function getRegionName(code) {
  if (!code) return ''
  
  // 先检查是否是省级
  if (regions['86'] && regions['86'][code]) {
    return regions['86'][code]
  }
  
  // 检查其他层级
  for (const parentCode in regions) {
    if (regions[parentCode] && regions[parentCode][code]) {
      return regions[parentCode][code]
    }
  }
  
  return '未知地区'
}

/**
 * 根据编码数组获取完整中文地址路径
 * @param {string[]} codes 地区编码数组，如 ["450000", "450100", "450110"]
 * @param {string} separator 分隔符，默认为空
 * @returns {string} 中文地址，如 "广西壮族自治区/南宁市/武鸣区"
 */
export function getFullRegionName(codes, separator = '') {
  if (!Array.isArray(codes)) return ''
  
  return codes
    .map(code => getRegionName(code))
    .filter(name => name) // 过滤空值
    .join(separator)
}

/**
 * 根据编码数组获取包含各层级信息的对象
 * @param {string[]} codes 
 * @returns {{
 *   province: {code: string, name: string},
 *   city: {code: string, name: string},
 *   district: {code: string, name: string}
 * }}
 */
export function parseRegionCodes(codes) {
  if (!codes || codes.length === 0) return null
  
  return {
    province: {
      code: codes[0],
      name: getRegionName(codes[0])
    },
    city: codes[1] ? {
      code: codes[1],
      name: getRegionName(codes[1])
    } : null,
    district: codes[2] ? {
      code: codes[2],
      name: getRegionName(codes[2])
    } : null
  }
}


/**
 * 获取完整地区路径string
 * @param {Array} codes 地区code数组
 * @returns {string} 完整地区路径string
 */
export function getFullRegionPath(codes) {
  return codes.map(code => getRegionName(code)).join('/')
}