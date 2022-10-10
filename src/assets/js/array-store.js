import storage from 'good-storage'

// arr需要插入的数组 item需要插入数组的元素 compare比较条件
// 保存之前看有没有 没有加插入 有就不插入
function insertArray(arr, item, compare, maxLen) {
    const index = arr.findIndex(compare)
    if (index > -1) {
        return
    }
    arr.unshift(item)
    if (maxLen && arr.length > maxLen) {
        arr.pop()
    }
}
// item 存储的值 key存储的键 compare 判断存储的条件
export function save(item, key, compare, maxLen) {
    const arr = storage.get(key, [])
    insertArray(arr, item, compare, maxLen)
    storage.set(key, arr)
    return arr
}

// 删除逻辑 同上
function deleteArray(arr, compare) {
    const index = arr.findIndex(compare)
    if (index > -1) {
        arr.splice(index, 1)
    }
}
export function remove(key, compare) {
    const arr = storage.get(key, [])
    deleteArray(arr, compare)
    storage.set(key, arr)
    return arr
}
export function load(key) {
    return storage.get(key, [])
}