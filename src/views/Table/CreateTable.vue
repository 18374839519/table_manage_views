<template>
  <el-dialog
    v-model="visible"
    title="创建表"
    width="60%"
    :before-close="handleClose"
    destroy-on-close
    :draggable="true"
  >
    <template #footer>
      <el-button type="primary" @click="createTable">确认</el-button>
      <el-button style="margin-left: 12px" @click="handleClose">取消</el-button>
    </template>
    <el-form ref="form" :model="formData" label-width="120px">
      <div class="form-split-div">表基本信息</div>
      <el-row>
        <el-col :span="12">
          <el-form-item label="表名称：">
            <el-input v-model.trim="formData.tableName" clearable placeholder="请输入表名称"></el-input>
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
      <el-row>
        <el-col :span="12">
          <el-form-item label="创建Java文件：">
            <el-radio-group v-model.trim="formData.createJavaFiles">
              <el-radio v-for="(item, index) in boolList" :key="index" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="form-split-div">表字段信息</div>
      <el-row>
        <el-col :span="4">字段名称</el-col>
        <el-col :span="4">字段描述</el-col>
        <el-col :span="4">字段类型</el-col>
        <el-col :span="4">字段长度</el-col>
        <el-col :span="4">是否主键</el-col>
        <el-col :span="4">操作</el-col>
      </el-row>
      <el-row v-for="(item, index) in formData.columnList" :key="index" style="padding: 8px 0;">
        <el-col :span="4" v-if="item.columnName !== 'id'">
          <el-select v-model.trim="item.columnName" clearable placeholder="请选择字段" v-infinite-scroll="getColumns" @change="selectColumn($event, index)">
            <el-option v-for="(item2, index2) in columnList" :key="index2" :value="item2.columnName" :label="item2.columnName"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4" v-else>{{ item.columnName }}</el-col>
        <el-col :span="4">{{ item.columnDesc }}</el-col>
        <el-col :span="4">{{ item.columnType === 'Number' ? '数字' : item.columnType === 'String' ? '字符串' : item.columnType === 'Date' ? '日期' : item.columnType === 'Blob' ? '文本' : item.columnType }}</el-col>
        <el-col :span="4">{{ item.columnLength === -1 ? '不限' : item.columnLength }}</el-col>
        <el-col :span="4">{{ item.primaryKey === 1 ? '是' : item.primaryKey === 2 ? '否' : item.primaryKey }}</el-col>
        <el-col :span="4">
          <a class="row-op-a" @click="addColumnRow">+</a>
          <a class="row-op-a" @click="removeColumnRow(index)" v-if="item.columnName !== 'id'">-</a>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>
import { getColumnPage } from '@/api/Column'
import { createTable } from '@/api/Tables'

export default {
  data() {
    return {
      visible: false,
      formData: {
        tableType: 2,
        status: 1,
        createJavaFiles: 2,
        columnList: []
      },
      tableTypeList: [
        { value: 1, label: '系统表' },
        { value: 2, label: '业务表' }
      ],
      statusList: [
        { value: 1, label: '可用' },
        { value: 2, label: '禁用' }
      ],
      boolList: [
        { value: 1, label: '是' },
        { value: 2, label: '否' }
      ],
      columnList: [],
      queryParam: {
        pageNo: 1
      },
      allowScroll: false
    }
  },
  methods: {
    initColumns() {
      getColumnPage(this.queryParam).then(res => {
        if (res && res.code === 200) {
          const rows = res.data.rows
          if (this.formData.columnList.length === 0) {
            const item = rows.filter(item => {
              if (item.columnName === 'id') {
                return item
              }
              return null
            })
            if (item !== null) {
              const firColumn = {
                columnName: item[0].columnName,
                columnDesc: item[0].columnDesc,
                columnType: item[0].columnType,
                columnLength: item[0].columnLength,
                primaryKey: item[0].primaryKey
              }
              this.formData.columnList.push(firColumn)
            }
          }
          rows.forEach(item => {
            this.columnList.push(item)
          })
        }
      })
    },
    createTable() {
      createTable(this.formData).then(res => {
        if (res && res.code === 200) {
          this.$message.success('创建成功')
          this.handleClose()
        }
      })
    },
    handleClose() {
      this.$emit('closeCreateTable')
    },
    addColumnRow() {
      const columnRow = {
        columnName: null,
        columnDesc: null,
        columnType: null,
        columnLength: null,
        primaryKey: null
      }
      this.formData.columnList.push(columnRow)
      this.allowScroll = true
    },
    removeColumnRow(index) {
      this.formData.columnList.splice(index, 1)
    },
    getColumns() {
      if (!this.allowScroll) {
        return
      }
      this.queryParam.pageNo = this.queryParam.pageNo + 1
      getColumnPage(this.queryParam).then(res => {
        const rows = res.data.rows
        const pageSize = res.data.pageSize
        this.allowScroll = rows.length === pageSize
        rows.forEach(item => {
          this.columnList.push(item)
        })
      })
    },
    selectColumn(val, index) {
      const data = this.columnList.filter(item => {
        if (item.columnName === val) {
          return item
        }
        return null
      })
      if (data !== null) {
        this.formData.columnList[index] = data[0]
      }
    }
  },
  watch: {
    immediate: true,
    visible: {
      handler(val) {
        if (val) {
          this.initColumns()
        }
      }
    }
  }
}
</script>
