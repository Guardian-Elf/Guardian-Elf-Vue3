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
      <el-form-item label="加速度X轴(g)" prop="accelX">
        <el-input
          v-model="queryParams.accelX"
          placeholder="请输入加速度X轴(g)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="加速度Y轴(g)" prop="accelY">
        <el-input
          v-model="queryParams.accelY"
          placeholder="请输入加速度Y轴(g)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="加速度Z轴(g)" prop="accelZ">
        <el-input
          v-model="queryParams.accelZ"
          placeholder="请输入加速度Z轴(g)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="陀螺仪X轴(°/s)" prop="gyroX">
        <el-input
          v-model="queryParams.gyroX"
          placeholder="请输入陀螺仪X轴(°/s)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="陀螺仪Y轴(°/s)" prop="gyroY">
        <el-input
          v-model="queryParams.gyroY"
          placeholder="请输入陀螺仪Y轴(°/s)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="陀螺仪Z轴(°/s)" prop="gyroZ">
        <el-input
          v-model="queryParams.gyroZ"
          placeholder="请输入陀螺仪Z轴(°/s)"
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
          v-hasPermi="['location:speed:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['location:speed:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['location:speed:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['location:speed:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="speedList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="设备ID" align="center" prop="deviceId" />
      <el-table-column label="加速度X轴(g)" align="center" prop="accelX" />
      <el-table-column label="加速度Y轴(g)" align="center" prop="accelY" />
      <el-table-column label="加速度Z轴(g)" align="center" prop="accelZ" />
      <el-table-column label="陀螺仪X轴(°/s)" align="center" prop="gyroX" />
      <el-table-column label="陀螺仪Y轴(°/s)" align="center" prop="gyroY" />
      <el-table-column label="陀螺仪Z轴(°/s)" align="center" prop="gyroZ" />
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
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['location:speed:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['location:speed:remove']">删除</el-button>
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

    <!-- 添加或修改运动数据对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="speedRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备ID" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入设备ID" />
        </el-form-item>
        <el-form-item label="加速度X轴(g)" prop="accelX">
          <el-input v-model="form.accelX" placeholder="请输入加速度X轴(g)" />
        </el-form-item>
        <el-form-item label="加速度Y轴(g)" prop="accelY">
          <el-input v-model="form.accelY" placeholder="请输入加速度Y轴(g)" />
        </el-form-item>
        <el-form-item label="加速度Z轴(g)" prop="accelZ">
          <el-input v-model="form.accelZ" placeholder="请输入加速度Z轴(g)" />
        </el-form-item>
        <el-form-item label="陀螺仪X轴(°/s)" prop="gyroX">
          <el-input v-model="form.gyroX" placeholder="请输入陀螺仪X轴(°/s)" />
        </el-form-item>
        <el-form-item label="陀螺仪Y轴(°/s)" prop="gyroY">
          <el-input v-model="form.gyroY" placeholder="请输入陀螺仪Y轴(°/s)" />
        </el-form-item>
        <el-form-item label="陀螺仪Z轴(°/s)" prop="gyroZ">
          <el-input v-model="form.gyroZ" placeholder="请输入陀螺仪Z轴(°/s)" />
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

<script setup name="Speed">
import { listSpeed, getSpeed, delSpeed, addSpeed, updateSpeed } from "@/api/location/speed"

const { proxy } = getCurrentInstance()

const speedList = ref([])
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
    accelX: null,
    accelY: null,
    accelZ: null,
    gyroX: null,
    gyroY: null,
    gyroZ: null,
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

/** 查询运动数据列表 */
function getList() {
  loading.value = true
  listSpeed(queryParams.value).then(response => {
    speedList.value = response.rows
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
    accelX: null,
    accelY: null,
    accelZ: null,
    gyroX: null,
    gyroY: null,
    gyroZ: null,
    localTime: null,
    createdAt: null
  }
  proxy.resetForm("speedRef")
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
  title.value = "添加运动数据"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getSpeed(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改运动数据"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["speedRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateSpeed(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addSpeed(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除运动数据编号为"' + _ids + '"的数据项？').then(function() {
    return delSpeed(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('location/speed/export', {
    ...queryParams.value
  }, `speed_${new Date().getTime()}.xlsx`)
}

getList()
</script>
