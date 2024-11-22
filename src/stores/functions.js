import {timeParse, timeFormat, sort, max} from 'd3';

const gx1 = ["advertorial", "lander", "checkout", "upsell", "receipt"]
const spinner = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;


const selectableDays = [
    {
        name: "Today",
        value : 1,
    },
    {
        name: "Yesterday",
        value : 2,
    },
    {
        name: "7 Days",
        value : 7,
    },
    {
        name: "30 Days",
        value : 30,
    },
    {
        name: "90 Days",
        value : 90,
    },
    {
        name: "Custom",
        value : "Custom",
    }
];

const generateVariantIndices = (data) => {
    let indices = [];

    const experimentVariants = data.variants;
    const totalVariantLength = experimentVariants.reduce((accumulator, obj) => accumulator * obj.components.length, 1);

    for (let i = 0; i < totalVariantLength; i++) {
        const selectedVariant = i;

        let expIndices = {};

        for (let index = 0; index < experimentVariants.length; index++) {
            const sectionLength = experimentVariants[index].components.length;
            let currentIndex;

            if (index === 0) {
                currentIndex = selectedVariant % sectionLength < 0 ? 0 : selectedVariant % sectionLength;
            } else if (index === 1) {
                currentIndex = Math.ceil((selectedVariant % (experimentVariants[0].components.length * experimentVariants[1].components.length)) / experimentVariants[0].components.length) === 0 && selectedVariant !== 0 ? 0 : Math.floor((selectedVariant % (experimentVariants[0].components.length * experimentVariants[1].components.length)) / experimentVariants[0].components.length);
            } else if (index === 2) {
                currentIndex = Math.floor((selectedVariant % (experimentVariants[0].components.length * experimentVariants[1].components.length * experimentVariants[2].components.length)) / (experimentVariants[0].components.length * experimentVariants[1].components.length)) < 0 ? 0 : Math.floor((selectedVariant % (experimentVariants[0].components.length * experimentVariants[1].components.length * experimentVariants[2].components.length)) / (experimentVariants[0].components.length * experimentVariants[1].components.length));
            } else {
                currentIndex = Math.floor(selectedVariant / experimentVariants.slice(0, -`${experimentVariants.length - index}`).reduce((acc, obj) => acc * obj.components.length, 1));
            }

            expIndices[experimentVariants[index].name] = experimentVariants[index]['components'][currentIndex];
        }

        indices.push(expIndices);
    }

    return indices;
};

// Group the objects by variantId under variantIndices for the specified experimentId
const groupBy = (data, sortBy, innerVariant) => {
    return data.reduce((acc, obj) => {
        // Find the object with the specified experimentId
        const experiment = obj.variantIndices.find(vi => vi.experimentId === sortBy);

        let group = [];
        // If the experiment exists
        if (experiment) {
            // Find the existing group for the variantId or create a new group
            if (innerVariant) {
                group = acc[experiment.variants[innerVariant]] || [];
            } else {
                group = acc[experiment.variantId] || [];
            }

            // Push the object to the group
            group.push(obj);

            // Update the group in the accumulator
            if (innerVariant) {
                acc[experiment.variants[innerVariant]] = group;
            } else {
                acc[experiment.variantId] = group;
            }
        }
        
        return acc;
    }, {});
};

const componentStructureFunc = (variants) => Object.values(variants.reduce((acc, {arms}) => {
    arms.forEach(({name, component}) => {
        acc[name] = acc[name] || { name, components: [] };
        if (!acc[name].components.includes(component)) {
            acc[name].components.push(component);
        }
    });
    return acc;
}, {}));

const getSumOfRange = (start, end, increment) => {
    return Array.from({ length: Math.floor((end - start) / increment) + 1 }, (_, i) => start + i * increment)
        .reduce((acc, val) => acc + val, 0);
}

// Function to calculate conversion rate
const calculateConversionRate = (purchaseCount, uniqueSessionCount) => {
    return uniqueSessionCount !== 0 ? purchaseCount / uniqueSessionCount : 0;
};

// Function to get unique session IDs from an array of objects
const getUniqueSessionIds = (arr) => {
    return [...new Set(arr.map(obj => obj.sessionId))];
};

const getUniquePurchaseSessionIds = (arr) => {
    const purchaseEvents = arr.filter(obj => obj.eventName === "Purchase");
    
    return [...new Set(purchaseEvents.map(obj => obj.sessionId))];
};

const getTotalRevenue = (arr) => {
    return arr.reduce((total, obj) => obj.eventName === "Purchase" ? total + obj.amount : total, 0);
}

const getAverageRevenue = (arr) => {
    return (getTotalRevenue(arr) / getUniquePurchaseSessionIds(arr).length)
}

// Calculate conversion rates for each array
const conversionRatesByGroup = (data) => {
    return Object.entries(data).map(([key, array]) => {
        const uniqueSessions = getUniqueSessionIds(array).length;
        const purchaseCount = getUniquePurchaseSessionIds(array).length;
        const conversionRate = calculateConversionRate(purchaseCount, uniqueSessions);
        
        return { key, conversionRate };
    });
};

const getConversionRate = (data) => {
    const uniqueSessions = getUniqueSessionIds(data).length;
    const purchaseCount = getUniquePurchaseSessionIds(data).length;
    const conversionRate = calculateConversionRate(purchaseCount, uniqueSessions) * 100;
    
    return conversionRate;
};

const getEventCount = (data, eventToFilter, pageType) => {
    let eventLength = [...new Set(data.filter(item => item.pageType === pageType).map(item => item.sessionId))].length;

    // let eventLength = uniqueSessions.reduce((acc, sessionId) => {
    // 	let sessionPageViews = data.filter(item => item.sessionId === sessionId && item.eventName === eventToFilter);
        
    // 	return acc + sessionPageViews.length;
    // }, 0);

    return eventLength;
};

const processDataFunc = (d, dx = ["present", "past"], dv = "uniqueSessionCount", gx = []) => {
    let dropOffGroups = []
    if(dv == "value"){
        gx.map((name) => {
            dropOffGroups.splice(gx1.indexOf(name), 0, name)
        })
    } else {
        dropOffGroups = gx1
    }


    let varObj = []
    const processedData = []
    let xGroup = []

    dx.map((dd, i) => {
        varObj.push({
            [`previous${dd}PfValue`]: "",
            [`previous${dd}PercentageII`]: "",
            [`${dd}Path`]: d[dd]
        })
        let temp = []
        console.log(varObj,d);
        varObj[i][`${dd}Path`].map((a) => {
            if(dropOffGroups.includes(a.pageType)){
                let id = dropOffGroups.indexOf(a.pageType)
                a["id"] = id
                temp.push(a)
            }
        })
        varObj[i][`${dd}Path`] = [...temp]
        varObj[i][`${dd}Path`] = sort(d[dd], (ddd) => ddd.id);
    })
    let tempObject
    console.log(dropOffGroups);
    dropOffGroups.map((dd, i) => {
        let name = dd//.pageType;
        xGroup.push(name)
        tempObject = {}
        dx.map((k, j) => {
            tempObject[`${k}Value`] = varObj[j][`${k}Path`][i][dv]
        })

        if (i == 0) {
            processedData.push({
                name,
            })
            console.log(name);
            let maxValue = max(Object.values(tempObject))
            dx.map((k, j) => {
                let calculateValue =  ((tempObject[`${k}Value`] / maxValue) * 100).toFixed(2)
                processedData[i][`${k}PercentageI`] = tempObject[`${k}Value`] == 0 ? '0.00' : calculateValue
                processedData[i][`${k}PercentageII`] = tempObject[`${k}Value`] == 0 ? '0.00' : calculateValue
                processedData[i][`${k}Ratio`] = tempObject[`${k}Value`] == 0 ? '0.00' : calculateValue
                processedData[i][`${k}Value`] = tempObject[`${k}Value`]
                varObj[j][`previous${k}PfValue`] = tempObject[`${k}Value`]
                varObj[j][`previous${k}PercentageII`] = processedData[i][`${k}PercentageII`]
            })

        } else {
            processedData.push({
                name,
            })

            dx.map((k, j) => {
                const tempRatio = ((tempObject[`${k}Value`]/ processedData[i-1][`${k}Value`])* 100)
                const tempRatio2 = tempRatio > 100 && !isNaN(tempRatio) ? 100 : tempRatio
                const tempPercentageI = varObj[j][`previous${k}PercentageII`]
                //const tempPercentageII = +((tempObject[`${k}Value`] / varObj[j][`previous${k}PfValue`]) * 100)
                const tempPercentageII = ((tempObject[`${k}Value`]/ processedData[i-1][`${k}Value`])* tempPercentageI)

                processedData[i][`${k}Value`] = tempObject[`${k}Value`]
                processedData[i][`${k}Ratio`] = !isNaN(tempRatio2) ? tempRatio2.toFixed(2) : "0.00"
                processedData[i][`${k}PercentageI`] = tempPercentageI > 100 ? 100 : tempPercentageI
                processedData[i][`${k}PercentageII`] = tempPercentageII > 100 //!isNaN(tempRatio2) ? tempRatio2 : 0
                        ? 100
                        : !isNaN(tempPercentageII)
                        ? tempPercentageII.toFixed(2)
                        : "0.00"
                varObj[j][`previous${k}PercentageII`] = processedData[i][`${k}PercentageII`]
            })

        }

    })
    return [xGroup, processedData]
}

const parsePeriod = {
    hour: timeParse("%Y-%m-%dT%H:%M:%S.%L%Z"), // 2024-10-15T08:00:00.000Z
    day: timeParse("%Y-%m-%dT%H:%M:%S.%L%Z"),
    month: timeParse("%Y-%m-%dT%H:00:00.000Z")
}


// const FormatPeriod = {
// 	hour: timeFormat("%Y-%m-%dT%H:%M:%S.%LZ"), // 2024-10-15T08:00:00.000Z
// 	day: timeFormat("%Y-%m-%dT00:00:00.000Z"),
// 	month: timeFormat("%Y-%m-%dT%H:00:00.000Z")
// }

const parsePeriodNum = {
    "4": timeParse("%Y-%m-%d-%H"),
    "3": timeParse("%Y-%m-%d"),
    "2": timeParse("%Y-%m")
}

function generateRandomString(length) {
    const chars = '0123456789abcdefgh';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
}

export {
    groupBy,
    calculateConversionRate,
    getUniqueSessionIds,
    getUniquePurchaseSessionIds,
    conversionRatesByGroup,
    getConversionRate,
    getAverageRevenue,
    getTotalRevenue,
    getEventCount,
    getSumOfRange,
    generateRandomString,
    generateVariantIndices,
    processDataFunc,
    componentStructureFunc,
    spinner,
    parsePeriodNum,
    parsePeriod,
    //FormatPeriod,
    selectableDays
}