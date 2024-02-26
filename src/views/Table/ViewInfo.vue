<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="60%"
    :before-close="handleClose"
    destroy-on-close
    :draggable="true"
  >
    <template #footer>
      <el-button style="margin-left: 12px" @click="handleClose">关闭</el-button>
    </template>
    <el-input type="textarea" v-model.trim="info" rows="16" readonly></el-input>
  </el-dialog>
</template>
<script>
import { getTableDdl, getTableDml } from '@/api/Tables'

export default {
  props: {
    tableName: {
      type: String,
      default: null
    },
    viewType: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      visible: false,
      title: null,
      info: null
    }
  },
  methods: {
    initInfo() {
      if (this.viewType === 'DDL') {
        getTableDdl(this.tableName).then(res => {
          if (res && res.code === 200) {
            this.info = res.data
          }
        })
      } else if (this.viewType === 'DML') {
        getTableDml(this.tableName).then(res => {
          if (res && res.code === 200) {
            this.info = res.data
          }
        })
      }
    },
    handleClose() {
      this.$emit('closeViewInfo')
    }
  },
  watch: {
    immediate: true,
    visible: {
      handler(val) {
        if (val) {
          this.title = '查看表【' + this.tableName + '】' + this.viewType
          this.initInfo()
        }
      }
    }
  }
}
</script>
