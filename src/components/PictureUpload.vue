<template>
  <el-upload
    v-model:file-list="fileList"
    :list-type="listType"
    :multiple="multiple"
    :limit="maxCount"
    :accept="acceptTypes.join(',')"
    :before-upload="beforeUpload"
    :http-request="handleUpload"
    :on-exceed="handleExceed"
    :on-remove="handleRemove"
    :class="{ 'hide-upload': hideUploadButton }"
  >
    <el-icon><Plus /></el-icon>

    <template #file="{ file }">
      <div class="uploaded-image">
        <img :src="file.url" class="image" />
        <span class="actions">
          <span class="action-item" @click="handlePreview(file)">
            <el-icon><ZoomIn /></el-icon>
          </span>
          <span
            v-if="!disabled"
            class="action-item"
            @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </div>
    </template>
    <template #tip>
      <div class="el-upload__tip">
        请上传 {{ acceptTypes.join("/") }} 格式图片，单张不超过 1GB
      </div>
    </template>
  </el-upload>
  <el-dialog v-model="dialogVisible" :title="dialogImageTitle">
    <img width="100%" :src="dialogImageUrl" alt="preview-image" />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { Plus, ZoomIn, Delete } from "@element-plus/icons-vue";
import { ElMessage, ElDialog } from "element-plus";
import type { UploadProps, UploadFile } from "element-plus";
import _http from "@/api/account";
import axios from "axios";

interface Props {
  modelValue?: string[]; // 绑定值（返回的key数组）
  listType?: "text" | "picture" | "picture-card"; // 列表样式
  maxCount?: number; // 最大上传数量
  multiple?: boolean; // 是否支持多选
  disabled?: boolean; // 是否禁用上传
}

const props = withDefaults(defineProps<Props>(), {
  listType: "picture-card",
  maxCount: 1,
  multiple: false,
  disabled: false,
});

const emit = defineEmits(["update:modelValue"]);

// 允许的文件类型
const acceptTypes = ["image/jpeg", "image/png", "image/jpg"];
const fileList = ref<Array<UploadFile & {uid: string}>>([]);
const dialogVisible = ref(false);
const dialogImageUrl = ref("");
const dialogImageTitle = ref("图片预览");

// 初始化已上传文件
watch(
  () => props.modelValue,
  (val) => {
    console.log("上传成功后", val);
    if (val && val.length > 0) {
      // 清空现有的 fileList
      fileList.value = [];
      console.log("val", val);
      fileList.value = val.map((url, index) => {
        return {
          uid: `init_${index}`,
          name: url.split("/").pop() || `image_${index}`,
          url,
          status: "success",
        }
      }) as Array<UploadFile & {uid: string}>
    } else {
      fileList.value = [];
    }
  },
  { immediate: true }
);

// 上传前校验
const beforeUpload: UploadProps["beforeUpload"] = (file) => {
  const isValidType = acceptTypes.includes(file.type);
  const isValidSize = file.size / 1024 / 1024 / 1024 <= 1; // 1GB限制

  if (!isValidType) {
    ElMessage.error(`只能上传 ${acceptTypes.join("/")} 格式图片!`);
    return false;
  }

  if (!isValidSize) {
    ElMessage.error("图片大小不能超过 1GB!");
    return false;
  }

  return true;
};

// 自定义上传
const handleUpload: UploadProps["httpRequest"] = async (options) => {
  console.log("handleUpload 方法被调用，options:", options); // 添加日志

  try {
    // 1. 获取签名
    const data = await _http.uploadConfig({
      file_name: options.file.name,
      // fileType: options.file.type,
    });
    console.log("上传data", data, options);
    // 2. 上传到OSS
    await axios.post(data.pre_sign_url, options.file, {
      headers: {
        "Content-Type": options.file.type || "application/octet-stream",
      },
      // 添加withCredentials支持
      withCredentials: false,
    });
    console.log("fileList.valuefileList.value", fileList.value, options);
    // const existingFile = fileList.value.filter((f) => f.status === 'success');
    // console.log("existingFileexistingFile", existingFile);
    // // 3. 更新文件列表
    // if (!existingFile) {
      // 3. 更新文件列表
      // fileList.value.push({
      //   uid: options.file.uid,
      //   name: options.file.name,
      //   url: data.access_url,
      //   status: "success",
      // });
    // }
    console.log("fileList.value", fileList.value);
    // 4. 更新绑定值（返回key数组）
    emit(
      "update:modelValue",
      [
      data.pre_sign_url
      ]
    );
  } catch (error) {
    ElMessage.error("上传失败");
    console.error("上传错误:", error);
  }
};
// 预览图片
const handlePreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
  dialogImageTitle.value = `预览 - ${file.name}`;
};
// 是否隐藏上传按钮
const hideUploadButton = computed(() => {
  return (
    props.disabled ||
    (props.maxCount > 0 && fileList.value.length >= props.maxCount)
  );
});

// 文件移除处理
const handleRemove: UploadProps["onRemove"] = (file) => {
  fileList.value = fileList.value.filter((f) => f.uid !== file.uid);
  emit(
    "update:modelValue",
    fileList.value.map((f) => f.url)
  );
};

// 超出限制提示
const handleExceed: UploadProps["onExceed"] = () => {
  ElMessage.warning(`最多只能上传 ${props.maxCount} 张图片`);
};
</script>

<style scoped>
.hide-upload ::v-deep(.el-upload--picture-card) {
  display: none;
}

.uploaded-image {
  position: relative;
  width: 100%;
  height: 100%;
}

.uploaded-image .image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.uploaded-image:hover .actions {
  opacity: 1;
}

.action-item {
  color: #fff;
  padding: 0 10px;
  cursor: pointer;
}
</style>
