import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 按需引入中文包

// 扩展插件（按需添加）
import relativeTime from 'dayjs/plugin/relativeTime'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import advancedFormat from 'dayjs/plugin/advancedFormat'

// 配置插件
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)

// 设置语言
dayjs.locale('zh-cn')

/**
 * 日期格式化
 * @param {Date|String|Number} date - 可被dayjs解析的日期
 * @param {String} format - 格式字符串
 * @returns {String} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return '--'
  
  // 处理常见时间格式
  const dateObj = dayjs(
    typeof date === 'string' && date.includes('T') 
      ? date.replace('T', ' ') 
      : date
  )
  
  return dateObj.isValid() 
    ? dateObj.format(format) 
    : '无效日期'
}
import { h } from 'vue'

export function formatDateVNode(date, format = 'YYYY-MM-DD') {
  if (!date) return h('span', '--')
  const formatted = dayjs(date).format(format)
  return h('span', formatted)
}


/**
 * 获取相对时间
 * @param {Date|String|Number} date - 目标日期
 * @returns {String} 相对时间描述
 */
export function getRelativeTime(date) {
  return dayjs(date).fromNow()
}

/**
 * 日期计算
 * @param {Date|String|Number} date - 基准日期
 * @param {Number} value - 增减值
 * @param {String} unit - 单位（day/month/year等）
 * @returns {dayjs.Dayjs} 计算后的日期对象
 */
export function calculateDate(date, value, unit) {
  return dayjs(date).add(value, unit)
}

// 导出原始dayjs实例以便特殊需求使用
export { dayjs as default }