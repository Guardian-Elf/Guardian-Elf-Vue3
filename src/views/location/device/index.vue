<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备序列号" prop="deviceSerial">
        <el-input
          v-model="queryParams.deviceSerial"
          placeholder="请输入设备序列号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上报间隔(秒)" prop="reportInterval">
        <el-input
          v-model="queryParams.reportInterval"
          placeholder="请输入上报间隔(秒)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态(0禁用 1正常)" prop="isActive">
        <el-input
          v-model="queryParams.isActive"
          placeholder="请输入状态(0禁用 1正常)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最后通信时间" prop="lastSeenAt">
        <el-date-picker clearable
          v-model="queryParams.lastSeenAt"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择最后通信时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['location:device:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['location:device:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['location:device:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['location:device:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="deviceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="设备序列号" align="center" prop="deviceSerial" />
      <el-table-column label="设备名称" align="center" prop="name" />
      <el-table-column label="设备描述" align="center" prop="description" />
      <el-table-column label="上报间隔(秒)" align="center" prop="reportInterval" />
      <el-table-column label="状态(0禁用 1正常)" align="center" prop="isActive" />
      <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后通信时间" align="center" prop="lastSeenAt" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.lastSeenAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['location:device:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['location:device:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改设备信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="deviceRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备序列号" prop="deviceSerial">
          <el-input v-model="form.deviceSerial" placeholder="请输入设备序列号" />
        </el-form-item>
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="上报间隔(秒)" prop="reportInterval">
          <el-input v-model="form.reportInterval" placeholder="请输入上报间隔(秒)" />
        </el-form-item>
        <el-form-item label="状态(0禁用 1正常)" prop="isActive">
          <el-input v-model="form.isActive" placeholder="请输入状态(0禁用 1正常)" />
        </el-form-item>
        <el-form-item label="最后通信时间" prop="lastSeenAt">
          <el-date-picker clearable
            v-model="form.lastSeenAt"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择最后通信时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Device">
import { listDevice, getDevice, delDevice, addDevice, updateDevice } from "@/api/location/device"

const { proxy } = getCurrentInstance()

const deviceList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deviceSerial: null,
    name: null,
    description: null,
    reportInterval: null,
    isActive: null,
    lastSeenAt: null
  },
  rules: {
    deviceSerial: [
      { required: true, message: "设备序列号不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "设备名称不能为空", trigger: "blur" }
    ],
    description: [
      { required: true, message: "设备描述不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询设备信息列表 */
function getList() {
  loading.value = true
  listDevice(queryParams.value).then(response => {
    deviceList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

// 取消按钮
function cancel() {
  open.value = false
  reset()
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    deviceSerial: null,
    name: null,
    description: null,
    reportInterval: null,
    isActive: null,
    createdAt: null,
    lastSeenAt: null
  }
  proxy.resetForm("deviceRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加设备信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getDevice(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改设备信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["deviceRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateDevice(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addDevice(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value
  proxy.$modal.confirm('是否确认删除设备信息编号为"' + _ids + '"的数据项？').then(function() {
    return delDevice(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('location/device/export', {
    ...queryParams.value
  }, `device_${new Date().getTime()}.xlsx`)
}

getList()
</script>
