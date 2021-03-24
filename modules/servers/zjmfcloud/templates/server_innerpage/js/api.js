const instance = axios.create({
  baseURL: '',
  timeout: 60000,
  headers: {'Authorization': 'JWT ' + ''}
});
// 请求拦截器
instance.interceptors.request.use(
  config => {
    if (!config.params) {
      config.params = { request_time: new Date().getTime() }
    } else {
      config.params.request_time = new Date().getTime()
    }
    return config
  }
)


// 产品基础数据
 function hostProductReq (params) {
  return  instance({
    url: 'clientarea.php',
    params
  })
}

// 右侧数据
 function hostMoudleReq (params) {
  return instance({
    url: 'clientarea.php',
    params
  })
}

/**
 * 云服务器默认方法
 * @param {提交的数据} data
 */
 function defaultControlReq (data) {
  return instance({
    url: 'clientarea.php?action=productdetails&id='+getUrlParam('id')+'&ac=default',
    method: 'post',
    data
  })
}

/**
 * 云服务器自定义方法
 * @param {提交的数据} data
 */
 function customControlReq (data) {
  return instance({
    url: 'provision/button',
    method: 'post',
    data
  })
}

// 重装系统弹窗数据
 function cloudOsReq (params) {
  return instance({
    url: 'clientarea.php?action=productdetails&id='+getUrlParam('id')+'&ac=cloudos_layer',
    params
  })
}
/*
// 取消请求页面数据
 function cancelPageReq (params) {
  return instance({
    url: 'host/cancel',
    params
  })
}

// 提交请求取消请求
 function cancelReq (data) {
  return instance({
    url: '/host/cancel',
    method: 'post',
    data
  })
}
// 删除产品取消请求
 function deleteCancelReq (params) {
  return instance({
    url: '/host/cancel',
    method: 'delete',
    params
  })
}*/

// 获取流量包列表 和 交易记录列表
 function flowPacketReq (params) {
  return instance({
    url: 'host/flowpacket',
    params
  })
}

/**
 * 购买流量包生成账单
 * @param {提交数据} data
 */
 function buyFlowPacketRes (id, fid) {
  return instance({
    url: '/dcim/buy_flow_packet',
    method: 'post',
    data: {
      id,
      fid
    }
  })
}

/**
 * 获取续费数据
 */
 /*
 function getRenewReq (params) {
  return instance({
    url: 'host/renewpage',
    params
  })
}
 */
/**
 * 续费
 * @param {提交数据} data
 */
 /*
 function renewReq (data) {
  return instance({
    url: 'host/renew',
    method: 'post',
    data
  })
}*/

/**
 * 充值记录列表数据
 * @param {产品id} hostid
 * @param {页码} page
 * @param {每页条数} limit
 * @param {排序字段} order
 * @param {排序规则} sort
 * @param {搜索} keywords
 */
 function getRechargeListReq (params) {
  return instance({
    url: 'host/hostrecharge',
    params
  })
}

// ============ 图表 ==============
 function getChartModuleReq (params) {
  return instance({
    url: 'clientarea.php?action=productdetails&id='+getUrlParam('id')+'&ac=chart',
    params
  })
}
/**
 * 云服务器图表数据
 * @param {服务器id} hostId
 */
 function getChartDataReq (params) {
  return instance({
    url: 'clientarea.php?action=productdetails&id='+getUrlParam('id')+'&ac=chart',
    params
  })
}

// ============ 日志 ==============
/**
 * 获取服务器日志
 */
 function getLogListReq (params) {
  return instance({
    url: 'user_logdcims',
    params
  })
}

// ============ 升降级 ==============
// 升降级产品可配置项页面
 function upgradeConfigPageReq (params) {
  return instance({
    url: '/upgrade/index/' + params.hid,
    params
  })
}

// 升降级产品可配置项页面提交(包括使用优惠码)
 function upgradeConfigPostReq (data) {
  return instance({
    url: '/upgrade/upgrade_config_post',
    method: 'post',
    data
  })
}

// 升降级产品可配置项结算页面
 function upgradeConfigPayPageReq (params) {
  return instance({
    url: '/upgrade/upgrade_config_page',
    params
  })
}

// 升降级产品可配置项--应用优惠码
 function addPromoCodeConfigReq (data) {
  return instance({
    url: '/upgrade/add_promo_code',
    method: 'post',
    data
  })
}

// 升降级产品可配置项--结算
 function checkoutConfigUpgradeReq (data) {
  return instance({
    url: '/upgrade/checkout_config_upgrade',
    method: 'post',
    data
  })
}

// 升降级产品页面
 function upgradeProductPageReq (params) {
  return instance({
    url: '/upgrade/upgrade_product/' + params.hid,
    params
  })
}

// 升降级产品页面提交(包括使用优惠码的情况)
 function upgradeProductPostReq (data) {
  return instance({
    url: '/upgrade/upgrade_product_post',
    method: 'post',
    data
  })
}

// 升降级产品 结算页面
 function upgradeProductPayPageReq (params) {
  return instance({
    url: '/upgrade/upgrade_product_page',
    params
  })
}

// 升降级产品--应用优惠码
 function addPromoCodeProReq (data) {
  return instance({
    url: '/upgrade/add_promo_code_product',
    method: 'post',
    data
  })
}

// 升降级产品结算
 function checkoutUpgradeProductReq (data) {
  return instance({
    url: '/upgrade/checkout_upgrade_product',
    method: 'post',
    data
  })
}

// 升降级产品可配置项--移除优惠码
 function removePromoCodeReq (data) {
  return instance({
    url: '/upgrade/remove_promo_code',
    method: 'post',
    data
  })
}

// 升降级产品--移除优惠码
 function removePromoCodeProductReq (data) {
  return instance({
    url: '/upgrade/remove_promo_code_product',
    method: 'post',
    data
  })
}

// ============ 用量 ==============
/**
* 获取云产品用量图表
* @param {产品id} id
* @param {开始时间} start
*/
 function getCloudTrafficChartRes (params) {
  return instance({
	url: 'clientarea.php?action=productdetails&id='+getUrlParam('id')+'&ac=trafficusage',  
    params
  })
}

// ============ 文件下载 ==============
 function getDownListRes (params) {
  return instance({
    url: 'host/down',
    params
  })
}

/**
 * 修改备注
 * @param {id,remark} data
 */
 function changeRemarkReq (data) {
  return instance({
    url: '/host/remark',
    method: 'post',
    data
  })
}
