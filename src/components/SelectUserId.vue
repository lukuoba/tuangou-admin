<template>
    <el-select
      v-model="selectedValue"
      filterable
      remote
      reserve-keyword
      placeholder="请输入用户名或手机号搜索"
      :remote-method="debouncedSearch"
      :loading="loading"
      @change="handleSelectChange"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="formatLabel(item)"
        :value="item.id"
      >
        <span style="float: left">{{ item.username }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">
          {{ item.phone }}
        </span>
      </el-option>
      
      <!-- 新增：当有选中项但不在options中时显示 -->
      <template v-if="selectedItem && !options.some(item => item.id === selectedValue)">
        <el-option
          :key="selectedItem.id"
          :label="formatLabel(selectedItem)"
          :value="selectedItem.id"
          disabled
        >
          <span style="float: left">{{ selectedItem.username }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">
            {{ selectedItem.phone }}
          </span>
        </el-option>
      </template>
    </el-select>
  </template>

<script setup>
import { ref, onMounted,watch } from "vue";
import { debounce } from "lodash-es"; // 或者自己实现防抖
import _http from "@/api/account.js"; // 你的搜索接口

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const selectedValue = ref(props.modelValue);
const options = ref([]);
const loading = ref(false);

// 防抖搜索函数 (500ms延迟)
const debouncedSearch = debounce(async (query) => {
  if (!query.trim()) {
    options.value = [];
    return;
  }

  try {
    loading.value = true;
    const res = await _http.searchUsers({ keyword: query });
    options.value = res.data || [];
  } catch (error) {
    console.error("搜索失败", error);
    options.value = [];
  } finally {
    loading.value = false;
  }
}, 500);

// 格式化显示文本
const formatLabel = (item) => {
  return `${item.username} (${item.phone})`;
};

// 选择项变化处理
const handleSelectChange = (value) => {
  console.log("是否粗发函数", 1212112);
  emit("update:modelValue", value);
  const selectedItem = options.value.find((item) => item.id === value);
  emit("change", { id: value, item: selectedItem });
};

// 新增：存储当前选中的完整对象
const selectedItem = ref(null);

// 监听props变化
watch(() => props.modelValue, async (newVal) => {
  if (newVal && !options.value.some(item => item.id === newVal)) {
    await loadSelectedUser(newVal);
  }
});

// 加载已选用户信息
const loadSelectedUser = async (userId) => {
  try {
    loading.value = true;
    const res = await _http.getAccountById(userId); // 需要新增这个API
    if (res.data) {
      options.value = [res.data, ...options.value];
      selectedItem.value = res.data;
    }
  } catch (error) {
    console.error("加载用户失败", error);
  } finally {
    loading.value = false;
  }
};

// 初始化加载
onMounted(async () => {
  if (selectedValue.value) {
    await loadSelectedUser(selectedValue.value);
  }
});

</script>

<style scoped>
/* 调整下拉选项样式 */
:deep(.el-select-dropdown__item) {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
