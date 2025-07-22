import request from '../utils/request'

export default {
  /**
   * 分类相关
   * 
   */

  // 添加分类
  addCategory(data) {
    return request({
      url: '/api/sts/category/addCategory',  // 接口路径
      method: 'post',    // 请求方式
      data      // 请求参数
    })
  },
  // 删除分类
  deleteCategory(_id) {
    return request({
      url: `/api/sts/category/deleteCategory?ids=${[_id]}`,  // 接口路径
      method: 'delete',    // 请求方式
    })
  },
  // 查询分类列表树
  getCategoryList() {
    return request({
      url: '/api/sts/category/selectCategoryTree',  // 接口路径
      method: 'get',    // 请求方式
    })
  },
  // 查询分类列表
  getAllCategory() {
    return request({
      url: '/api/sts/category/selectCategoryList',  // 接口路径
      method: 'get',    // 请求方式
    })
  },
  // 更新分类
  updateCategory(data) {
    return request({
      url: '/api/sts/category/updateCategory',  // 接口路径
      method: 'put',    // 请求方式
      data      // 请求参数
    })
  },

  // 添加门店
  addStores(data) {
    return request({
      url: '/api/sts/store/addStore',  // 接口路径
      method: 'post',    // 请求方式
      data      // 请求参数
    })
  },
//   获取门店列表
  getStoresList(params) {
    return request({
      url: '/api/sts/store/selectStoreList',  // 接口路径
      method: 'get',    // 请求方式
      params      // 请求参数
    })
  },
  // 编辑门店
  editStores(data) {
    return request({
      url: `/api/sts/store/updateStore`,  // 接口路径
      method: 'put',    // 请求方式
      data      // 请求参数
    })
  },
  // 删除门店
  deleteStores(_id) {
    return request({
      url: `/api/sts/store/deleteStore?ids=${[_id]}`,  // 接口路径
      method: 'delete',    // 请求方式
    })
  },
  // 更新门店状态
  updateStoreStatus(data) {
    return request({
      url: `/api/sts/store/updateStoreStatus`,  // 接口路径
      method: 'put',    // 请求方式
      data      // 请求参数
    })
  },
  // 添加商品
  addProduct(data) {
    return request({
      url: `/api/pds/product/addProduct`,  // 接口路径
      method: 'post',    // 请求方式
      data      // 请求参数
    })
  },
  // 删除商品
  deleteProduct(data) {
    return request({
      url: `/api/pds/product/deleteProduct`,  // 接口路径
      method: 'delete',    // 请求方式
      data
    })
  },
  // 查询商品列表
  getProductList(params) {
    return request({
      url: `/api/pds/product/selectProductList`,  // 接口路径
      method: 'get',    // 请求方式
      params      // 请求参数
    })
  },
  // 更新商品
  updateProduct(data) {
    return request({
      url: `/api/pds/product/updateProduct`,  // 接口路径
      method: 'put',    // 请求方式
      data      // 请求参数
    })
  },
  // 更新商品状态
  updateProductStatus(data) {
    return request({
      url: `/api/pds/product/updateProductStatus`,  // 接口路径
      method: 'put',    // 请求方式
      data      // 请求参数
    })
  },
}