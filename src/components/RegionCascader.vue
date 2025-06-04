<template>
  <el-cascader
    v-model="selectedRegion"
    :options="regionOptions"
    :props="cascaderProps"
    clearable
    filterable
    placeholder="请选择省市区"
    @change="handleChange"
    style="width: 100%;"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getRegionTree } from '@/utils/regionUtil'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const regionOptions = ref([])
const selectedRegion = ref(props.modelValue)
const cascaderProps = {
  value: 'value',
  label: 'label',
  children: 'children',
  expandTrigger: 'hover'
}
// 加载地区数据
const loadRegions = async () => {
  regionOptions.value = getRegionTree()
}

const handleChange = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}

onMounted(() => {
  loadRegions()
})
</script>
<style scoped>
:deep(.el-cascader) {
  width: 100%;
}

/* 下拉菜单最大高度 */
:deep(.el-cascader__dropdown) {
  max-height: 400px;
}
</style>