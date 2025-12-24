<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备ID" prop="deviceId">
        <el-input
          v-model="queryParams.deviceId"
          placeholder="请输入设备ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="光照强度(lux)" prop="illuminance">
        <el-input
          v-model="queryParams.illuminance"
          placeholder="请输入光照强度(lux)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="温度(°C)" prop="temperature">
        <el-input
          v-model="queryParams.temperature"
          placeholder="请输入温度(°C)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="湿度(%)" prop="humidity">
        <el-input
          v-model="queryParams.humidity"
          placeholder="请输入湿度(%)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="气压(hPa)" prop="pressure">
        <el-input
          v-model="queryParams.pressure"
          placeholder="请输入气压(hPa)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备时间" prop="localTime">
        <el-date-picker clearable
          v-model="queryParams.localTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择设备时间">
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
          v-hasPermi="['location:environment:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['location:environment:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['location:environment:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['location:environment:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="environmentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="设备ID" align="center" prop="deviceId" />
      <el-table-column label="光照强度(lux)" align="center" prop="illuminance" />
      <el-table-column label="温度(°C)" align="center" prop="temperature" />
      <el-table-column label="湿度(%)" align="center" prop="humidity" />
      <el-table-column label="气压(hPa)" align="center" prop="pressure" />
      <el-table-column label="设备时间" align="center" prop="localTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.localTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['location:environment:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['location:environment:remove']">删除</el-button>
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

    <!-- 添加或修改环境数据对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="environmentRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备ID" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入设备ID" />
        </el-form-item>
        <el-form-item label="光照强度(lux)" prop="illuminance">
          <el-input v-model="form.illuminance" placeholder="请输入光照强度(lux)" />
        </el-form-item>
        <el-form-item label="温度(°C)" prop="temperature">
          <el-input v-model="form.temperature" placeholder="请输入温度(°C)" />
        </el-form-item>
        <el-form-item label="湿度(%)" prop="humidity">
          <el-input v-model="form.humidity" placeholder="请输入湿度(%)" />
        </el-form-item>
        <el-form-item label="气压(hPa)" prop="pressure">
          <el-input v-model="form.pressure" placeholder="请输入气压(hPa)" />
        </el-form-item>
        <el-form-item label="设备时间" prop="localTime">
          <el-date-picker clearable
            v-model="form.localTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择设备时间">
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

<script setup name="Environment">
import { listEnvironment, getEnvironment, delEnvironment, addEnvironment, updateEnvironment } from "@/api/location/environment"

const { proxy } = getCurrentInstance()

const environmentList = ref([])
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
    deviceId: null,
    illuminance: null,
    temperature: null,
    humidity: null,
    pressure: null,
    localTime: null,
  },
  rules: {
    deviceId: [
      { required: true, message: "设备ID不能为空", trigger: "blur" }
    ],
    localTime: [
      { required: true, message: "设备时间不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询环境数据列表 */
function getList() {
  loading.value = true
  listEnvironment(queryParams.value).then(response => {
    environmentList.value = response.rows
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
    deviceId: null,
    illuminance: null,
    temperature: null,
    humidity: null,
    pressure: null,
    localTime: null,
    createdAt: null
  }
  proxy.resetForm("environmentRef")
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
  title.value = "添加环境数据"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getEnvironment(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改环境数据"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["environmentRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateEnvironment(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addEnvironment(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除环境数据编号为"' + _ids + '"的数据项？').then(function() {
    return delEnvironment(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('location/environment/export', {
    ...queryParams.value
  }, `environment_${new Date().getTime()}.xlsx`)
}

getList()
</script>
