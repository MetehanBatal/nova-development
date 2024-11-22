/**
 * 0 : Arm
 * 1 : Country
 * 2 : purchaseAmount
 * 3 : checkoutPageName
 * 4 : advertorialPageName
 * 5 : variantId,
 * 6 : landingPageName
 * 7 : gender
 * 8 : referrer
 */
let Options = [
	{
		index: 0,
		id: 'Arm',
		name: 'Arm',
		type: 'dropdown',
		innerValues: [],
		innerOptions: [
			{
				index: 0,
				id: 'is',
				name: 'Is'
			},
			{
				index: 1,
				id: 'not',
				name: 'Is Not'
			},
			{
				index: 2,
				id: 'contains',
				name: 'Contains'
			},
			{
				index: 3,
				id: 'notcontains',
				name: 'Not Contains'
			}
		]
	},
	{
		index: 1,
		id: 'country',
		name: 'Country',
		type: 'dropdown',
		innerValues: [
			{
				name: "Afghanistan",
				value: "AF",
				index: 0
			},
			{
				name: "Aland Islands",
				value: "AX",
				index: 1
			},
			{
				name: "Albania",
				value: "AL",
				index: 2
			},
			{
				name: "Algeria",
				value: "DZ",
				index: 3
			},
			{
				name: "AmericanSamoa",
				value: "AS",
				index: 4
			},
			{
				name: "Andorra",
				value: "AD",
				index: 5
			},
			{
				name: "Angola",
				value: "AO",
				index: 6
			},
			{
				name: "Anguilla",
				value: "AI",
				index: 7
			},
			{
				name: "Antarctica",
				value: "AQ",
				index: 8
			},
			{
				name: "Antigua and Barbuda",
				value: "AG",
				index: 9
			},
			{
				name: "Argentina",
				value: "AR",
				index: 10
			},
			{
				name: "Armenia",
				value: "AM",
				index: 11
			},
			{
				name: "Aruba",
				value: "AW",
				index: 12
			},
			{
				name: "Australia",
				value: "AU",
				index: 13
			},
			{
				name: "Austria",
				value: "AT",
				index: 14
			},
			{
				name: "Azerbaijan",
				value: "AZ",
				index: 15
			},
			{
				name: "Bahamas",
				value: "BS",
				index: 16
			},
			{
				name: "Bahrain",
				value: "BH",
				index: 17
			},
			{
				name: "Bangladesh",
				value: "BD",
				index: 18
			},
			{
				name: "Barbados",
				value: "BB",
				index: 19
			},
			{
				name: "Belarus",
				value: "BY",
				index: 20
			},
			{
				name: "Belgium",
				value: "BE",
				index: 21
			},
			{
				name: "Belize",
				value: "BZ",
				index: 22
			},
			{
				name: "Benin",
				value: "BJ",
				index: 23
			},
			{
				name: "Bermuda",
				value: "BM",
				index: 24
			},
			{
				name: "Bhutan",
				value: "BT",
				index: 25
			},
			{
				name: "Bolivia, Plurinational State of",
				value: "BO",
				index: 26
			},
			{
				name: "Bosnia and Herzegovina",
				value: "BA",
				index: 27
			},
			{
				name: "Botswana",
				value: "BW",
				index: 28
			},
			{
				name: "Brazil",
				value: "BR",
				index: 29
			},
			{
				name: "British Indian Ocean Territory",
				value: "IO",
				index: 30
			},
			{
				name: "Brunei Darussalam",
				value: "BN",
				index: 31
			},
			{
				name: "Bulgaria",
				value: "BG",
				index: 32
			},
			{
				name: "Burkina Faso",
				value: "BF",
				index: 33
			},
			{
				name: "Burundi",
				value: "BI",
				index: 34
			},
			{
				name: "Cambodia",
				value: "KH",
				index: 35
			},
			{
				name: "Cameroon",
				value: "CM",
				index: 36
			},
			{
				name: "Canada",
				value: "CA",
				index: 37
			},
			{
				name: "Cape Verde",
				value: "CV",
				index: 38
			},
			{
				name: "Cayman Islands",
				value: "KY",
				index: 39
			},
			{
				name: "Central African Republic",
				value: "CF",
				index: 40
			},
			{
				name: "Chad",
				value: "TD",
				index: 41
			},
			{
				name: "Chile",
				value: "CL",
				index: 42
			},
			{
				name: "China",
				value: "CN",
				index: 43
			},
			{
				name: "Christmas Island",
				value: "CX",
				index: 44
			},
			{
				name: "Cocos (Keeling) Islands",
				value: "CC",
				index: 45
			},
			{
				name: "Colombia",
				value: "CO",
				index: 46
			},
			{
				name: "Comoros",
				value: "KM",
				index: 47
			},
			{
				name: "Congo",
				value: "CG",
				index: 48
			},
			{
				name: "Congo, The Democratic Republic of the Congo",
				value: "CD",
				index: 49
			},
			{
				name: "Cook Islands",
				value: "CK",
				index: 50
			},
			{
				name: "Costa Rica",
				value: "CR",
				index: 51
			},
			{
				name: "Cote d'Ivoire",
				value: "CI",
				index: 52
			},
			{
				name: "Croatia",
				value: "HR",
				index: 53
			},
			{
				name: "Cuba",
				value: "CU",
				index: 54
			},
			{
				name: "Cyprus",
				value: "CY",
				index: 55
			},
			{
				name: "Czech Republic",
				value: "CZ",
				index: 56
			},
			{
				name: "Denmark",
				value: "DK",
				index: 57
			},
			{
				name: "Djibouti",
				value: "DJ",
				index: 58
			},
			{
				name: "Dominica",
				value: "DM",
				index: 59
			},
			{
				name: "Dominican Republic",
				value: "DO",
				index: 60
			},
			{
				name: "Ecuador",
				value: "EC",
				index: 61
			},
			{
				name: "Egypt",
				value: "EG",
				index: 62
			},
			{
				name: "El Salvador",
				value: "SV",
				index: 63
			},
			{
				name: "Equatorial Guinea",
				value: "GQ",
				index: 64
			},
			{
				name: "Eritrea",
				value: "ER",
				index: 65
			},
			{
				name: "Estonia",
				value: "EE",
				index: 66
			},
			{
				name: "Ethiopia",
				value: "ET",
				index: 67
			},
			{
				name: "Falkland Islands (Malvinas)",
				value: "FK",
				index: 68
			},
			{
				name: "Faroe Islands",
				value: "FO",
				index: 69
			},
			{
				name: "Fiji",
				value: "FJ",
				index: 70
			},
			{
				name: "Finland",
				value: "FI",
				index: 71
			},
			{
				name: "France",
				value: "FR",
				index: 72
			},
			{
				name: "French Guiana",
				value: "GF",
				index: 73
			},
			{
				name: "French Polynesia",
				value: "PF",
				index: 74
			},
			{
				name: "Gabon",
				value: "GA",
				index: 75
			},
			{
				name: "Gambia",
				value: "GM",
				index: 76
			},
			{
				name: "Georgia",
				value: "GE",
				index: 77
			},
			{
				name: "Germany",
				value: "DE",
				index: 78
			},
			{
				name: "Ghana",
				value: "GH",
				index: 79
			},
			{
				name: "Gibraltar",
				value: "GI",
				index: 80
			},
			{
				name: "Greece",
				value: "GR",
				index: 81
			},
			{
				name: "Greenland",
				value: "GL",
				index: 82
			},
			{
				name: "Grenada",
				value: "GD",
				index: 83
			},
			{
				name: "Guadeloupe",
				value: "GP",
				index: 84
			},
			{
				name: "Guam",
				value: "GU",
				index: 85
			},
			{
				name: "Guatemala",
				value: "GT",
				index: 86
			},
			{
				name: "Guernsey",
				value: "GG",
				index: 87
			},
			{
				name: "Guinea",
				value: "GN",
				index: 88
			},
			{
				name: "Guinea-Bissau",
				value: "GW",
				index: 89
			},
			{
				name: "Guyana",
				value: "GY",
				index: 90
			},
			{
				name: "Haiti",
				value: "HT",
				index: 91
			},
			{
				name: "Holy See (Vatican City State)",
				value: "VA",
				index: 92
			},
			{
				name: "Honduras",
				value: "HN",
				index: 93
			},
			{
				name: "Hong Kong",
				value: "HK",
				index: 94
			},
			{
				name: "Hungary",
				value: "HU",
				index: 95
			},
			{
				name: "Iceland",
				value: "IS",
				index: 96
			},
			{
				name: "India",
				value: "IN",
				index: 97
			},
			{
				name: "Indonesia",
				value: "ID",
				index: 98
			},
			{
				name: "Iran, Islamic Republic of Persian Gulf",
				value: "IR",
				index: 99
			},
			{
				name: "Iraq",
				value: "IQ",
				index: 100
			},
			{
				name: "Ireland",
				value: "IE",
				index: 101
			},
			{
				name: "Isle of Man",
				value: "IM",
				index: 102
			},
			{
				name: "Israel",
				value: "IL",
				index: 103
			},
			{
				name: "Italy",
				value: "IT",
				index: 104
			},
			{
				name: "Jamaica",
				value: "JM",
				index: 105
			},
			{
				name: "Japan",
				value: "JP",
				index: 106
			},
			{
				name: "Jersey",
				value: "JE",
				index: 107
			},
			{
				name: "Jordan",
				value: "JO",
				index: 108
			},
			{
				name: "Kazakhstan",
				value: "KZ",
				index: 109
			},
			{
				name: "Kenya",
				value: "KE",
				index: 110
			},
			{
				name: "Kiribati",
				value: "KI",
				index: 111
			},
			{
				name: "Korea, Democratic People's Republic of Korea",
				value: "KP",
				index: 112
			},
			{
				name: "Korea, Republic of South Korea",
				value: "KR",
				index: 113
			},
			{
				name: "Kuwait",
				value: "KW",
				index: 114
			},
			{
				name: "Kyrgyzstan",
				value: "KG",
				index: 115
			},
			{
				name: "Laos",
				value: "LA",
				index: 116
			},
			{
				name: "Latvia",
				value: "LV",
				index: 117
			},
			{
				name: "Lebanon",
				value: "LB",
				index: 118
			},
			{
				name: "Lesotho",
				value: "LS",
				index: 119
			},
			{
				name: "Liberia",
				value: "LR",
				index: 120
			},
			{
				name: "Libyan Arab Jamahiriya",
				value: "LY",
				index: 121
			},
			{
				name: "Liechtenstein",
				value: "LI",
				index: 122
			},
			{
				name: "Lithuania",
				value: "LT",
				index: 123
			},
			{
				name: "Luxembourg",
				value: "LU",
				index: 124
			},
			{
				name: "Macao",
				value: "MO",
				index: 125
			},
			{
				name: "Macedonia",
				value: "MK",
				index: 126
			},
			{
				name: "Madagascar",
				value: "MG",
				index: 127
			},
			{
				name: "Malawi",
				value: "MW",
				index: 128
			},
			{
				name: "Malaysia",
				value: "MY",
				index: 129
			},
			{
				name: "Maldives",
				value: "MV",
				index: 130
			},
			{
				name: "Mali",
				value: "ML",
				index: 131
			},
			{
				name: "Malta",
				value: "MT",
				index: 132
			},
			{
				name: "Marshall Islands",
				value: "MH",
				index: 133
			},
			{
				name: "Martinique",
				value: "MQ",
				index: 134
			},
			{
				name: "Mauritania",
				value: "MR",
				index: 135
			},
			{
				name: "Mauritius",
				value: "MU",
				index: 136
			},
			{
				name: "Mayotte",
				value: "YT",
				index: 137
			},
			{
				name: "Mexico",
				value: "MX",
				index: 138
			},
			{
				name: "Micronesia, Federated States of Micronesia",
				value: "FM",
				index: 139
			},
			{
				name: "Moldova",
				value: "MD",
				index: 140
			},
			{
				name: "Monaco",
				value: "MC",
				index: 141
			},
			{
				name: "Mongolia",
				value: "MN",
				index: 142
			},
			{
				name: "Montenegro",
				value: "ME",
				index: 143
			},
			{
				name: "Montserrat",
				value: "MS",
				index: 144
			},
			{
				name: "Morocco",
				value: "MA",
				index: 145
			},
			{
				name: "Mozambique",
				value: "MZ",
				index: 146
			},
			{
				name: "Myanmar",
				value: "MM",
				index: 147
			},
			{
				name: "Namibia",
				value: "NA",
				index: 148
			},
			{
				name: "Nauru",
				value: "NR",
				index: 149
			},
			{
				name: "Nepal",
				value: "NP",
				index: 150
			},
			{
				name: "Netherlands",
				value: "NL",
				index: 151
			},
			{
				name: "Netherlands Antilles",
				value: "AN",
				index: 152
			},
			{
				name: "New Caledonia",
				value: "NC",
				index: 153
			},
			{
				name: "New Zealand",
				value: "NZ",
				index: 154
			},
			{
				name: "Nicaragua",
				value: "NI",
				index: 155
			},
			{
				name: "Niger",
				value: "NE",
				index: 156
			},
			{
				name: "Nigeria",
				value: "NG",
				index: 157
			},
			{
				name: "Niue",
				value: "NU",
				index: 158
			},
			{
				name: "Norfolk Island",
				value: "NF",
				index: 159
			},
			{
				name: "Northern Mariana Islands",
				value: "MP",
				index: 160
			},
			{
				name: "Norway",
				value: "NO",
				index: 161
			},
			{
				name: "Oman",
				value: "OM",
				index: 162
			},
			{
				name: "Pakistan",
				value: "PK",
				index: 163
			},
			{
				name: "Palau",
				value: "PW",
				index: 164
			},
			{
				name: "Palestinian Territory, Occupied",
				value: "PS",
				index: 165
			},
			{
				name: "Panama",
				value: "PA",
				index: 166
			},
			{
				name: "Papua New Guinea",
				value: "PG",
				index: 167
			},
			{
				name: "Paraguay",
				value: "PY",
				index: 168
			},
			{
				name: "Peru",
				value: "PE",
				index: 169
			},
			{
				name: "Philippines",
				value: "PH",
				index: 170
			},
			{
				name: "Pitcairn",
				value: "PN",
				index: 171
			},
			{
				name: "Poland",
				value: "PL",
				index: 172
			},
			{
				name: "Portugal",
				value: "PT",
				index: 173
			},
			{
				name: "Puerto Rico",
				value: "PR",
				index: 174
			},
			{
				name: "Qatar",
				value: "QA",
				index: 175
			},
			{
				name: "Romania",
				value: "RO",
				index: 176
			},
			{
				name: "Russia",
				value: "RU",
				index: 177
			},
			{
				name: "Rwanda",
				value: "RW",
				index: 178
			},
			{
				name: "Reunion",
				value: "RE",
				index: 179
			},
			{
				name: "Saint Barthelemy",
				value: "BL",
				index: 180
			},
			{
				name: "Saint Helena, Ascension and Tristan Da Cunha",
				value: "SH",
				index: 181
			},
			{
				name: "Saint Kitts and Nevis",
				value: "KN",
				index: 182
			},
			{
				name: "Saint Lucia",
				value: "LC",
				index: 183
			},
			{
				name: "Saint Martin",
				value: "MF",
				index: 184
			},
			{
				name: "Saint Pierre and Miquelon",
				value: "PM",
				index: 185
			},
			{
				name: "Saint Vincent and the Grenadines",
				value: "VC",
				index: 186
			},
			{
				name: "Samoa",
				value: "WS",
				index: 187
			},
			{
				name: "San Marino",
				value: "SM",
				index: 188
			},
			{
				name: "Sao Tome and Principe",
				value: "ST",
				index: 189
			},
			{
				name: "Saudi Arabia",
				value: "SA",
				index: 190
			},
			{
				name: "Senegal",
				value: "SN",
				index: 191
			},
			{
				name: "Serbia",
				value: "RS",
				index: 192
			},
			{
				name: "Seychelles",
				value: "SC",
				index: 193
			},
			{
				name: "Sierra Leone",
				value: "SL",
				index: 194
			},
			{
				name: "Singapore",
				value: "SG",
				index: 195
			},
			{
				name: "Slovakia",
				value: "SK",
				index: 196
			},
			{
				name: "Slovenia",
				value: "SI",
				index: 197
			},
			{
				name: "Solomon Islands",
				value: "SB",
				index: 198
			},
			{
				name: "Somalia",
				value: "SO",
				index: 199
			},
			{
				name: "South Africa",
				value: "ZA",
				index: 200
			},
			{
				name: "South Sudan",
				value: "SS",
				index: 201
			},
			{
				name: "South Georgia and the South Sandwich Islands",
				value: "GS",
				index: 202
			},
			{
				name: "Spain",
				value: "ES",
				index: 203
			},
			{
				name: "Sri Lanka",
				value: "LK",
				index: 204
			},
			{
				name: "Sudan",
				value: "SD",
				index: 205
			},
			{
				name: "Suriname",
				value: "SR",
				index: 206
			},
			{
				name: "Svalbard and Jan Mayen",
				value: "SJ",
				index: 207
			},
			{
				name: "Swaziland",
				value: "SZ",
				index: 208
			},
			{
				name: "Sweden",
				value: "SE",
				index: 209
			},
			{
				name: "Switzerland",
				value: "CH",
				index: 210
			},
			{
				name: "Syrian Arab Republic",
				value: "SY",
				index: 211
			},
			{
				name: "Taiwan",
				value: "TW",
				index: 212
			},
			{
				name: "Tajikistan",
				value: "TJ",
				index: 213
			},
			{
				name: "Tanzania, United Republic of Tanzania",
				value: "TZ",
				index: 214
			},
			{
				name: "Thailand",
				value: "TH",
				index: 215
			},
			{
				name: "Timor-Leste",
				value: "TL",
				index: 216
			},
			{
				name: "Togo",
				value: "TG",
				index: 217
			},
			{
				name: "Tokelau",
				value: "TK",
				index: 218
			},
			{
				name: "Tonga",
				value: "TO",
				index: 219
			},
			{
				name: "Trinidad and Tobago",
				value: "TT",
				index: 220
			},
			{
				name: "Tunisia",
				value: "TN",
				index: 221
			},
			{
				name: "Turkey",
				value: "TR",
				index: 222
			},
			{
				name: "Turkmenistan",
				value: "TM",
				index: 223
			},
			{
				name: "Turks and Caicos Islands",
				value: "TC",
				index: 224
			},
			{
				name: "Tuvalu",
				value: "TV",
				index: 225
			},
			{
				name: "Uganda",
				value: "UG",
				index: 226
			},
			{
				name: "Ukraine",
				value: "UA",
				index: 227
			},
			{
				name: "United Arab Emirates",
				value: "AE",
				index: 228
			},
			{
				name: "United Kingdom",
				value: "GB",
				index: 229
			},
			{
				name: "United States",
				value: "US",
				index: 230
			},
			{
				name: "Uruguay",
				value: "UY",
				index: 231
			},
			{
				name: "Uzbekistan",
				value: "UZ",
				index: 232
			},
			{
				name: "Vanuatu",
				value: "VU",
				index: 233
			},
			{
				name: "Venezuela, Bolivarian Republic of Venezuela",
				value: "VE",
				index: 234
			},
			{
				name: "Vietnam",
				value: "VN",
				index: 235
			},
			{
				name: "Virgin Islands, British",
				value: "VG",
				index: 236
			},
			{
				name: "Virgin Islands, U.S.",
				value: "VI",
				index: 237
			},
			{
				name: "Wallis and Futuna",
				value: "WF",
				index: 238
			},
			{
				name: "Yemen",
				value: "YE",
				index: 239
			},
			{
				name: "Zambia",
				value: "ZM",
				index: 240
			},
			{
				name: "Zimbabwe",
				value: "ZW",
				index: 241
			}
		],
		innerOptions: [
			{
				index: 0,
				id: 'is',
				name: 'Is'
			},
			{
				index: 1,
				id: 'not',
				name: 'Is Not'
			},
			{
				index: 2,
				id: 'contains',
				name: 'Contains'
			},
			{
				index: 3,
				id: 'notcontains',
				name: 'Not Contains'
			}
		]
	},
	{
		index: 2,
		id: 'purchaseAmount',
		name: 'Purchase Amount',
		type: 'number',
		innerOptions: [
			{
				index: 0,
				id: 'over',
				name: 'Over'
			},
			{
				index: 1,
				id: 'below',
				name: 'Below'
			},
			{
				index: 2,
				id: 'equals',
				name: 'Equals'
			}
		]
	},
	{
		index: 3,
		id: 'checkoutPageName',
		name: 'Checkout Page Name',
		type: 'dropdown',
		innerOptions: [
			{
				index: 0,
				id: 'is',
				name: 'Is'
			},
			{
				index: 1,
				id: 'not',
				name: 'Is Not'
			},
			{
				index: 2,
				id: 'contains',
				name: 'Contains'
			},
			{
				index: 3,
				id: 'notcontains',
				name: 'Not Contains'
			}
		],
		innerValues: [
			{
				name: 'mve-checkout-0',
				value: 'mve-checkout-0',
				index: 0
			}
		]
	},
	{
		index: 4,
		id: 'advertorialPageName',
		name: 'Advertorial Page Name',
		type: 'dropdown',
		innerOptions: [
			{
				index: 0,
				id: 'is',
				name: 'Is'
			},
			{
				index: 1,
				id: 'not',
				name: 'Is Not'
			},
			{
				index: 2,
				id: 'contains',
				name: 'Contains'
			},
			{
				index: 3,
				id: 'notcontains',
				name: 'Not Contains'
			}
		],
		innerValues: [
			{
				name: "mve-a-s6-reasons-0",
				value: "mve-a-s6-reasons-0",
				index: 0
			},
			{
				name: "mve-a-s6-reasons-1",
				value: "mve-a-s6-reasons-1",
				index: 1
			},
			{
				name: "mve-a-s6-reasons-2",
				value: "mve-a-s6-reasons-2",
				index: 2
			},
			{
				name: "mve-a-s6-reasons-3",
				value: "mve-a-s6-reasons-3",
				index: 3
			},
			{
				name: "mve-a-s6-reasons-4",
				value: "mve-a-s6-reasons-4",
				index: 4
			},
			{
				name: "mve-a-s6-reasons-5",
				value: "mve-a-s6-reasons-5",
				index: 5
			},
			{
				name: "mve-a-s6-reasons-6",
				value: "mve-a-s6-reasons-6",
				index: 6
			},
			{
				name: "mve-a-s6-reasons-7",
				value: "mve-a-s6-reasons-7",
				index: 7
			},
			{
				name: "mve-a-s6-reasons-8",
				value: "mve-a-s6-reasons-8",
				index: 8
			},
			{
				name: "mve-a-s6-reasons-9",
				value: "mve-a-s6-reasons-9",
				index: 9
			},
			{
				name: "mve-a-s6-reasons-10",
				value: "mve-a-s6-reasons-10",
				index: 10
			},
			{
				name: "mve-a-s6-reasons-11",
				value: "mve-a-s6-reasons-11",
				index: 11
			}
		]
	},
	{
		index: 5,
		id: 'VariantId',
		name: 'Variant ID',
		type: 'dropdown',
		innerOptions: [
			{
				index: 0,
				id: 'is',
				name: 'Is'
			},
			{
				index: 1,
				id: 'not',
				name: 'Is Not'
			},
			{
				index: 2,
				id: 'contains',
				name: 'Contains'
			},
			{
				index: 3,
				id: 'notcontains',
				name: 'Not Contains'
			}
		],
		innerValues: []
	},
	{
		index: 6,
		id: 'landingPageName',
		name: 'Landing Page Name',
		type: 'dropdown',
		innerOptions: [
			{
				index: 0,
				id: 'is',
				name: 'Is'
			},
			{
				index: 1,
				id: 'not',
				name: 'Is Not'
			},
			{
				index: 2,
				id: 'contains',
				name: 'Contains'
			},
			{
				index: 3,
				id: 'notcontains',
				name: 'Not Contains'
			}
		],
		innerValues: []
	},
	{
		index: 7,
		id: 'gender',
		name: 'Gender',
		type: 'dropdown',
		innerOptions: [
			{
				index: 0,
				id: 'is',
				name: 'Is'
			},
			{
				index: 1,
				id: 'not',
				name: 'Is Not'
			},
			{
				index: 2,
				id: 'contains',
				name: 'Contains'
			},
			{
				index: 3,
				id: 'notcontains',
				name: 'Not Contains'
			}
		],
		innerValues: []
	},
	{
		index: 8,
		id: 'referrer',
		name: 'Referrer',
		type: 'dropdown',
		innerOptions: [
			{
				index: 0,
				id: 'is',
				name: 'Is'
			},
			{
				index: 1,
				id: 'not',
				name: 'Is Not'
			},
			{
				index: 2,
				id: 'contains',
				name: 'Contains'
			},
			{
				index: 3,
				id: 'notcontains',
				name: 'Not Contains'
			}
		],
		innerValues: []
	}
];

let filters = [...Options.slice(0, 4)]
let breakdowns  = [Options[5], Options[1],  Options[4], ...Options.slice(6)]
breakdowns.map((d, i) => d.index = i)

export {
	filters,
	breakdowns
}