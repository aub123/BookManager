export default function strRand() {
    const arr = ['baisheng.jpg', 'miaozan.jpg', 'xiangzi.jpg', 'yuanxing.jpg', 'yunying.jpg']
    const index = Math.floor(Math.random()*5)
    return `./static/${arr[index]}`
}