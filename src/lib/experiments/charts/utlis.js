const kiloConverter = (value) => {
    let temp = value / 1000
   
    return temp > 1
        ? temp.toFixed(2) + "k"
        : value
}

export {kiloConverter}