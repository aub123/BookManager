const resolveISBN = (input) => {
    let resolve = ''
    let j = 0
    input = input.replace(/-+/g, "")
    if (isNaN(input)) {
        return false
    }
    for (let i = 0; i < input.length && i < 13; i++) {
        j++
        switch (j) {
            case 4: case 6: case 11: case 16:
                j++
                resolve = resolve + '-'
                break
            default:
                break
        }
        resolve = resolve + input[i]
    }

    return resolve
}

export default resolveISBN