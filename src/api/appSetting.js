import request from '../utils/request'

export default {
    // 添加轮播图
    addCarouselimg(data) {
        return request({
            url: '/api/carousel/addCarousel',
            method: 'post',    // 请求方式
            data      // 请求参数
        })
    },
    // 删除轮播图
    deleteCarouselimg(id) {
        return request({
            url: `/api/carousel/deleteCarousel?ids=${[id]}`,
            method: 'delete'
        })
    },
    // 获取轮播图列表
    getCarouselimgList(params) {
        return request({
            url: '/api/carousel/queryCarouselList',
            method: 'get',
            params
        })
    },
    // 编辑轮播图
    editCarouselimg(data) {
        return request({
            url: `/api/carousel/updateCarousel`,
            method: 'put',
            data
        })
    },
    // 更新轮播图状态
    updateCarouselStatus(data) {
        return request({
            url: `/api/carousel/updateCarouselStatus`,
            method: 'put',
            data
        })
    },
}