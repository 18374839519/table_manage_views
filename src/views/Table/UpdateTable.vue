<template>
  <el-dialog
    v-model="visible"
    title="修改表信息"
    width="60%"
    :before-close="handleClose"
    destroy-on-close
    :draggable="true"
  >
    <template #footer>
      <el-button type="primary" @click="updateTable">确认</el-button>
      <el-button style="margin-left: 12px" @click="handleClose">取消</el-button>
    </template>
    <el-form ref="form" :model="formData" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="表名称：">
            {{ formData.tableName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表描述：">
            <el-input v-model.trim="formData.tableDesc" clearable placeholder="请输入表描述"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="表类型：">
            <el-select v-model.trim="formData.tableType" clearable placeholder="请选择表类型">
              <el-option v-for="(item, index) in tableTypeList" :key="index" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态：">
            <el-select v-model.trim="formData.status" clearable placeholder="请选择状态">
              <el-option v-for="(item, index) in statusList" :key="index" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>
import { updateTable } from '@/api/Tables'

export default {
  props: {
    record: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      visible: false,
      formData: {},
      tableTypeList: [
        { value: 1, label: '系统表' },
        { value: 2, label: '业务表' }
      ],
      statusList: [
        { value: 1, label: '可用' },
        { value: 2, label: '禁用' }
      ]
    }
  },
  methods: {
    updateTable() {
      updateTable(this.formData).then(res => {
        if (res && res.code === 200) {
          this.$message.success('表信息修改成功')
          this.handleClose()
        }
      })
    },
    handleClose() {
      this.$emit('closeUpdateTable')
    }
  },
  watch: {
    immediate: true,
    visible: {
      handler(val) {
        if (val) {
          this.formData = this.record
        }
      }
    }
  }
}
</script>
