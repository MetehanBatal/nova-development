const collectionValue = {
    pageSlug : [
        {
            index: 0,
            id: "/checkout/secure",
            name: "/checkout/secure"
        },
        {
            index: 1,
            id: "/up/1a",
            name: "/up/1a"
        },
        {
            index: 2,
            id: "/up/2a",
            name: "/up/2a"
        },
        {
            index: 3,
            id: "/receipt",
            name: "/receipt"
        }

    ],

    pageName : [
        {
            index: 0,
            id: "lander",
            name: "Lander"
        },
        {
            index: 1,
            id: "advertorial",
            name: "Advertorial"
        },
        {
            index: 2,
            id: "checkout",
            name: "Checkout"
        },
    ],

    pageType : [
        {
            index: 0,
            id: "lander",
            name: "Lander"
        },
        {
            index: 1,
            id: "advertorial",
            name: "Advertorial"
        },
        {
            index: 2,
            id: "checkout",
            name: "Checkout"
        },
    ]
}

const measurementType = [
    {
        index: 0,
        id: "unique",
        name: "Unique users",
    },
    {
        index: 1,
        id: "total",
        name: "Total users",
    },
]

const operatorType = {
    string: [
        {
            index: 0,
            name: "equals"
        },
        {
            index: 1,
            name: "not equal"
        },
        {
            index: 2,
            name: "contains"
        },
        {
            index: 3,
            name: "not contains"
        },
    ],
    typeless: [
        {
            index: 0,
            name: "set"
        },
        {
            index: 1,
            name: "not set"
        }
    ],
    number: [
        {
            index: 0,
            name: "greater"
        },
        {
            index: 1,
            name: "less"
        }
    ],
    boolean: [
        {
            index: 0,
            name: "is true"
        },
        {
            index: 1,
            name: "is false"
        }
    ]
}
const events = [
    {
        index: 0,
        id: "PageView",
        name: "PageView",
    },
    {
        index: 1,
        id: "Purchase",
        name: "Purchase",
    },
    {
        index: 2,
        id: "AddToCart",
        name: "AddToCart",
    },
    {
        index: 3,
        id: "Refund",
        name: "Refund",
    },
]

//     {
//         index: 0,
//         id: "PageView",
//         name: "PageView",
//     },
//     {
//         index: 1,
//         id: "Purchase",
//         name: "Purchase",
//     },
//     {
//         index: 2,
//         id: "placeholderEventName",
//         name: "placeholderEventName",
//     },
//     {
//         index: 3,
//         id: "AddToCart",
//         name: "AddToCart",
//     },
//     {
//         index: 4,
//         id: "Refund",
//         name: "Refund",
//     },
//     {
//         index: 5,
//         id: "PageView[Amount]",
//         name: "PageView[Amount]",
//     },
//     {
//         index: 6,
//         id: "Purchase[Amount]",
//         name: "Purchase[Amount]",
//     },
//     {
//         index: 7,
//         id: "Purchase[Amount]",
//         name: "Purchase[Amount]",
//     },
//     {
//         index: 8,
//         id: "Refund[Amount]",
//         name: "Refund[Amount]",
//     },
//     {
//         index: 9,
//         id: "AddToCart[Amount]",
//         name: "AddToCart[Amount]",
//     },


// ];

// PageView / Purchase / Purchase / Refund
const operator = [
    {
        index: 0,
        name: "Multiply",
        icon: `*`
    },
    {
        index: 1,
        name: "Sum",
        icon: `+`
    },
    {
        index: 2,
        name: "Divide",
        icon: `/`
    },
    {
        index: 3,
        name: "Subtract",
        icon: `-`
    }
]

const dataType = {
    "addFilter" : {
        icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.6668 2H1.3335L6.66683 8.30667V12.6667L9.3335 14V8.30667L14.6668 2Z" stroke="#6D6D6E" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,

        text:  "Add Filter",
        action: "addFilter",
        data: operatorType
    },
    "renameEvent" : {
        icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.6668 2H1.3335L6.66683 8.30667V12.6667L9.3335 14V8.30667L14.6668 2Z" stroke="#6D6D6E" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,

        text:  "Rename Event",
        action: "renameEvent",
        data: operatorType
    },
     "formula" : {
        icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_721_11976)">
            <path d="M10 8V12" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 10H12" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.3335 5.33337H6.66683C5.93045 5.33337 5.3335 5.93033 5.3335 6.66671V13.3334C5.3335 14.0698 5.93045 14.6667 6.66683 14.6667H13.3335C14.0699 14.6667 14.6668 14.0698 14.6668 13.3334V6.66671C14.6668 5.93033 14.0699 5.33337 13.3335 5.33337Z" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2.66683 10.6667C1.9335 10.6667 1.3335 10.0667 1.3335 9.33337V2.66671C1.3335 1.93337 1.9335 1.33337 2.66683 1.33337H9.3335C10.0668 1.33337 10.6668 1.93337 10.6668 2.66671" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
            <clipPath id="clip0_721_11976">
            <rect width="16" height="16" fill="white"/>
            </clipPath>
            </defs>
            </svg>`,
        text:  "formula",
        action: "changeType",
        data: operatorType
    },
    "string" : {
        icon : `<svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.9999 10.3941V5.28006C14.9999 3.16106 11.2299 3.16106 10.6919 4.75006" stroke="#6D6D6E" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M14.9999 6.86703C12.4569 6.33703 10.4229 6.91203 10.4229 8.64703C10.4229 10.904 14.1929 10.5 14.9999 9.07103V6.86703Z" stroke="#6D6D6E" stroke-width="1.5"/>
            <path d="M1 10.5L2.077 7.5M2.077 7.5L4.14 1.753C4.16672 1.67894 4.21562 1.61491 4.28004 1.56964C4.34446 1.52437 4.42127 1.50005 4.5 1.5C4.57873 1.50005 4.65554 1.52437 4.71996 1.56964C4.78438 1.61491 4.83328 1.67894 4.86 1.753L6.923 7.5M2.077 7.5H6.923M8 10.5L6.923 7.5" stroke="#6D6D6E" stroke-width="1.5" stroke-linecap="round"/>
            </svg>`,
        text:  "string",
        action: "changeType",
        data: operatorType
    },
    "number" :{
        icon : `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.3335 5.25H11.6668" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2.3335 8.75H11.6668" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5.83317 1.75L4.6665 12.25" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9.33317 1.75L8.1665 12.25" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
        text:  "number",
        action: "changeType",
        data: operatorType
    },
    "boolean" : {
        icon : `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.4998 9.33329C10.4998 8.68896 9.9775 8.16663 9.33317 8.16663C8.68884 8.16663 8.1665 8.68896 8.1665 9.33329V10.5C8.1665 11.1443 8.68884 11.6666 9.33317 11.6666C9.9775 11.6666 10.4998 11.1443 10.4998 10.5V9.33329Z" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5.83333 3.50004C5.83333 2.85571 5.311 2.33337 4.66667 2.33337C4.02233 2.33337 3.5 2.85571 3.5 3.50004V4.66671C3.5 5.31104 4.02233 5.83337 4.66667 5.83337C5.311 5.83337 5.83333 5.31104 5.83333 4.66671V3.50004Z" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3.5 11.6666H5.83333" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.1665 5.83337H10.4998" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3.5 8.16663H4.66667V11.6666" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.1665 2.33337H9.33317V5.83337" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`
        ,
        text:  "boolean",
        action: "changeType",
        data: operatorType
    },
    "date" :{
        icon : `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.6665 1.16663V3.49996" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9.3335 1.16663V3.49996" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.0833 2.33337H2.91667C2.27233 2.33337 1.75 2.85571 1.75 3.50004V11.6667C1.75 12.311 2.27233 12.8334 2.91667 12.8334H11.0833C11.7277 12.8334 12.25 12.311 12.25 11.6667V3.50004C12.25 2.85571 11.7277 2.33337 11.0833 2.33337Z" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M1.75 5.83337H12.25" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
        text:  "date",
        action: "changeType",
        data: operatorType
    }
}


const sideMenuObj = {
    showChildrenTraits: {
        icon : `<svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.9999 10.394V5.28C14.9999 3.161 11.2299 3.161 10.6919 4.75" stroke="#6D6D6E" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M14.9999 6.86703C12.4569 6.33703 10.4229 6.91203 10.4229 8.64703C10.4229 10.904 14.1929 10.5 14.9999 9.07103V6.86703Z" stroke="#6D6D6E" stroke-width="1.5"/>
                <path d="M1 10.5L2.077 7.5M2.077 7.5L4.14 1.753C4.16672 1.67894 4.21562 1.61491 4.28004 1.56964C4.34446 1.52437 4.42127 1.50005 4.5 1.5C4.57873 1.50005 4.65554 1.52437 4.71996 1.56964C4.78438 1.61491 4.83328 1.67894 4.86 1.753L6.923 7.5M2.077 7.5H6.923M8 10.5L6.923 7.5" stroke="#6D6D6E" stroke-width="1.5" stroke-linecap="round"/>
                </svg>`,
        text:  "Change Type",
        action: "showChildren",
        children: {
            formula: dataType.formula,
            string: dataType.string
        }
    },
    showChildren: {
        icon : `<svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.9999 10.394V5.28C14.9999 3.161 11.2299 3.161 10.6919 4.75" stroke="#6D6D6E" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M14.9999 6.86703C12.4569 6.33703 10.4229 6.91203 10.4229 8.64703C10.4229 10.904 14.1929 10.5 14.9999 9.07103V6.86703Z" stroke="#6D6D6E" stroke-width="1.5"/>
                <path d="M1 10.5L2.077 7.5M2.077 7.5L4.14 1.753C4.16672 1.67894 4.21562 1.61491 4.28004 1.56964C4.34446 1.52437 4.42127 1.50005 4.5 1.5C4.57873 1.50005 4.65554 1.52437 4.71996 1.56964C4.78438 1.61491 4.83328 1.67894 4.86 1.753L6.923 7.5M2.077 7.5H6.923M8 10.5L6.923 7.5" stroke="#6D6D6E" stroke-width="1.5" stroke-linecap="round"/>
                </svg>`,
        text:  "Change Type",
        action: "showChildren",
        children: {
            string: dataType.string,
            number: dataType.number,
            boolean: dataType.boolean,
            date: dataType.date
        }
    },
    addFilter: {
        icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.6668 2H1.3335L6.66683 8.30667V12.6667L9.3335 14V8.30667L14.6668 2Z" stroke="#6D6D6E" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
        text:  "Add Filter",
        action: "addFilter",
    },
    renameEvent: {
        icon : `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_721_19036)">
                    <path d="M9.91602 1.74996C10.0646 1.5744 10.2483 1.4315 10.4556 1.33036C10.6629 1.22923 10.8891 1.17208 11.1198 1.16256C11.3505 1.15304 11.5807 1.19135 11.7957 1.27507C12.0107 1.35878 12.2058 1.48605 12.3685 1.64877C12.5312 1.81149 12.658 2.00608 12.7408 2.22016C12.8236 2.43423 12.8606 2.66308 12.8494 2.89212C12.8382 3.12116 12.779 3.34537 12.6757 3.55046C12.5724 3.75555 12.4272 3.93702 12.2493 4.0833L4.37435 11.9583L1.16602 12.8333L2.04102 9.62496L9.91602 1.74996Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9.91602 1.74996C10.0646 1.5744 10.2483 1.4315 10.4556 1.33036C10.6629 1.22923 10.8891 1.17208 11.1198 1.16256C11.3505 1.15304 11.5807 1.19135 11.7957 1.27507C12.0107 1.35878 12.2058 1.48605 12.3685 1.64877C12.5312 1.81149 12.658 2.00608 12.7408 2.22016C12.8236 2.43423 12.8606 2.66308 12.8494 2.89212C12.8382 3.12116 12.779 3.34537 12.6757 3.55046C12.5724 3.75555 12.4272 3.93702 12.2493 4.0833L4.37435 11.9583L1.16602 12.8333L2.04102 9.62496L9.91602 1.74996Z" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.75 2.91663L11.0833 5.24996" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.75 2.91663L11.0833 5.24996" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_721_19036">
                    <rect width="14" height="14" fill="white"/>
                    </clipPath>
                    </defs>
                </svg>`,
        text:  "Rename Event",
        action: "renameEvent",
    },
    duplicate: {
        icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_721_11369)">
                        <path d="M10 8V12" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 10H12" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M13.3333 5.33331H6.66659C5.93021 5.33331 5.33325 5.93027 5.33325 6.66665V13.3333C5.33325 14.0697 5.93021 14.6666 6.66659 14.6666H13.3333C14.0696 14.6666 14.6666 14.0697 14.6666 13.3333V6.66665C14.6666 5.93027 14.0696 5.33331 13.3333 5.33331Z" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2.66659 10.6666C1.93325 10.6666 1.33325 10.0666 1.33325 9.33331V2.66665C1.33325 1.93331 1.93325 1.33331 2.66659 1.33331H9.33325C10.0666 1.33331 10.6666 1.93331 10.6666 2.66665" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_721_11369">
                            <rect width="16" height="16" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>`,
        text:  "Duplicate",
        action: "duplicate",
    },
    remove: {
        icon : `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.75 3.5H12.25" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M1.75 3.5H12.25" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11.0846 3.5V11.6667C11.0846 12.25 10.5013 12.8333 9.91797 12.8333H4.08464C3.5013 12.8333 2.91797 12.25 2.91797 11.6667V3.5" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11.0846 3.5V11.6667C11.0846 12.25 10.5013 12.8333 9.91797 12.8333H4.08464C3.5013 12.8333 2.91797 12.25 2.91797 11.6667V3.5" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4.66797 3.49984V2.33317C4.66797 1.74984 5.2513 1.1665 5.83464 1.1665H8.16797C8.7513 1.1665 9.33464 1.74984 9.33464 2.33317V3.49984" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4.66797 3.49984V2.33317C4.66797 1.74984 5.2513 1.1665 5.83464 1.1665H8.16797C8.7513 1.1665 9.33464 1.74984 9.33464 2.33317V3.49984" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5.83203 6.4165V9.9165" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5.83203 6.4165V9.9165" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8.16797 6.4165V9.9165" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8.16797 6.4165V9.9165" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg> `,
        text:  "Remove",
        action: "remove",
    },
    formula: {
        icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.66669V3.33335C12 3.15654 11.9298 2.98697 11.8047 2.86195C11.6797 2.73693 11.5101 2.66669 11.3333 2.66669H4.33333C4.27143 2.66669 4.21075 2.68393 4.15809 2.71647C4.10543 2.74901 4.06288 2.79558 4.03519 2.85095C4.00751 2.90632 3.99579 2.9683 4.00135 3.02996C4.00691 3.09161 4.02952 3.1505 4.06667 3.20002L7.06667 7.20002C7.23976 7.43082 7.33333 7.71153 7.33333 8.00002C7.33333 8.28851 7.23976 8.56923 7.06667 8.80002L4.06667 12.8C4.02952 12.8495 4.00691 12.9084 4.00135 12.9701C3.99579 13.0317 4.00751 13.0937 4.03519 13.1491C4.06288 13.2045 4.10543 13.251 4.15809 13.2836C4.21075 13.3161 4.27143 13.3334 4.33333 13.3334H11.3333C11.5101 13.3334 11.6797 13.2631 11.8047 13.1381C11.9298 13.0131 12 12.8435 12 12.6667V11.3334" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
        text:  "Add Formula",
        action: "formula",
        data: events
    }
}

const fValue  = [
    {
        index: 0,
        id: "pageSlug",
        name: "pageSlug"
    },
    {
        index: 1,
        id: "pageName",
        name: "pageName"
    },
    {
        index: 2,
        id: "productType",
        name: "productType"
    },
    {
        index: 3,
        id: "productId",
        name: "productId"
    },
    {
        index: 4,
        id: "sessionId",
        name: "sessionId"
    },
    {
        index: 5,
        id: "pageType",
        name: "pageType"
    },
]

const session = [
    {
        index: 0,
        id: "sessionId",
        name: "sessionId",
    },
    {
        index: 1,
        id: "productName",
        name: "productName",
    },
    {
        index: 2,
        id: "country",
        name: "country",
    },
    {
        index: 3,
        id: "gender",
        name: "gender",
    },
    {
        index: 4,
        id: "amount",
        name: "amount",
    },
    {
        index: 5,
        id: "timestamp",
        name: "timestamp"
    }
]

const events_session = [
    {
        index: 0,
        id: "PageView",
        name: "PageView",
    },
    {
        index: 1,
        id: "Purchase",
        name: "Purchase",
    },
    {
        index: 2,
        id: "placeholderEventName",
        name: "placeholderEventName",
    },
    {
        index: 3,
        id: "AddToCart",
        name: "AddToCart",
    },
    {
        index: 4,
        id: "sessionId",
        name: "sessionId",
    },
    {
        index: 5,
        id: "productName",
        name: "productName",
    },
    {
        index: 6,
        id: "country",
        name: "country",
    },
    {
        index: 7,
        id: "gender",
        name: "gender",
    },
    {
        index: 8,
        id: "timestamp",
        name: "timestamp"
    },
    {
        index: 9,
        id: "PageView[Amount]",
        name: "PageView[Amount]",
    },
    {
        index: 10,
        id: "Purchase[Amount]",
        name: "Purchase[Amount]",
    },
    {
        index: 11,
        id: "Refund[Amount]",
        name: "Refund[Amount]",
    },
    {
        index: 12,
        id: "AddToCart[Amount]",
        name: "AddToCart[Amount]",
    },

]

const traitOperator = [

    {
        index: 0,
        id: "count",
        name: "Count Events"
    },
    {
        index: 1,
        id: "sum",
        name: "Sum Values"
    }
]
let chartTypeObj = [
    {
        index: 0,
        id: "line",
        name: "Line",
        icon: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.58984 15.46L10.5098 9.80002L14.5598 12.78L18.9998 8.33002" stroke="#6D6D6D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19 19H4.78C4.30791 19 3.85516 18.8125 3.52135 18.4786C3.18754 18.1448 3 17.6921 3 17.22V3" stroke="#6D6D6D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`
    },
    {
        index: 1,
        id: "bar",
        name: "Bar",
        icon: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.58984 15.46L10.5098 9.80002L14.5598 12.78L18.9998 8.33002" stroke="#6D6D6D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19 19H4.78C4.30791 19 3.85516 18.8125 3.52135 18.4786C3.18754 18.1448 3 17.6921 3 17.22V3" stroke="#6D6D6D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`
    },
    {
        index: 2,
        id: "doughnut",
        name: "Doughnut",
        icon: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.58984 15.46L10.5098 9.80002L14.5598 12.78L18.9998 8.33002" stroke="#6D6D6D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19 19H4.78C4.30791 19 3.85516 18.8125 3.52135 18.4786C3.18754 18.1448 3 17.6921 3 17.22V3" stroke="#6D6D6D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`
    },
    {
        index: 3,
        id: "funnel",
        name: "Funnel",
    },
];
export{
    measurementType,
    events,
    fValue,
    operator,
    operatorType,
    dataType,
    collectionValue,
    session,
    events_session,
    traitOperator,
    chartTypeObj,
    sideMenuObj
}

