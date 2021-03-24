//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return decodeURI(r[2]); return null; //返回参数值
}
let th = null
new Vue({
  el:'#app',
  data () {
    return {
       screen: 1920,
        //语言名称
      lang:{
        zjmf_api_power_status_unpaused:"解除暂停",
        zjmf_api_crackpass: "重置密码",
        zjmf_api_hardoff: "硬关机",
        zjmf_api_hardreboot: "硬重启",
        zjmf_api_off: "关机",
        zjmf_api_on: "开机",
        zjmf_api_power_status_unknown: "未知",
        zjmf_api_reboot: "重启",
        zjmf_api_reinstall: "重装系统",
        zjmf_check_password: "密码不能为空",
        zjmf_client_backup_ok: "我已完成备份",
        zjmf_client_changedate: "选择日期时间",
        zjmf_client_copy_error: "复制失败",
        zjmf_client_copy_success: "复制成功",
        zjmf_client_data_no: "暂无数据",
        zjmf_client_default: "默认",
        zjmf_client_ipaddressNum: "IP地址(个)",
        zjmf_client_nat_acl: "NAT转发",
        zjmf_client_nat_web: "建站",
        zjmf_client_os: "系统",
        zjmf_client_password: "请输入密码",
        zjmf_client_password_error: "密码必须由超过6位的大写字母小写字母和数字组成",
        zjmf_client_port: "端口",
        zjmf_client_security: "安全组",
        zjmf_client_setting: "设置",
        zjmf_client_snap_backup: "快照/备份",
        zjmf_client_traffic_usage: "流量使用",
        zjmf_client_usage: "用量",
        zjmf_client_usage_chart: "用量统计图",
        zjmf_client_username: "用户名",
        zjmf_layer_cancel: "取消",
        zjmf_layer_confirm: "确认",
        zjmf_layer_content_password: "密码",
        zjmf_layer_panel_pass:"面板密码",
        zjmf_clients_repassword_1:"当前操作需要实例在关机状态下进行：",
        zjmf_clients_repassword_2:"为了避免数据丢失，实例将关机中断您的业务，请仔细确认。",
        zjmf_clients_repassword_3:"强制关机可能会导致数据丢失或文件系统损坏，您也可以主动关机后再进行操作。",
        zjmf_clients_repassword_4:"强制关机",
        zjmf_clients_repassword_5:"同意强制关机",
        zjmf_clients_repassword_6:"请勾选同意强制关机",
        zjmf_backup_restore_will_delete_snap: "备份还原会删除当前磁盘的所有快照",
        zjmf_reinstall_confirm: "重装系统将会导致系统盘快照丢失，确认重装？"  
      },
      hid: getUrlParam('id'), // hostid
      baseData: { // 产品基础数据
        config_options: [],
        host_data: {
          assignedips: []
        },
        nat:{
          backup_num:-1,
          snap_num:-1
        },
        second: { // 二次验证控制字段
          second_verify_action_home: []
        }
      },
      module_chart: [],
      createTime: new Date(),
      moduleData: { // 模块数据
        module_button: {
          console: [],
          control: []
        },
        module_chart: [],
        module_client_area: [],
        control_view: {}
      },

      // ========== 头部 ==========
      timeOut: null,
      timeInterval: null,
      powerStatus: { // 电源状态
        status: '',
        des: ''
      },
      showpassword:true,
      showpanelpassword:true,
      powerLoading: false, // 电源状态加载中

      // 控制台
      consoleItem: null,

      // 控制按钮
      controlItem: null,
      // 破解密码
      crackDialog: false,
      crackFrom: {
        password: '',
        agree:''
      },
      // 重装系统
      reinstallDialog: false,
      osSvgSelected: undefined, // 选中的操作系统图标
      cloudOsGroupOptions: [], // 重装系统分组选项
      cloudOsOptions: [], // 重装系统子选项
      filterOsOptions: [], // 筛选后的选项
      reInstallChecked: false,
      reinstallFormData: { // 重装系统表单数据
        groupVal: '',
        osVal: '',
        password:''
      },
      
      // 二次验证弹窗
      secondVerifyVis: false,
      btnLoading: false,
      secondAction: '', // 二次验证动作

      // 取消请求
      host_cancel: {
        init: true // 此字段用于控制按钮显隐, 无实用, 初始进入页面, 两个按钮都不显示
      },
      cancelistOptions: [],
      cancelDialog: false,
      cancelFormData: {
        id: this.id,
        type: undefined,
        reason: '',
        tempReason: undefined // 中间值, 下拉绑定的值, 当选择其他时, reason取值文本域的值, 否则reason直接取值tempReason
      },
      cancelRules: {
        type: [{ required: true, message: '请选择时间', trigger: 'change' }],
        reason: [{ required: true, message: '请输入原因', trigger: 'blur' }],
        tempReason: [{ required: true, message: '请选择原因', trigger: 'change' }]
      },

      // ========== 左侧 ==========
      flowChart: null, // 流量使用情况图

      // 订购流量弹窗
      tabIndex: 1, // 弹窗tab
      flowDialogVisible: false,
      flowTableData: [], // 流量包列表
      recordeTableData: [], // 订购记录列表
      // 流量包列表 订购记录列表, 前端分页
      flowPage: 1, // 当前页
      flowLimit: 6, // 每页多少数据
      recordPage: 1, // 当前页
      recordLimit: 6, // 每页多少数据

      
      //lang
      
      
      // 续费信息
      renewData: {
        currency: {},
        cycle: [],
        host: {}
      },
      overdue: '', // 剩余天数/小时数
      // 续费弹窗
      renewDialogVisible: false,
      renewCycle: '', // 续费周期
      renewPrice: '', // 续费价格
      pricingLoading: false, // 续费价格计算中
      renewRecordTableData: [],
      renewRecordSearch: { // 续费充值记录查询条件
        hostid: this.id,
        page: 1,
        limit: 10,
        order: 'trans_id',
        sort: 'desc',
        keywords: '' // 关键字搜索(trans_id,amount_in)
      },
      renewTotal: 0,

      // 修改备注用
      remarkVis: false,
      remarkFormData: {
        remark: undefined
      },
      remarkRules: {
        remark: [{
          required: true,
          message: '请输入备注',
          trigger: 'blur'
        }]
      },
        
      // ========== 右侧 ==========
      tabActiveName: '1', // tab name 最好使用数字, 后面自定义tab页, 需用来逻辑判断
      htmlContent: '', // 用户自定义页面

      //============用量统计========
      usedStartTime: undefined,
      usedEndTime: undefined,
      usedChart: null,
      pickerOptions:{
        disabledDate (time) {
          const toDayDate = th.createTime
          return time.getTime() - new Date(toDayDate).getTime() + 24 * 60 * 60 * 1000 < 0 || time.getTime() - new Date().getTime() >= 0
        }
      }
    }
  },
  methods: {
    // 获取页面基础数据
    async getBaseData () {
      const { data } = await hostProductReq({ action: 'productdetails',id: this.hid,ac: 'product' })
      if (data.status !== 200) return false
      data.data.host_data.assignedips = this.assignedipsChange(data.data.host_data.assignedips)
      this.renewCycle = data.data.host_data.billingcycle // 设置续费周期默认值

      this.baseData = data.data
      this.lang = data.data.lang
      // 流量使用情况统计图 数据
      // const totalFlow = data.data.host_data.bwlimit // 总流量
      // const usedFlow = data.data.host_data.bwusage // 已用流量
      // const chartData = [
      //   {
      //     name: '剩余流量',
      //     value: totalFlow - usedFlow
      //   },
      //   {
      //     name: '已用流量',
      //     value: usedFlow
      //   }
      // ]
      // this.chartOption(totalFlow, chartData.filter(m => { return m.value !== 0 }))

      // 获取续费数据
      //this.getPriceData()

      // 获取模块数据
      this.getModuleData(data.data.host_data)
    },

    // 获取模块数据
    async getModuleData (e) {
      const params = {
        action: 'productdetails',
        id: this.hid,  
        ac:'moudle',  
        host_id: e.host_id,
        productid: e.productid,
        api_type: e.api_type,
        domainstatus: e.domainstatus,
        type: e.type,
        zjmf_api_id: e.zjmf_api_id,
        dcimid: e.dcimid,
        bwlimit: e.bwlimit
      }
      const { data } = await hostMoudleReq(params)
      if (data.status !== 200) return false

      this.moduleData = data.data
      // 电源状态
      if (data.data.control_view.module_power_status) {
        this.getPowerStatus()
      } else {
        this.powerStatus.status = 'unknown'
        this.powerStatus.des = '未知'
      }

      // 没有图标时, 默认展示第二个tab页
      /*if (data.data.module_chart.length) {
        this.tabActiveName = '1'
      } else {
        this.tabActiveName = '2'
      }*/
    },
    // 生成唯一标识
    guid () {
      return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0; var v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    },
    // 处理头部ip的数据
    assignedipsChange (ipArr) {
      const tempArr = [];
      (ipArr || []).forEach(item => {
        tempArr.push({
          ip: item,
          color: '#333333',
          guid: this.guid()
        })
      })
      return tempArr
    },

    // ========== 头部 ==========
    // 获取电源状态
    async getPowerStatus () {
      const tempStatus = this.powerStatus.status // 临时变量
      const obj = {
        id: this.hid,
        func: 'status'
      }
      this.powerLoading = true
      const { data } = await defaultControlReq(obj)
      if (data.status !== 200) {
        this.powerStatus.status = 'unknown'
        this.powerStatus.des = data.msg
      } else {
        this.powerStatus.status = data.data ? data.data.status : 'unknown'
        this.powerStatus.des = data.data ? data.data.des : '未知'

        if (tempStatus !== data.data.status && data.data.status !== 'process') { // 状态改变, 清除定时器
          clearInterval(this.timeInterval)
        }
      }
      this.powerLoading = false
    },
    // 查询电源状态 3秒钟一次 两分钟清除
    refreashPowerStatusCycle () {
      clearTimeout(this.timeOut)
      clearInterval(this.timeInterval)
      // 点击开启刷新状态  3s一次
      this.timeInterval = setInterval(this.getPowerStatus, 3000)
      // 两分钟后结束掉刷新状态
      this.timeOut = setTimeout(() => {
        clearInterval(this.timeInterval)
      }, 60000 * 2)
    },
    // 手动刷新电源状态
    handlePowerStatus () {
      if (this.moduleData.control_view.module_power_status) {
        this.getPowerStatus()
      }
    },
    // 复制
    clickCopy (id) {
      let tempId
      if (this.$refs[id].length) { // 循环的列表, 复制时, this.$refs[id] 为数组
        tempId = this.$refs[id][0]
      } else {
        tempId = this.$refs[id]
      }

      let copyNum = 0
      const clipboard = new ClipboardJS(tempId)
      clipboard.on('success', (e) => {
        this.$message.success(this.lang.zjmf_client_copy_success)
        copyNum++
        if (copyNum > 1) {
          clipboard.destroy()
        }
      })
      clipboard.on('error', (e) => {
        this.$message.error(this.lang.zjmf_client_copy_error)
      })
    },
    // ====== 控制台命令
    consoleHandleCommand (command) {
      this.consoleItem = command
      if (this.baseData.second.allow_second_verify === 1 && this.baseData.second.second_verify === 1 && this.baseData.second.second_verify_action_home.includes(command.split('-')[1])) {
        this.secondAction = command.split('-')[1]
        this.secondVerifyVis = true
      } else {
        this.consoleHandleCommandApi()
      }
    },
    // 控制台接口
    async consoleHandleCommandApi (code) {
      const mineArr = this.consoleItem.split('-')
      // const name = mineArr[0] // 截取name
      const func = mineArr[1] // 截取方法名
      const type = mineArr[2] // 截取类型
      if (type === 'default' && func === 'vnc') {
        const { data } = await defaultControlReq({
          id: this.hid,
          func,
          code: code || undefined
        })
        if (data.status === 200) {
          var winRef = window.open('url', '_blank')
          winRef.location = data.data.url
        } else {
          this.$message.error(data.msg)
        }
      } else if (type === 'custom') {
        const { data } = await customControlReq({
          id: this.hid,
          func,
          code: code || undefined
        })

        if (data.status !== 200) {
          this.$message.error(data.msg)
        } else {
          if (data.url) {
            window.open(data.url)
          } else {
            this.$message.success(data.msg)
          }
        }
      }
    },

    // ======= 控制命令
    controlHandleCommand (command) {
      this.controlItem = {
        name: command.split('-')[0],
        func: command.split('-')[1],
        type: command.split('-')[2]
      }

      if (this.controlItem.func === 'reinstall') {
        this.reinstallDialog = true
        this.creatCode(12)
      } else if (this.controlItem.func === 'crack_pass') {
        
        this.crackDialog = true
        this.creatCode(12)
      } else {
        this.$swal.fire({
          title: this.controlItem.name,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: th.lang.zjmf_layer_confirm,
          cancelButtonText: th.lang.zjmf_layer_cancel
        }).then(async (e) => {
          if (e.value) {
            if (this.baseData.second.allow_second_verify === 1 && this.baseData.second.second_verify === 1 && this.baseData.second.second_verify_action_home.includes(this.controlItem.func)) {
              this.secondAction = this.controlItem.func
              this.secondVerifyVis = true
            } else {
              this.defaultControlApi()
            }
          }
        })
      }
    },
    // 控制接口
    async defaultControlApi (code) {
      const obj = {
        id: this.hid,
        func: this.controlItem.func,
        code: code || undefined
      }
      if (this.controlItem.type === 'default') {
        this.btnLoading = true
        const { data } = await defaultControlReq(obj)
        if (data.status !== 200) {
          this.$message.error(data.msg)
        } else {
          this.$message.success(data.msg)
          // this.getBaseData()
          // this.getPowerStatus()
          this.refreashPowerStatusCycle()
          this.secondVerifyVis = false
        }
        this.btnLoading = false
      }
      if (this.controlItem.type === 'custom') {
        this.btnLoading = true
        const { data } = await customControlReq(obj)
        if (data.status !== 200) {
          this.$message.error(data.msg)
        } else {
          this.$message.success(data.msg)
          // this.getBaseData()
          // this.getPowerStatus()
          this.refreashPowerStatusCycle()
          this.secondVerifyVis = false

          if (data.url) {
            window.open(data.url)
          }
        }
        this.btnLoading = false
      }
    },

    // 破解密码
    // 生成随机密码
    creatCode (length) {
      let crackRePwd = '' // 存放验证码
      const codeLength = parseInt(length) // 设置验证码长度为6
      const codeChars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      for (let i = 0; i < codeLength; i++) {
        const charIndex = Math.floor(Math.random() * 52)
        crackRePwd += codeChars[charIndex]
      }
      const codeReg = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d).*$/
      var re = new RegExp(codeReg)

      if (re.test(crackRePwd)) {
        this.crackFrom.password = crackRePwd
        this.reinstallFormData.password = crackRePwd
        this.$refs.reinstallForm?this.$refs.reinstallForm.validateField('password'):null
        this.$refs.crackPassword?this.$refs.crackPassword.validateField('password'):null
      } else {
        this.creatCode(12)
      }
    },
    // 破解密码弹窗关闭
    creakonClose () {
      this.$refs.crackPassword.resetFields()
      // this.crackFrom.password = '' // 二次验证时, 密码弹窗关闭, 还未请求破解密码接口, 不能置空此字段
    },
    // 破解密码确定
    async  saveCrack() {
      this.$refs.crackPassword.validate(async (valid) => {
        if (!valid) {
          return false
        } else {
          if (this.baseData.second.allow_second_verify === 1 && this.baseData.second.second_verify === 1 && this.baseData.second.second_verify_action_home.includes('crack_pass')) {
            this.secondAction = 'crack_pass'
            this.crackDialog = false
            this.secondVerifyVis = true
          } else {
            this.saveCrackApi()
          }
        }
      })
    },
    // 破解密码接口
    async saveCrackApi (code) {
      const obj = {
        id: this.hid,
        func: 'crack_pass',
        password: this.crackFrom.password,
        code: code || undefined
      }
      this.btnLoading = true
      const { data } = await defaultControlReq(obj)
      if (data.status !== 200) {
        this.$message.error(data.msg)
      } else {
        
        this.$message.success(data.msg)
        // this.getBaseData()
        // this.getPowerStatus()
        this.refreashPowerStatusCycle()
        this.secondVerifyVis = false
        this.crackDialog = false
        this.getBaseData()
      }
      this.btnLoading = false
    },

    // 重装系统
    // 重装系统弹窗打开 调用操作系统数据
    async getOsData () {
      const { data } = await cloudOsReq({
        productid: this.baseData.host_data.productid,
        os_config_option_id: this.baseData.host_data.os_config_option_id
      })
      if (data.status !== 200) return false


      this.filterOsOptions = data.data.cloud_os
      this.reinstallFormData.osVal = data.data.cloud_os.length ? data.data.cloud_os[0].id : ''

      

      this.cloudOsGroupOptions = data.data.cloud_os_group||[]
      this.reinstallFormData.groupVal= data.data.cloud_os_group.length ? data.data.cloud_os_group[0].id : ''
      this.osSvgSelected= data.data.cloud_os_group.length ? data.data.cloud_os_group[0].name : ''

      this.cloudOsOptions = data.data.cloud_os
      this.creatCode(12)
      this.osGroupChange(this.reinstallFormData.groupVal)
    },
    showOsSvg (item) {
      if (item.name.toLowerCase().indexOf('windows') !== -1) {
        item.osSvg = 1
      } else if (item.name.toLowerCase().indexOf('centos') !== -1) {
        item.osSvg = 2
      } else if (item.name.toLowerCase().indexOf('ubuntu') !== -1) {
        item.osSvg = 3
      } else if (item.name.toLowerCase().indexOf('debian') !== -1) {
        item.osSvg = 4
      } else if (item.name.toLowerCase().indexOf('esxi') !== -1) {
        item.osSvg = 5
      } else if (item.name.toLowerCase().indexOf('xenserver') !== -1) {
        item.osSvg = 6
      } else if (item.name.toLowerCase().indexOf('freebsd') !== -1) {
        item.osSvg = 7
      } else if (item.name.toLowerCase().indexOf('fedora') !== -1) {
        item.osSvg = 8
      } else {
        item.osSvg = 9
      }
    },
    // 重装系统系统分组改变
    osGroupChange (val) {
      this.reinstallFormData.groupVal = val
      this.reinstallFormData.osVal = ''
      this.filterOsOptions = []
     
      this.filterOsOptions = this.cloudOsOptions.filter(item => {
        return item.group === val
      })
      // 第二个选项框的值为默认第一个
      this.reinstallFormData.osVal = this.filterOsOptions.length ? this.filterOsOptions[0].id : '';

      (this.cloudOsGroupOptions || []).forEach(item => {
        if (item.id === val) {
          this.osSvgSelected = item.name // 选中的系统图标
        }
      })
    },

    // 重装系统弹窗关闭
    reinstallClosed () {
      this.reInstallChecked = false
      // if (this.cloudOsGroupOptions.length) {
      //   // 如果有分组  做分组处理
      //   this.filterOsOptions = this.cloudOsOptions.filter(item => {
      //     return item.group === this.reinstallFormData.groupVal
      //   })
      //   this.reinstallFormData.osVal = this.filterOsOptions.length ? this.filterOsOptions[0].id : ''
      // } else {
      //   this.filterOsOptions = this.cloudOsOptions
      //   this.reinstallFormData.osVal = this.cloudOsOptions.length ? this.cloudOsOptions[0].id : ''
      // }
    },
    // 重装系统确定
    async saveReinstall(){
      this.$refs.reinstallForm.validate((valid) => {
        if (!valid) return false
        this.reinstallDialog = false
        if (this.baseData.second.allow_second_verify === 1 && this.baseData.second.second_verify === 1 && this.baseData.second.second_verify_action_home.includes('reinstall')) {
          this.secondAction = 'reinstall'
          this.reinstallDialog = false
          this.secondVerifyVis = true
        } else {
          this.reinstallApi()
        }
      })
    },

    // 0928重装系统接口
    async reinstallApi (code) {
      this.$swal.fire({
        title: th.lang.zjmf_reinstall_confirm,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: th.lang.zjmf_layer_confirm,
        cancelButtonText: th.lang.zjmf_layer_cancel
      }).then(async (e) => {
        if (e.value) {
          const obj = {
            id: this.hid,
            func: 'reinstall',
            os: this.reinstallFormData.osVal,
            code: code || undefined,
            password:this.reinstallFormData.password
          }
          this.btnLoading = true
          const { data } = await defaultControlReq(obj)
          if (data.status !== 200) {
            this.$message.error(data.msg)
          } else {
            this.$message.success(data.msg)
            this.refreashPowerStatusCycle()
            this.secondVerifyVis = false
            this.reinstallDialog = false
            this.getBaseData()
          }
          this.btnLoading = false
        }
      })
      
    },

    // 二次验证通过
    secondeVerifySuccess (e) {
      if (this.consoleItem) { // console: 控制台操作
        this.consoleHandleCommandApi(e.code)
      } else { // control: 控制按钮
        if (this.secondAction === 'reinstall') {
          this.reinstallApi(e.code)
        } else if (this.secondAction === 'crack_pass') {
          this.saveCrackApi(e.code)
        } else {
          this.defaultControlApi(e.code)
        }
      }
    },

    // 取消请求/停用
    async getCancelPage () {
      /*const { data } = await cancelPageReq({ host_id: this.hid })
      if (data.status !== 200) return false
      this.host_cancel = data.data.host_cancel // 1. 控制停用按钮是否显示 2.取消请求弹窗数据
      this.cancelistOptions = data.data.cancelist*/
    },

    // 取消请求提交
    cancelSubmit () {
      let txt = ''
      if (this.cancelFormData.type === 'Immediate') {
        txt = '这将会立刻删除您的产品，操作不可逆，所有数据丢失'
      } else {
        txt = '产品将会在到期当天被立刻删除，操作不可逆，所有数据丢失'
      }
      if (this.cancelFormData.tempReason !== 'other') {
        this.cancelFormData.reason = this.cancelFormData.tempReason
      }
      this.$refs.cancelForm.validate(valid => {
        if (!valid) return false

        this.cancelDialog = false // 确认框弹出前, 关闭模态框
        this.$swal.fire(txt, th.lang.zjmf_client_tips, {
          confirmButtonText: th.lang.zjmf_layer_confirm,
          cancelButtonText: th.lang.zjmf_layer_cancel,
          type: 'warning'
        }).then(async () => {
          const { data } = await cancelReq(this.cancelFormData)
          if (data.status !== 200) {
            this.$message.error(data.msg)
          } else {
            this.getBaseData()
            this.getCancelPage()
            this.$message.success(data.msg)
          }
        }).catch(() => { })
      })
    },

    // 取消弹窗打开
    async cancelOpen () {
      this.cancelFormData.type = undefined
      this.cancelFormData.tempReason = undefined
      this.cancelFormData.reason = ''
    },

    cancelOpened () {
      this.$refs.cancelForm.clearValidate()
    },

    // 关闭前清空验证
    beforeClose () {
      this.$refs.cancelForm.resetFields() // 先清空字段
      setTimeout(() => { // 清空字段后, 延迟清空验证, 解决: 部分字段关联, 导致部分验证无法清空的问题
        this.$refs.cancelForm.clearValidate()
        this.cancelDialog = false
      }, 100)
    },

    // 删除产品取消
    deleteCancel () {
      let tip = ''
      if (this.host_cancel.type !== 'Immediate') {
        tip = '您已选择到期时自动删除产品，当前可关闭停用设置，是否关闭？'
      } else {
        tip = '您已选择立刻删除产品，当前可关闭停用设置，是否关闭？'
      }
      this.$confirm(tip, th.lang.zjmf_client_tips, {
        confirmButtonText: th.lang.zjmf_layer_confirm,
        cancelButtonText: th.lang.zjmf_layer_cancel,
        type: 'warning'
      }).then(async () => {
        const { data } = await deleteCancelReq({ id: this.hid })
        if (data.status !== 200) {
          this.$message.error(data.msg)
        } else {
          this.getBaseData()
          this.getCancelPage()
          this.$message.success(data.msg)
        }
      }).catch(() => { })
    },

    // ========== 左侧 ==========
    flowDialogOpen () {
      this.tabIndex = 1
      this.getFlowPacket()
    },
    // 获取流量包列表 和 交易记录
    async getFlowPacket () {
      const { data } = await flowPacketReq({
        uid: this.baseData.host_data.uid,
        host_id: this.baseData.host_data.host_id,
        productid: this.baseData.host_data.productid,
        serverid: this.baseData.host_data.serverid,
        api_type: this.baseData.host_data.api_type,
        upstream_price_type: this.baseData.host_data.upstream_price_type,
        zjmf_api_id: this.baseData.host_data.zjmf_api_id,
        dcimid: this.baseData.host_data.dcimid,
        upstream_price_value: this.baseData.host_data.upstream_price_value,
        type: this.baseData.host_data.type,
        bwlimit: this.baseData.host_data.bwlimit,
        bwusage: this.baseData.host_data.bwusage
      })
      if (data.status !== 200) return false

      this.flowTableData = data.data.dcim.flowpacket
      this.recordeTableData = data.data.dcim.flow_packet_use_list
    },

    // 订购
    async  buy(row) {
      const { data } = await buyFlowPacketRes(this.hid, row.id)
      if (data.status !== 200) {
        this.$message.error(data.msg)
        return false
      }
      this.flowDialogVisible = false
      this.$refs.control.startPay({
        id: data.data.invoiceid,
        name: row.name
      })
    },

    
    // 分辨率改变, 重绘图表
    resize () {
      (this.module_chart || []).forEach(item => {
        echarts.init(document.getElementById(item.type + 'ChartBox')).resize()
        
      })
    //   setTimeout(()=>{
          
    //   },1000)
    this.screen =document.body.clientWidth

      if( this.usedChart){this.usedChart.resize()}
    },
    // 获取续费数据
    async getPriceData () {
      this.pricingLoading = true
      const { data } = await getRenewReq({ hostid: this.hid, billingcycles: this.renewCycle || this.baseData.host_data.billingcycle }) // 初次续费 续费周期 renewCycle 为空, 参数取产品的周期
      this.pricingLoading = false
      if (data.status !== 200) return false

      this.renewData = data.data
      if (data.data.host.nextduedate && data.data.host.billingcycle !== 'free' && data.data.host.billingcycle !== 'onetime') {
        this.overdue =  '天'
        if (parseInt(this.overdue) === 0) {
          this.overdue = '小时'
        }
      } else {
        this.overdue = ''
      }
    },
    // 续费周期 选择改变
    renewCycleChange () {
      //this.getPriceData();
      (this.renewData.cycle || []).forEach(item => {
        if (this.renewCycle === item.billingcycle) {
          this.renewPrice = item.amount
        }
      })
    },
    // 未支付状态 立即支付
    payNow () {
      this.$refs.control.startPay({
        id: this.renewData.host.id,
        name: this.$t('standaloneServer.pay')
      })
    },
    // 已支付状态 续费支付
    // 续费
    async renewPay() {
      this.renewDialogVisible = false
      const { data } = await renewReq({ hostid: this.hid, billingcycles: this.renewCycle })
      if (data.status === 1001) { // 无需付款, 续费成功
        this.$message.success(data.msg)
        //this.getPriceData()
      } else if (data.status === 200) {
        this.$refs.control.startPay({
          id: data.data.invoiceid,
          name: this.$t('standaloneServer.renew')
        })
      } else {
        this.$message.error(data.msg)
      }
    },

    // 弹窗打开, 获取充值记录等信息
    renewDialogOpen () {
      this.tabIndex = 1
      this.getRenewRecord()
    },

    // 续费充值记录
    async getRenewRecord () {
      const { data } = await getRechargeListReq(this.renewRecordSearch)
      if (data.status !== 200) return false
      this.renewRecordTableData = data.data.invoices
      this.renewTotal = data.data.count
    },
    // 分页大小改变
    handleReSizeChange (e) {
      this.renewRecordSearch.limit = e
      this.getRenewRecord()
    },

    // 修改备注
    handelConfirm () {
      this.$refs.remarkForm.validate(async valid => {
        if (!valid) {
          return false
        }
        const obj = {
          id: this.id,
          remark: this.remarkFormData.remark
        }
        const { data } = await changeRemarkReq(obj)
        if (data.status !== 200) {
          this.$message.error(data.msg)
        } else {
          this.$message.success(data.msg)
          this.remarkVis = false
          this.getBaseData()
        }
      })
    },

    // ========== 右侧 ==========
    // 获取用户自定义页面
    async getCustom (tab) {
      this.setRize()
      // 初始化时 tab 为空
      if (tab) {
        if (parseInt(tab.name) === 1) { // 点击了图表tab
          setTimeout(() => {
            this.getChartModule(this.baseData)
          }, 500)
        }
        if (parseInt(tab.name) === 4) { // 点击了图表tab
			this.chartOption()
			this.getData()
        }
        // 因为前面的tabs的name都是数字，从第5个开始为返回的key，所以不管前5个
        if (parseInt(tab.name) < 5) {

        } else {
          const jwt = localStorage.getItem('OrfLcI2IqQItv0vS')
          // const data = await getCustomReq(this.id, tab.name, jwt)
          this.htmlContent = this.$baseUrl + '/provision/custom/content?id=' + this.id + '&key=' + tab.name + '&jwt=' + jwt
        }
      }
    },

    setRize(){
      if(document.body.clientWidth<1000){
        setTimeout(()=>{
            if(this.tabActiveName==='1'){
              document.getElementsByClassName('server_right_box')[0].style.minHeight = 'auto'
              if(parent.document.getElementsByTagName("iframe")[0]&&document.body.clientWidth>600) 
                    {parent.document.getElementsByTagName("iframe")[0].style.height=document.body.scrollHeight+416*3+'px';}
              if(document.body.clientWidth<400&&parent.document.getElementsByTagName("iframe")[0])
                {
                    parent.document.getElementsByTagName("iframe")[0].style.height=document.body.scrollHeight+550*3+'px';
                  
                }
            }else{
              document.getElementsByClassName('server_right_box')[0].style.minHeight = 'auto'
            if(parent.document.getElementsByTagName("iframe")[0]&&document.body.clientWidth>600) 
              {parent.document.getElementsByTagName("iframe")[0].style.height=1400+'px';}
            if(document.body.clientWidth<400&&parent.document.getElementsByTagName("iframe")[0])
              {
                  parent.document.getElementsByTagName("iframe")[0].style.height=1600+'px';
                
              }
            }
          
            
        })
        
    }
    },






    //================================== chart ======================================
    // 图表配置
    // line
    lineChartOption (type, xAxisData, seriesData0, seriesData1, unit, label) {
      //console.log(echarts.init(document.getElementById(type + 'ChartBox')));
      // 硬盘IO
      const lineChart = echarts.init(document.getElementById(type + 'ChartBox'))
      lineChart.setOption({
        backgroundColor: '#fff',
        title: {
          subtext: (!xAxisData.length) ? this.lang.zjmf_client_data_no : '',
          left: 'center',
          textAlign: 'left',
          subtextStyle: {
            lineHeight: 250
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: '#7dcb8f'
            }
          },
          backgroundColor: '#fff',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          padding: [10, 10],
          extraCssText: 'box-shadow: 0px 4px 13px 1px rgba(1, 24, 167, 0.1);',
          formatter: function (params, ticket, callback) {
            // console.log('line:', params)
            const res = `<div>
                          <div>${params[0].marker} ${params[0].seriesName}：${params[0].value}${unit}</div>
                          <div>${params[1] ? params[1].marker : ''} ${params[1] ? params[1].seriesName : ''}${params[1] ? '：' : ''}${params[1] ? params[1].value : ''}${params[1] ? unit : ''}</div>
                          <div style="color: #999999;">${params[0].axisValue}</div>
                        </div>`
            return res
          }
        },
        grid: {
          left: '80',
          top: 20,
          x: 50,
          x2: 50,
          y2: 80
        },
        dataZoom: [ // 缩放
          {
            type: 'inside',
            throttle: 50
          }
        ],
        xAxis: [{
          offset: 15,
          type: 'category',
          boundaryGap: false,
          // 改变x轴颜色
          axisLine: {
            lineStyle: {
              type: 'dashed',
              color: '#ddd',
              width: 1
            }
          },
          // data: ['2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00'].map(function (str) {
          //   return str.replace(' ', '\n')
          // }),
          data: xAxisData,
          // 轴刻度
          axisTick: {
            show: false
          },
          // 轴网格
          splitLine: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#999999'
            }
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            formatter: '{value}' + unit,
            textStyle: {
              color: '#556677'
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        }],
        series: [{
          name: label[0],
          type: 'line',
          // data: [5, 12, 11, 14, 25, 16, 10, 18, 6],
          data: seriesData0,
          symbolSize: 1,
          symbol: 'circle',
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2
          },
          itemStyle: {
            normal: {
              color: '#75db16',
              borderColor: '#75db16'
            }
          }
        }, {
          name: label[1],
          type: 'line',
          // data: [10, 10, 30, 12, 15, 3, 7, 20, 15000],
          data: seriesData1,
          symbolSize: 1,
          symbol: 'circle',
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 3,
            shadowColor: 'rgba(92, 102, 255, 0.3)',
            shadowBlur: 10,
            shadowOffsetY: 20
          },
          itemStyle: {
            normal: {
              color: '#5c66ff',
              borderColor: '#5c66ff'
            }
          }
        }
        ]
      })
    },
    // area
    areaChartOption (type, xAxisData, seriesData, unit, label) {
      // CPU使用率
      const areaChart = echarts.init(document.getElementById(type + 'ChartBox'))
      areaChart.setOption({
        grid: {
          left: '80',
          top: 20,
          x: 50,
          x2: 50,
          y2: 80
        },
        backgroundColor: '#fff',
        title: {
          subtext: (!xAxisData.length) ? this.lang.zjmf_client_data_no : '',
          left: 'center',
          textAlign: 'left',
          subtextStyle: {
            lineHeight: 250
          }
        },
        tooltip: {
          backgroundColor: '#fff',
          padding: [10, 20, 10, 8],
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: '#7dcb8f'
            }
          },
          formatter: function (params, ticket, callback) {
            // console.log(params, '')
            const res = `<div>
                          <div>${params[0].seriesName}：${params[0].value}${unit} </div>
                          <div style="color: #999999;">${params[0].axisValue}</div>
                        </div>`
            return res
          },
          extraCssText: 'box-shadow: 0px 4px 13px 1px rgba(1, 24, 167, 0.1);'
        },
        dataZoom: [ // 缩放
          {
            type: 'inside',
            throttle: 50
          }
        ],
        xAxis: {
          offset: 15,
          type: 'category',
          boundaryGap: false,
          // 改变x轴颜色
          axisLine: {
            lineStyle: {
              color: '#999999',
              width: 1
            }
          },
          // data: ['2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00'].map(function (str) {
          //   return str.replace(' ', '\n')
          // }),
          data: xAxisData,
          // 轴刻度
          axisTick: {
            show: false
          },
          // 轴网格
          splitLine: {
            show: false
          },
          axisLabel: {
            show: true,
            // interval: 0, // 横轴信息全部显示
            textStyle: {
              color: '#999999'
            }
          }
        },
        yAxis: {
          axisTick: {
            show: false // 轴刻度不显示
          },
          max: 100,
          min: 0,
          // 改变y轴颜色
          axisLine: {
            show: false
          },
          // 轴网格
          splitLine: {
            show: true,
            lineStyle: {
              color: '#ddd',
              type: 'dashed'
            }
          },
          // 坐标轴文字样式
          axisLabel: {
            show: true,
            formatter: '{value}' + unit,
            textStyle: {
              color: '#999999'
            }
          }
        },
        series: [{
          name: label,
          type: 'line',
          areaStyle: {
            opacity: 1,
            color: '#737dff'
          },
          symbol: 'none', // 折线无拐点
          lineStyle: {
            normal: {
              width: 0 // 折线宽度
            }
          },
          smooth: true,
          // data: [5, 25, 20, 50, 10, 40, 18, 25, 0]
          data: seriesData

        }]
      })
    },

    // bar
    barChartOption (type, xAxisData, seriesData0, seriesData1, unit, label) {
      // 内存用量
      const barChart = echarts.init(document.getElementById(type + 'ChartBox'))
      barChart.setOption({
        backgroundColor: '#fff',
        title: {
          subtext: (!xAxisData.length) ? this.lang.zjmf_client_data_no : '',
          left: 'center',
          textAlign: 'left',
          subtextStyle: {
            lineHeight: 250
          }
        },
        tooltip: {
          backgroundColor: '#fff',
          padding: [10, 20, 10, 8],
          textStyle: {
            color: '#000',
            fontSize: 12
          },
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: '#7dcb8f'
            }
          },
          formatter: function (params, ticket, callback) {
            // console.log('bar:', params)
            const res = `
            <div>
                <div>${params[0].marker}${params[0].seriesName}：${params[0].value}${unit} </div>                
                <div>${params[1] ? params[1].marker : ''} ${params[1] ? params[1].seriesName : ''}${params[1] ? '：' : ''}${params[1] ? params[1].value : ''}${params[1] ? unit : ''}</div>
                <div>${params[0].axisValue}</div>
            </div>`
            return res
          },
          extraCssText: 'box-shadow: 0px 4px 13px 1px rgba(1, 24, 167, 0.1);'
        },
        grid: {
          left: '80',
          top: 20,
          x: 70,
          x2: 50,
          y2: 80
        },
        dataZoom: [ // 缩放
          {
            type: 'inside',
            throttle: 50
          }
        ],
        xAxis: {
          offset: 15,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#999'
            }
          },
          type: 'category',
          // 改变x轴颜色
          axisLine: {
            lineStyle: {
              type: 'dashed',
              color: '#ddd',
              width: 1
            }
          },
          // data: ['2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00'].map(function (str) {
          //   return str.replace(' ', '\n')
          // })
          data: xAxisData
        },
        yAxis: {
          axisTick: {
            show: false // 轴刻度不显示
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#999'
            },
            formatter: '{value}' + unit
          },
          // 轴网格
          splitLine: {
            show: true,
            lineStyle: {
              color: '#ddd',
              type: 'dashed'
            }
          }

        },
        series: [{
          name: label[1],
          type: 'bar',
          stack: '已用',
          
          // data: [136, 132, 101, 134, 90, 230, 210, 100, 300],
          data: seriesData1,
          itemStyle: {
            barBorderRadius: [5, 5, 0, 0],
            color: '#737dff'
          }
        },
        {
          name: label[0],
          type: 'bar',
          stack: '总量',
          barGap: '-100%',
          // data: [964, 182, 191, 234, 290, 330, 310, 100, 500],
          data: seriesData0,
          itemStyle: {
            barBorderRadius: [5, 5, 0, 0],
            color: '#ccc',
            opacity: 0.3
          }
        }
        ]
      })
    },

    // 获取图表模块
    async getChartModule (e) { // e: 父组件传入的数据 e === baseData, e的数据可以比baseData属性传值更快的拿到
      const chartModuleSearch = { // 模块查询条件
        host_id: e.host_data.host_id,
        api_type: e.host_data.api_type,
        domainstatus: e.host_data.domainstatus,
        type: e.host_data.type,
        zjmf_api_id: e.host_data.zjmf_api_id,
        dcimid: e.host_data.dcimid
      }
      const { data } = await getChartModuleReq(chartModuleSearch)
      if (data.status !== 200) return false;
      (data.data.module_chart || []).forEach(item => {
        item.start = undefined
        item.end = undefined
        item.loading = false // 数据加载中
       
        if(item.disk&&item.disk.length>0){
          item.value= item.disk[0].disk_id
        }
        if(item.flow&&item.flow.length>0){
          item.value= item.flow[0].network_id
        }
		 this.getChartData(item)
      })
      this.module_chart = data.data.module_chart
      this.createTime=data.data.create_time
    },

    // 获取模块数据
    async getChartData (e) {
      e.loading = true
      let params = {
        hostId: this.hid,
        type: e.type,
        select: undefined,
        start: e.start || undefined,
        end: e.end || undefined
      }
      if(e.disk&&e.disk.length>0){ params.disk =  e.value}
      if(e.flow&&e.flow.length>0){ params.network =  e.value}
      const { data } = await getChartDataReq(params)
      e.loading = false
      // echarts.init(document.getElementById(e.type + 'ChartBox')).hideLoading()
      if (data.status !== 200) return false

      const xAxisData = []
      const seriesData0 = []
      const seriesData1 = [];
      (data.data.list || []).forEach((item, index) => {
        (item || []).forEach(innerItem => {
          if (index === 0) {
            xAxisData.push(innerItem.time)
            seriesData0.push(innerItem.value)
          } else if (index === 1) {
            seriesData1.push(innerItem.value)
          }
        })
      })
      if (data.data.chart_type === 'area') {
        this.areaChartOption(e.type, xAxisData, seriesData0, data.data.unit, data.data.label)
      } else if (data.data.chart_type === 'line') {
        this.lineChartOption(e.type, xAxisData, seriesData0, seriesData1, data.data.unit, data.data.label)
      } else if (data.data.chart_type === 'bar') {
        this.barChartOption(e.type, xAxisData, seriesData0, seriesData1, data.data.unit, data.data.label)
      }

      // 如果初始查询没有时间, 则设置默认时间为返回数据的第一个和最后一个时间
      if (!e.start || !e.end) {
        if (data.data.list[0].length) {
          e.start = new Date(data.data.list[0][0].time).getTime()
          e.end = new Date(data.data.list[0][data.data.list[0].length - 1].time).getTime()
        }
      }
	  this.resize()
    },

    // 时间选择改变
    dateChange (e) {
      if (e.start && e.end && e.start < e.end) {
        this.getChartData(e)
      }
    },



    //============用量统计========
    // 图表配置
    chartOption () {
      this.usedChart = echarts.init(document.getElementById('usedChartBox'))
      this.usedChart.setOption({
        backgroundColor: '#fff',
        title: {
          subtext: '',
          left: 'center',
          textAlign: 'left',
          subtextStyle: {
            lineHeight: 400
          }
        },
        tooltip: {
          backgroundColor: '#fff',
          padding: [10, 20, 10, 8],
          textStyle: {
            color: '#000',
            fontSize: 12
          },
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: '#7dcb8f'
            }
          },
          formatter: function (params, ticket, callback) {
            // console.log(params)
            const res = `
            <div>
                <div>${th.lang.zjmf_client_traffic_usage}：${params[0].value} </div>
                <div>${params[0].axisValue}</div>
            </div>`
            return res
          },
          extraCssText: 'box-shadow: 0px 4px 13px 1px rgba(1, 24, 167, 0.1);'
        },
        grid: {
          left: '80',
          top: 20,
          x: 70,
          x2: 50,
          y2: 80
        },
        xAxis: {
          offset: 15,
          type: 'category',
          // data: ['2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00', '2020-08-11 11:30:00'].map(function (str) {
          //   return str.replace(' ', '\n')
          // }),
          data: [],
          boundaryGap: false,
          axisTick: {
            show: false
          },
          // 改变x轴颜色
          axisLine: {
            lineStyle: {
              type: 'dashed',
              color: '#ddd',
              width: 1
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#999'
            }
          }
        },
        yAxis: {
          type: 'value',
          // 轴网格
          splitLine: {
            show: true,
            lineStyle: {
              color: '#ddd',
              type: 'dashed'
            }
          },
          axisTick: {
            show: false // 轴刻度不显示
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            formatter: '{value}',
            textStyle: {
              color: '#999'
            },
          }
        },
        series: [{
          name: th.lang.zjmf_client_usage,
          type: 'line',
          smooth: true,
          showSymbol: true,
          symbol: 'circle',
          symbolSize: 3,
          // data: ['1200', '1400', '1008', '1411', '1026', '1288', '1300', '800', '1100', '1000', '1118', '123456'],
          data: [],
          areaStyle: {
            normal: {
              color: '#d4d1da',
              opacity: 0.2
            }
          },
          itemStyle: {
            normal: {
              color: '#0061ff' // 主要线条的颜色
            }
          },
          lineStyle: {
            normal: {
              width: 4,
              shadowColor: 'rgba(0,0,0,0.4)',
              shadowBlur: 10,
              shadowOffsetY: 10
            }
          }
        }]
      })
    },
  

    // 获取数据
    async getData () {
  
      this.usedChart.showLoading({
        text: '数据正在加载...',
        color: '#999',
        textStyle: { fontSize: 30, color: '#444' },
        effectOption: { backgroundColor: 'rgba(0, 0, 0, 0)' }
      })
      const { data } = await getCloudTrafficChartRes({
        //id: this.hid,
        start: this.usedStartTime,
        end: this.usedEndTime
      })
      this.usedChart.hideLoading()
      if (data.status !== 200) return false

      const xData = []
      const seriesData = [];
      (data.data.list || []).forEach(item => {
        xData.push(item.time)
        seriesData.push(item.value)
      })
      this.usedChart.setOption({
        title: {
          subtext: xData.length ? '' : this.lang.zjmf_client_data_no
        },
        xAxis: {
          data: xData
        },
        yAxis:{
          axisLabel: {
            show: true,
            formatter: '{value}' + data.data.unit,
            textStyle: {
              color: '#999'
            },
          }
        },
        tooltip: {
          formatter: function (params, ticket, callback) {
            // console.log(params)
            const res = `
            <div>
                <div>${th.lang.zjmf_client_traffic_usage}：${params[0].value}${data.data.unit} </div>
                <div>${params[0].axisValue}</div>
            </div>`
            return res
          },

        },
        series: [{
          data: seriesData
        }]
      })

      // 如果初始查询没有时间, 则设置默认时间为返回数据的第一个和最后一个时间
      if (!this.usedStartTime || !this.usedEndTime) {
        if (data.data.length) {
          this.usedStartTime = data.data[0].time
          this.usedEndTime = data.data[data.data.length - 1].time
        }
      }
	  if( this.usedChart){this.usedChart.resize()}
	  
    },

    // 时间选择改变
    dateChangeFlow () {
      const startTimeStamp = new Date(this.usedStartTime).getTime()
      const endTimeStamp = new Date(this.usedEndTime).getTime()

      // console.log('startTimeStamp:', startTimeStamp)
      // console.log('endTimeStamp:', endTimeStamp)

      if (this.usedStartTime && this.usedEndTime && startTimeStamp < endTimeStamp) {
        this.getData()
      }
    }
  },
  async created () {
    this.$swal = Swal
    this.getCancelPage()
    await this.getBaseData()
    this.$nextTick(function () { // 页面加载后再调用数据
      this.getChartModule(this.baseData)
    })
    
  },
  beforeCreate(){
    th = this
  },
  computed: {
    // 前端分页
    flowTableDataPage () {
      const start = (this.flowPage - 1) * this.flowLimit
      const end = this.flowPage * this.flowLimit
      return this.flowTableData.slice(start, end)
    },
    recordeTableDataPage () {
      const start = (this.recordPage - 1) * this.recordLimit
      const end = this.recordPage * this.recordLimit
      return this.recordeTableData.slice(start, end)
    },
    //操作按钮
      operaButton(){
        return [
            {type: "default", func: "unpaused", name: this.lang.zjmf_api_power_status_unpaused},
            {type: "default", func: "on", name: this.lang.zjmf_api_on},
            {type: "default", func: "off", name: this.lang.zjmf_api_off},
            {type: "default", func: "reboot", name: this.lang.zjmf_api_reboot},
            {type: "default", func: "hard_off", name: this.lang.zjmf_api_hardoff},
            {type: "default", func: "hard_reboot", name: this.lang.zjmf_api_hardreboot},
            {type: "default", func: "reinstall", name: this.lang.zjmf_api_reinstall},
          ]
      },
      reinstallFormDataRules(){

          return { // 重装系统表单数据
            password: [{
              required: true,
              message: th.lang.zjmf_check_password,
              trigger: 'blur'
            },
            {
              validator: (rule, value, callback) => {
                var regPassword = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{6,}$/
                if (!regPassword.test(value)) {javascript:;
                  callback(
                    new Error(th.lang.zjmf_client_password_error)
                  )
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }],
            agree: [{ required: true, message: th.lang.zjmf_clients_repassword_6, trigger: 'blur' },
            { validator: (rule, value, callback) => {
              if (value === true) {
                callback()
              } else {
                callback(new Error(th.lang.zjmf_clients_repassword_6))
              }
            }, trigger: 'blur' }
          ]
            
          }
    },
    minScreen(){
        let screen =0
        screen =this.screen<400?true:false
        return screen     
    }
  },
  mounted () {

    

    window.addEventListener('resize', this.resize)
    // 取消监听事件
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', this.resize)
    })
  }
})