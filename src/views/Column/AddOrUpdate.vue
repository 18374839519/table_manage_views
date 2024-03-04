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
      <el-button type="primary" @click="addOrUpdateColumn">确认</el-button>
      <el-button style="margin-left: 12px" @click="handleClose">取消</el-button>
    </template>
    <el-form ref="form" :model="formData" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="字段名称：">
            <el-input v-model.trim="formData.columnName" clearable placeholder="请输入字段名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字段描述：">
            <el-input v-model.trim="formData.columnDesc" clearable placeholder="请输入字段描述"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="字段类型：">
            <el-select v-model.trim="formData.columnType" clearable placeholder="请选择字段类型">
              <el-option v-for="(item, index) in columnTypeList" :key="index" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.columnType === 'String'">
          <el-form-item label="字段长度：">
            <el-radio-group v-model.trim="lengthType" style="width: 45%">
              <el-radio label="1">固定长度</el-radio>
              <el-radio label="2">不限</el-radio>
            </el-radio-group>
            <el-input-number v-model.trim="formData.columnLength" :min="1" :max="255" clearable placeholder="请输入字段长度" v-if="lengthType === '1'" style="width: 50%; margin-left: 5%;"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类型：">
            <el-select v-model.trim="formData.type" clearable placeholder="请选择类型">
              <el-option v-for="(item, index) in typeList" :key="index" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否主键：">
            <el-select v-model.trim="formData.primaryKey" clearable placeholder="请选择是否主键">
              <el-option v-for="(item, index) in primaryKeyList" :key="index" :value="item.value" :label="item.label"></el-option>
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
import { addColumn, updateColumn } from '@/api/Column'
export default {
  props: {
    isAdd: {
      type: Boolean,
      default: true
    },
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
      title: null,
      formData: {
        columnLength: -1,
        columnType: 'String',
        primaryKey: 2,
        status: 1
      },
      lengthType: '1',
      columnTypeList: [
        { value: 'Number', label: '数字' },
        { value: 'String', label: '字符串' },
        { value: 'Date', label: '日期' },
        { value: 'Blob', label: '文本' }
      ],
      primaryKeyList: [
        { value: 1, label: '是' },
        { value: 2, label: '否' }
      ],
      statusList: [
        { value: 1, label: '可用' },
        { value: 2, label: '禁用' }
      ],
      typeList: [
        { value: 1, label: '默认字段' },
        { value: 2, label: '自定义字段' }
      ]
    }
  },
  methods: {
    addOrUpdateColumn() {
      if (this.formData.columnType !== 'String' || this.lengthType !== '1') {
        this.formData.columnLength = -1
      }
      if (this.isAdd) {
        addColumn(this.formData).then(res => {
          if (res && res.code === 200) {
            this.$message.success('添加成功')
            this.handleClose()
          } else {
            console.log(res)
            // this.$message.error(res.message)
          }
        })
      } else {
        updateColumn(this.formData).then(res => {
          if (res && res.code === 200) {
            this.$message.success('修改成功')
            this.handleClose()
          } else {
            console.log(res)
            // this.$message.error(res.message)
          }
        })
      }
    },
    handleClose() {
      this.$emit('closeAddOrUpdate')
    }
  },
  watch: {
    immediate: true,
    visible: {
      handler(val) {
        if (val) {
          this.title = this.isAdd ? '添加字段' : '修改字段'
          if (this.isAdd) {
            this.formData = {
              columnLength: -1,
              columnType: 'String',
              primaryKey: 2,
              status: 1,
              type: 2
            }
          } else {
            this.formData = this.record
            this.lengthType = this.formData.columnType === 'String' && this.formData.columnLength > 0 ? '1' : '2'
          }
        }
      }
    }
  }
}
</script>
