<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="速度(节)" prop="speedKnots">
        <el-input
          v-model="queryParams.speedKnots"
          placeholder="请输入速度(节)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="速度(km/h)" prop="speedKmh">
        <el-input
          v-model="queryParams.speedKmh"
          placeholder="请输入速度(km/h)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="真北航向" prop="courseTrue">
        <el-input
          v-model="queryParams.courseTrue"
          placeholder="请输入真北航向"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="磁偏角" prop="magneticVariation">
        <el-input
          v-model="queryParams.magneticVariation"
          placeholder="请输入磁偏角"
          clearable
          @keyup.enter="handleQuery"
        />
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
          v-hasPermi="['location:motion:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['location:motion:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['location:motion:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['location:motion:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="motionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="GPS数据ID" align="center" prop="id" />
      <el-table-column label="速度(节)" align="center" prop="speedKnots" />
      <el-table-column label="速度(km/h)" align="center" prop="speedKmh" />
      <el-table-column label="真北航向" align="center" prop="courseTrue" />
      <el-table-column label="磁偏角" align="center" prop="magneticVariation" />
      <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['location:motion:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['location:motion:remove']">删除</el-button>
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

    <!-- 添加或修改运动信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="motionRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="速度(节)" prop="speedKnots">
          <el-input v-model="form.speedKnots" placeholder="请输入速度(节)" />
        </el-form-item>
        <el-form-item label="速度(km/h)" prop="speedKmh">
          <el-input v-model="form.speedKmh" placeholder="请输入速度(km/h)" />
        </el-form-item>
        <el-form-item label="真北航向" prop="courseTrue">
          <el-input v-model="form.courseTrue" placeholder="请输入真北航向" />
        </el-form-item>
        <el-form-item label="磁偏角" prop="magneticVariation">
          <el-input v-model="form.magneticVariation" placeholder="请输入磁偏角" />
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

<script setup name="Motion">
import { listMotion, getMotion, delMotion, addMotion, updateMotion } from "@/api/location/motion"

const { proxy } = getCurrentInstance()

const motionList = ref([])
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
    speedKnots: null,
    speedKmh: null,
    courseTrue: null,
    magneticVariation: null,
  },
  rules: {
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询运动信息列表 */
function getList() {
  loading.value = true
  listMotion(queryParams.value).then(response => {
    motionList.value = response.rows
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
    speedKnots: null,
    speedKmh: null,
    courseTrue: null,
    magneticVariation: null,
    createdAt: null
  }
  proxy.resetForm("motionRef")
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
  title.value = "添加运动信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getMotion(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改运动信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["motionRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateMotion(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addMotion(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除运动信息编号为"' + _ids + '"的数据项？').then(function() {
    return delMotion(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('location/motion/export', {
    ...queryParams.value
  }, `motion_${new Date().getTime()}.xlsx`)
}

getList()
</script>
